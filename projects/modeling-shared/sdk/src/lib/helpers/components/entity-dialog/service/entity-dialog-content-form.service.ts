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

import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FieldValidator, ModelFieldProperty } from '../../../../interfaces/model-creator.interface';

@Injectable()
export class EntityDialogContentFormService {

    constructor(private formBuilder: FormBuilder) {}

    readonly DEFAULT_STRING = '';
    readonly DEFAULT_NUMBER = 0;

    createForm(modelCreatorDialogFields: ModelFieldProperty[]): FormGroup {
        let formControls = {};
        for (const formField of modelCreatorDialogFields) {
            const formControl = {};
            const defaultValue = this.getDefaultFromType(formField.default, formField.type);
            formControl[formField.key] = this.createController(defaultValue, formField?.validators);
            formControls = { ...formControls, ...formControl };
        }

        return this.formBuilder.group(formControls);
    }

    private createController(defaultValue: any, validators?: FieldValidator[]): FormControl {
        const controller = new FormControl(defaultValue);

        this.addValidation(controller, validators);

        return controller;
    }

    private addValidation(controller: FormControl, validators: FieldValidator[]) {
        if(validators) {
            validators.forEach((validator: FieldValidator) => {
                switch(validator.type) {
                    case 'required':
                        controller.addValidators(Validators.required);
                        break;
                    case 'pattern':
                        controller.addValidators(Validators.pattern(new RegExp(validator.value)));
                        break;
                }
            });

            controller.updateValueAndValidity();
        }
    }

    private getDefaultFromType(defaultValue: any, type: string): any {
        switch(type) {
            case 'text':
            case 'textarea':
                return defaultValue ?? this.DEFAULT_STRING;
            case 'number':
                return defaultValue ?? this.DEFAULT_NUMBER;
        }
    }
}