 /*!
 * @license
 * Copyright 2019 Alfresco, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CardItemTypeService, CardViewUpdateService, AppConfigService } from '@alfresco/adf-core';
import { FormBuilder, Validators, FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import moment from 'moment-es6';

@Component({
    selector: 'ama-process-timer-definition',
    templateUrl: './timer-definition-item.component.html',
    providers: [CardItemTypeService]
})
export class CardViewTimerDefinitionItemComponent implements OnInit, OnDestroy {

    MIN_TIME_VALUE = 0;

    @Input() property;

    timers = [];
    selectedTimer: Bpmn.DiagramElement;
    defaultTimerDefinition = '';
    defaultTimerType = '';
    timerDefinitionForm: FormGroup;
    today = new Date();

    onDestroy$: Subject<void> = new Subject<void>();

    constructor(
        private cardViewUpdateService: CardViewUpdateService,
        private appConfigService: AppConfigService,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.timers = this.appConfigService.get('process-modeler.timer-types');

        this.buildForm();
        this.setTimerFromXML();
    }

    buildForm() {
        this.timerDefinitionForm = this.formBuilder.group({
            timerType: new FormControl(undefined, [Validators.required]),
            date: new FormControl(undefined, []),
            years: new FormControl(undefined, [Validators.min(this.MIN_TIME_VALUE)]),
            months: new FormControl(undefined, [Validators.min(this.MIN_TIME_VALUE)]),
            weeks: new FormControl(undefined, [Validators.min(this.MIN_TIME_VALUE)]),
            days: new FormControl(undefined, [Validators.min(this.MIN_TIME_VALUE)]),
            hours: new FormControl(undefined, [Validators.min(this.MIN_TIME_VALUE)]),
            minutes: new FormControl(undefined, [Validators.min(this.MIN_TIME_VALUE)]),
            seconds: new FormControl(undefined, [Validators.min(this.MIN_TIME_VALUE)]),
            repetitions: new FormControl(undefined, [Validators.min(this.MIN_TIME_VALUE)]),
            processVariable: new FormControl(undefined, []),
            isProcessVariable: new FormControl(false, []),
        });

        this.timerDefinitionForm.valueChanges
            .pipe(
                debounceTime(500),
                takeUntil(this.onDestroy$)
            )
            .subscribe(() => {
                if (this.isFormValid()) {
                    this.updateTimerDefinition();
                }
            });
    }

    updateTimerDefinition() {
        const timerDefinition = this.getTimerDefinitionFromForm();

            this.cardViewUpdateService.update(this.property, {
                type: this.timerType.value,
                definition: timerDefinition
            });
    }

    getTimerDefinitionFromForm(): string {
        let definition = '';

        if (this.isProcessVariable.value) {
            return '${' + this.processVariable.value + '}';
        }

        if (this.isCycleTimer()) {
            definition += 'R';
            definition += this.repetitions.value ? this.repetitions.value : '';
            definition += '/';
        }

        if (this.isDateTimer()) {
            definition += this.date.value ? this.date.value.toISOString() : '';
            definition += this.isCycleTimer() && this.date.value ? '/' : '';
        }

        if (this.isDurationTimer()) {
            definition += moment.duration({
                seconds: this.seconds.value,
                minutes: this.minutes.value,
                hours: this.hours.value,
                days: this.days.value,
                weeks: this.weeks.value,
                months: this.months.value,
                years: this.years.value
            }).toISOString();
        }

        return definition;
    }

    setTimerFromXML() {
        const timerEventDefinition = this.property.data.element.businessObject.eventDefinitions[0];

        if (timerEventDefinition.timeCycle) {
            this.timerType.setValue('timeCycle');
            this.extractCycleFromXML(timerEventDefinition.timeCycle.body);
        } else if (timerEventDefinition.timeDuration) {
            this.timerType.setValue('timeDuration');
            this.extractDurationFromXML(timerEventDefinition.timeDuration.body);
        } else if (timerEventDefinition.timeDate) {
            this.timerType.setValue('timeDate');
            this.extractDateFromXML(timerEventDefinition.timeDate.body);
        }
    }

    extractCycleFromXML(cycleDefinitionValue: string) {
        if (cycleDefinitionValue.includes('$')) {
            this.extractProcessVariableFromXML(cycleDefinitionValue);
        } else {
            const timerDefinitions = cycleDefinitionValue.split('/');
            this.repetitions.setValue(timerDefinitions[0].substring(1));

            this.extractDateFromXML(timerDefinitions[1]);
            this.extractDurationFromXML(timerDefinitions[2]);
        }
    }

    extractDateFromXML(dateDefinitionValue: string) {
        if (dateDefinitionValue.includes('$')) {
            this.extractProcessVariableFromXML(dateDefinitionValue);
        } else {
            this.date.setValue(new Date(dateDefinitionValue));
        }
    }

    extractDurationFromXML(durationDefinition: string) {
        if (durationDefinition.includes('$')) {
            this.extractProcessVariableFromXML(durationDefinition);
        } else {
            const parsedDuration = <any>moment.duration(durationDefinition);

            this.years.setValue(parsedDuration._data.years);
            this.months.setValue(parsedDuration._data.months);
            this.weeks.setValue(Math.floor(parsedDuration._data.days / 7));
            this.days.setValue(parsedDuration._data.days % 7);
            this.hours.setValue(parsedDuration._data.hours);
            this.minutes.setValue(parsedDuration._data.minutes);
            this.seconds.setValue(parsedDuration._data.seconds);
        }
    }

    extractProcessVariableFromXML(processVariableDefinition: string) {
        const processVariable = processVariableDefinition.substr(2, processVariableDefinition.length - 3);
        this.processVariable.setValue(processVariable);
        this.isProcessVariable.setValue(true);
    }

    isFormValid() {
        return this.timerDefinitionForm && this.timerDefinitionForm.dirty && this.timerDefinitionForm.valid;
    }

    isDateTimer() {
        return (this.timerType.value === 'timeDate' || this.isCycleTimer()) && !this.isProcessVariable.value;
    }

    isDurationTimer() {
        return (this.timerType.value === 'timeDuration' || this.isCycleTimer()) && !this.isProcessVariable.value;
    }

    isCycleTimer() {
        return this.timerType.value === 'timeCycle' && !this.isProcessVariable.value;
    }

    isTimerTypeDefined() {
        return !!this.timerType.value;
    }

    get timerType(): AbstractControl {
        return this.timerDefinitionForm.get('timerType');
    }

    get date(): AbstractControl {
        return this.timerDefinitionForm.get('date');
    }

    get years(): AbstractControl {
        return this.timerDefinitionForm.get('years');
    }

    get months(): AbstractControl {
        return this.timerDefinitionForm.get('months');
    }

    get weeks(): AbstractControl {
        return this.timerDefinitionForm.get('weeks');
    }

    get days(): AbstractControl {
        return this.timerDefinitionForm.get('days');
    }

    get hours(): AbstractControl {
        return this.timerDefinitionForm.get('hours');
    }

    get minutes(): AbstractControl {
        return this.timerDefinitionForm.get('minutes');
    }

    get seconds(): AbstractControl {
        return this.timerDefinitionForm.get('seconds');
    }

    get repetitions(): AbstractControl {
        return this.timerDefinitionForm.get('repetitions');
    }

    get processVariable(): AbstractControl {
        return this.timerDefinitionForm.get('processVariable');
    }

    get isProcessVariable(): AbstractControl {
        return this.timerDefinitionForm.get('isProcessVariable');
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
