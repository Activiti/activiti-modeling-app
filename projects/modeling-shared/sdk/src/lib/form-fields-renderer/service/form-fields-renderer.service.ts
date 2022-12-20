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
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import {
    FormRendererField,
    FormRendererFieldValidator
} from '../../form-fields-renderer/models/form-renderer-field.interface';

@Injectable()
export class FormFieldsRendererService {

    constructor(private formBuilder: FormBuilder) {}

    readonly DEFAULT_STRING = '';
    readonly DEFAULT_NUMBER = 0;

    createForm(formFields: FormRendererField[]): FormGroup {
        const formControls = formFields.reduce((controls, formField) => {
            const defaultValue = this.getDefaultFromType(formField.defaultValue, formField.type);
            const validators = this.getValidators(formField.validators);
            controls[formField.key] = new FormControl(defaultValue, validators);
            return controls;
        }, {});

        return this.formBuilder.group(formControls);
    }

    private getValidators(formFieldValidators: FormRendererFieldValidator[]): ValidatorFn[] {
        return formFieldValidators?.reduce((validators, formFieldValidator) => {
            switch(formFieldValidator.type) {
                case 'required':
                    validators.push(Validators.required);
                    break;
                case 'pattern':
                    validators.push(Validators.pattern(new RegExp(formFieldValidator.value)));
            }
            return validators;
        }, []);
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
