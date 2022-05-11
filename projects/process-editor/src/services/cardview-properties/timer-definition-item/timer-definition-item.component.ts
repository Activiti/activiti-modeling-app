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

/* eslint-disable max-lines */

import { Component, Input, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CardItemTypeService, CardViewUpdateService, AppConfigService, MomentDateAdapter } from '@alfresco/adf-core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, takeUntil, filter, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import moment from 'moment-es6';
import { AmaState, EntityProperty, selectSelectedProcess, ProcessExtensionsModel, AMA_DATETIME_FORMATS} from '@alfresco-dbp/modeling-shared/sdk';
import { Store } from '@ngrx/store';
import { TimerDefinitionItemModel } from './timer-definition-item.model';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DatetimeAdapter, MAT_DATETIME_FORMATS } from '@mat-datetimepicker/core';
import { MomentDatetimeAdapter } from '@mat-datetimepicker/moment';

@Component({
    selector: 'ama-process-timer-definition',
    templateUrl: './timer-definition-item.component.html',
    styleUrls: ['./timer-definition-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        CardItemTypeService,
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: DatetimeAdapter, useClass: MomentDatetimeAdapter },
        { provide: MAT_DATETIME_FORMATS, useValue: AMA_DATETIME_FORMATS }
    ]
})
export class CardViewTimerDefinitionItemComponent implements OnInit, OnDestroy {

    CRON_REGEX = '((\\*|\\?|\\d+((\\/|\\-){0,1}(\\d+))*)\\s*){6}';
    MIN_TIME_VALUE = 0;

    @Input() property: TimerDefinitionItemModel;

    timers = [];
    selectedTimer: Bpmn.DiagramElement;
    defaultTimerDefinition = '';
    defaultTimerType = '';
    timerDefinitionForm: FormGroup;
    today = moment();
    eventType: string;
    optionsForParams: {
        [paramName: string]: { id: string; name: string }[];
    } = {};

    onDestroy$: Subject<void> = new Subject<void>();

    constructor(
        private cardViewUpdateService: CardViewUpdateService,
        private appConfigService: AppConfigService,
        private formBuilder: FormBuilder,
        private store: Store<AmaState>) {
    }

    ngOnInit() {
        this.timers = this.appConfigService.get('process-modeler.timer-types');

        this.initProcessVariables();
        this.buildForm();
        this.setTimerFromXML();
    }

    initProcessVariables() {
        this.store.select(selectSelectedProcess).pipe(
            filter((process) => !!process),
            take(1)
        ).subscribe((process) => {
            const processVariables = Object.values(new ProcessExtensionsModel(process.extensions).getProperties(this.property.data.processId));
            this.setOptionForAParam(processVariables);
        });
    }

    private setOptionForAParam(processVariables: EntityProperty[]) {
        this.optionsForParams['timeDuration'] = this.extractProcessVariablesByType(processVariables, 'string');
        this.optionsForParams['timeCycle'] = this.extractProcessVariablesByType(processVariables, 'string');
        this.optionsForParams['timeDate'] = [
            ...this.extractProcessVariablesByType(processVariables, 'datetime'),
            ...this.extractProcessVariablesByType(processVariables, 'date'),
        ];
    }

