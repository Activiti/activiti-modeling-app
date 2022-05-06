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

import { Injectable, Inject } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { EntityProperties, EntityProperty, JSONSchemaInfoBasics } from '../../lib/api/types';
import { primitive_types } from '../helpers/primitive-types';
import { InputTypeItem, INPUT_TYPE_ITEM_HANDLER } from './properties-viewer/value-type-inputs/value-type-inputs';

interface VariablesData {
    readonly data: string;
    readonly error: string | null;
}

export function multipleOfValidator(multipleOfValue: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (control.value == null || control.value.length === 0 || multipleOfValue == null || multipleOfValue === 0) {
            return null;
        }
        const value = parseFloat(control.value);
        return !isNaN(value) && value % multipleOfValue !== 0 ? { 'multipleOf': { 'multipleOf': multipleOfValue, 'actual': control.value } } : null;
    };
}
@Injectable({
    providedIn: 'root',
})
export class VariablesService {
    private readonly variablesDataSub = new Subject<VariablesData>();
    readonly variablesData$ = this.variablesDataSub.asObservable();

    constructor(
        @Inject(INPUT_TYPE_ITEM_HANDLER) private inputTypeItemHandler: InputTypeItem[]) { }

    getPrimitiveType(type: string): string {
        if (!type) {
            return type;
        }

        for (const handler of this.inputTypeItemHandler) {
            if (handler.type === type) {
                return handler.primitiveType;
            }
        }
        return primitive_types.find(primitive => primitive === type) || 'json';
    }

    getVariablePrimitiveType(variable: EntityProperty): string {
        return this.getPrimitiveType(variable?.type);
    }

    sendData(data: string, error: string) {
        this.variablesDataSub.next({ data, error });
    }

    validateFormVariable(variables: EntityProperties): boolean {
        for (const key of Object.keys(variables)) {
            if (this.variableNameExists(variables[key], variables)) {
                return false;
            }
        }
        return true;
    }

    private variableNameExists(variable: EntityProperty, variables: EntityProperties): boolean {
        const variableIndex = Object.keys(variables).findIndex(key => variables[key].name === variable.name && variables[key].id !== variable.id);
        return variableIndex > -1;
    }

    getValidatorsFromModel(model: JSONSchemaInfoBasics, required?: boolean): ValidatorFn[] {
        const validators: ValidatorFn[] = [];
        switch (model?.type) {
        case 'string':
            if (model.pattern) {
                validators.push(Validators.pattern(model.pattern));
            }

            if (model.minLength) {
                validators.push(Validators.minLength(model.minLength));
            }

            if (model.maxLength) {
                validators.push(Validators.maxLength(model.maxLength));
            }
            break;
        case 'integer':
            if (model.multipleOf) {
                validators.push(multipleOfValidator(model.multipleOf));
            }

            if (model.minimum) {
                validators.push(Validators.min(model.minimum));
            }

            if (model.exclusiveMinimum) {
                validators.push(Validators.min(model.minimum + 1));
            }

            if (model.maximum) {
                validators.push(Validators.max(model.maximum));
            }

            if (model.exclusiveMaximum) {
                validators.push(Validators.max(model.maximum - 1));
            }
            break;
        default:
            break;
        }

        if (model?.required || required) {
            validators.push(Validators.required);
        }

        return validators;
    }
}
