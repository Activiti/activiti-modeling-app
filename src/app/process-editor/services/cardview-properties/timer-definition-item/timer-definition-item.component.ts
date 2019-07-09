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

@Component({
    selector: 'ama-process-timer-definition',
    templateUrl: './timer-definition-item.component.html',
    providers: [CardItemTypeService]
})
export class CardViewTimerDefinitionItemComponent implements OnInit, OnDestroy {
    @Input() property;

    timers = [];
    selectedTimer: Bpmn.DiagramElement;
    defaultTimerDefinition = '';
    defaultTimerType = '';
    timerDefinitionForm: FormGroup;

    onDestroy$: Subject<void> = new Subject<void>();

    constructor(
        private cardViewUpdateService: CardViewUpdateService,
        private appConfigService: AppConfigService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit() {
        this.setTimerFromXML();
        this.timers = this.appConfigService.get('process-modeler.timer-types');

        this.buildForm();
    }

    buildForm() {
        this.timerDefinitionForm = this.formBuilder.group({
            timerType: new FormControl(this.defaultTimerType, [Validators.required]),
            timerDefinition: new FormControl(this.defaultTimerDefinition, [Validators.required])
        });

        this.timerDefinitionForm.valueChanges
            .pipe(
                debounceTime(500),
                takeUntil(this.onDestroy$)
            )
            .subscribe((timerDefinitionValues: any) => {
                if (this.isFormValid()) {
                    this.updateTimerDefinition(timerDefinitionValues);
                }
            });
    }

    updateTimerDefinition(timerDefinitionValues: any) {
        if (timerDefinitionValues) {
            this.cardViewUpdateService.update(this.property, {
                type: timerDefinitionValues.timerType,
                definition: timerDefinitionValues.timerDefinition
            });
        }
    }

    setTimerFromXML() {
        const timerEventDefinition = this.property.data.element.businessObject.eventDefinitions[0];

        if (timerEventDefinition.timeCycle) {
            this.defaultTimerType = 'timeCycle';
            this.defaultTimerDefinition = timerEventDefinition.timeCycle.body;
        } else if (timerEventDefinition.timeDuration) {
            this.defaultTimerType = 'timeDuration';
            this.defaultTimerDefinition = timerEventDefinition.timeDuration.body;
        } else if (timerEventDefinition.timeDate) {
            this.defaultTimerType = 'timeDate';
            this.defaultTimerDefinition = timerEventDefinition.timeDate.body;
        }
    }

    isFormValid() {
        return this.timerDefinitionForm && this.timerDefinitionForm.dirty && this.timerDefinitionForm.valid;
    }

    get timerType(): AbstractControl {
        return this.timerDefinitionForm.get('timerType');
    }

    get timerDefinition(): AbstractControl {
        return this.timerDefinitionForm.get('timerDefinition');
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
