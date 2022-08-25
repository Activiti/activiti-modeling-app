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

import { Component, Input, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { ProcessModelerServiceToken, ProcessModelerService, BpmnProperty, BpmnElement, PROCESS_NAME_REGEX } from '@alfresco-dbp/modeling-shared/sdk';
import { CardViewProcessNameItemModel } from './process-name-item.model';
import { UntypedFormControl, ValidatorFn, AbstractControl, UntypedFormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
    selector: 'ama-process-name',
    templateUrl: './process-name-item.component.html',
    styleUrls: ['./process-name-item.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CardViewProcessNameItemComponent implements OnInit {

    @Input() property: CardViewProcessNameItemModel;

    processNameForm: UntypedFormGroup;
    onDestroy$: Subject<void> = new Subject<void>();

    constructor(@Inject(ProcessModelerServiceToken) private processModelerService: ProcessModelerService) { }

    ngOnInit() {
        this.updatePoolName();
        this.processNameForm = new UntypedFormGroup({
            'processName': new UntypedFormControl(this.property.value, this.validateProcessName(PROCESS_NAME_REGEX))
        });
    }

    updateProcessName() {
        if (this.processNameForm.valid) {
            this.updateProcessNameProperty(this.processName.value);
        }
    }

    updateProcessNameProperty(processName: string) {
        this.processModelerService.updateElementProperty(this.property.data.element.id, BpmnProperty.processName, processName);
    }

    updatePoolName() {
        if (this.isPoolNameEmpty()) {
            if (!this.property.value) {
                this.property.value = this.generatePoolName();
            }
            this.updateProcessNameProperty(this.property.value);
        }
    }

    isPoolNameEmpty() {
        return this.property.data.element.type === BpmnElement.Participant && !this.property.data.element.businessObject.name;
    }

    generatePoolName() {
        const modelName = this.property.data.element.businessObject.$parent.$parent.name;
        const poolNumber = this.property.data.element.businessObject.$parent.participants.length;
        return `${modelName}-${poolNumber}`;
    }

    private validateProcessName(processNameRegEx: RegExp): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const isProcessNameValid = processNameRegEx.test(control.value) && control.value.length > 0;
            return !isProcessNameValid ? { 'invalidProcessName': { value: control.value } } : null;
        };
    }

    get processName(): UntypedFormControl {
        return this.processNameForm.get('processName') as UntypedFormControl;
    }
}