    private extractProcessVariablesByType(processVariables: EntityProperty[], type: string): EntityProperty[] {
        return [...processVariables.filter(variable => variable.type === type)];
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
            cronExpression: new FormControl(undefined, [Validators.pattern(this.CRON_REGEX)]),
            useCronExpression: new FormControl(false, []),
            processVariable: new FormControl(undefined, []),
            useProcessVariable: new FormControl(false, []),
        });

        this.timerDefinitionForm.valueChanges
            .pipe(
                debounceTime(500),
                takeUntil(this.onDestroy$)
            )
            .subscribe((formChanges: any) => {
                this.updateForm(formChanges);
            });
    }

    updateForm(formChanges) {
        if ((formChanges.timerType === 'timeDuration' || formChanges.timerType === 'timeDate') && this.useCronExpression.value) {
            this.useCronExpression.setValue(false);
        }

        if (this.isFormValid()) {
            this.updateTimerDefinition();
        }
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

        if (this.useProcessVariable.value) {
            return this.processVariable.value ? '${' + this.processVariable.value + '}' : undefined;
        }

        if (this.useCronExpression.value) {
            return this.cronExpression.value;
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
        this.eventType = this.property.data.element.businessObject.$type;

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
        if (cycleDefinitionValue) {
            if (cycleDefinitionValue.includes('$')) {
                this.extractProcessVariableFromXML(cycleDefinitionValue);
            } else if (this.isCronExpression(cycleDefinitionValue)) {
                this.cronExpression.setValue(cycleDefinitionValue);
                this.useCronExpression.setValue(true);
            } else {
                const timerDefinitions = cycleDefinitionValue.split('/');
                this.repetitions.setValue(timerDefinitions[0].substring(1));

                if (timerDefinitions.length === 2) {
                    this.extractDurationFromXML(timerDefinitions[1]);
                } else {
                    this.extractDateFromXML(timerDefinitions[1]);
                    this.extractDurationFromXML(timerDefinitions[2]);
                }
            }
        }
    }

    isCronExpression(cycleDefinitionValue: string): boolean {
        const cronRegex = RegExp(this.CRON_REGEX);
        return cronRegex.test(cycleDefinitionValue);
    }

    extractDateFromXML(dateDefinitionValue: string) {
        if (dateDefinitionValue) {
            if (dateDefinitionValue.includes('$')) {
                this.extractProcessVariableFromXML(dateDefinitionValue);
            } else {
                this.date.setValue(moment(dateDefinitionValue));
            }
        }
    }

    extractDurationFromXML(durationDefinition: string) {
        if (durationDefinition) {
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
    }

    extractProcessVariableFromXML(processVariableDefinition: string) {
        const processVariable = processVariableDefinition.substr(2, processVariableDefinition.length - 3);
        this.processVariable.setValue(processVariable);
        this.useProcessVariable.setValue(true);
    }

    isFormValid(): boolean {
        return this.timerDefinitionForm && this.timerDefinitionForm.dirty && this.timerDefinitionForm.valid;
    }

    isDateTimer(): boolean {
        return (this.timerType.value === 'timeDate' || this.isCycleTimer())
            && !this.useProcessVariable.value
            && !this.useCronExpression.value;
    }

    isDurationTimer(): boolean {
        return (this.timerType.value === 'timeDuration' || this.isCycleTimer())
            && !this.useProcessVariable.value
            && !this.useCronExpression.value;
    }

    isCycleTimer(): boolean {
        return this.timerType.value === 'timeCycle'
            && !this.useProcessVariable.value;
    }

    isTimerTypeDefined(): boolean {
        return !!this.timerType.value;
    }

    isProcessVariableAvailable(): boolean {
        return this.eventType !== 'bpmn:StartEvent' && this.isTimerTypeDefined();
    }

    get timerType(): FormControl {
        return this.timerDefinitionForm.get('timerType') as FormControl;
    }

    get date(): FormControl {
        return this.timerDefinitionForm.get('date') as FormControl;
    }

    get years(): FormControl {
        return this.timerDefinitionForm.get('years') as FormControl;
    }

    get months(): FormControl {
        return this.timerDefinitionForm.get('months') as FormControl;
    }

    get weeks(): FormControl {
        return this.timerDefinitionForm.get('weeks') as FormControl;
    }

    get days(): FormControl {
        return this.timerDefinitionForm.get('days') as FormControl;
    }

    get hours(): FormControl {
        return this.timerDefinitionForm.get('hours') as FormControl;
    }

    get minutes(): FormControl {
        return this.timerDefinitionForm.get('minutes') as FormControl;
    }

    get seconds(): FormControl {
        return this.timerDefinitionForm.get('seconds') as FormControl;
    }

    get repetitions(): FormControl {
        return this.timerDefinitionForm.get('repetitions') as FormControl;
    }

    get processVariable(): FormControl {
        return this.timerDefinitionForm.get('processVariable') as FormControl;
    }

    get useProcessVariable(): FormControl {
        return this.timerDefinitionForm.get('useProcessVariable') as FormControl;
    }

    get cronExpression(): FormControl {
        return this.timerDefinitionForm.get('cronExpression') as FormControl;
    }

    get useCronExpression(): FormControl {
        return this.timerDefinitionForm.get('useCronExpression') as FormControl;
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
