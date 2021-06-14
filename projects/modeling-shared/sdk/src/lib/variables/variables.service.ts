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
import { Injectable, Output, EventEmitter, Inject } from '@angular/core';
import { EntityProperties, EntityProperty } from '../../lib/api/types';
import { primitive_types } from '../helpers/primitive-types';
import { InputTypeItem, INPUT_TYPE_ITEM_HANDLER } from './properties-viewer/value-type-inputs/value-type-inputs';

@Injectable({
    providedIn: 'root',
})
export class VariablesService {
    @Output() variablesData: EventEmitter<any> = new EventEmitter<any>();

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
        this.variablesData.emit({ data: data, error: error });
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
        const variableIndex = Object.keys(variables).findIndex(key => {
            return variables[key].name === variable.name && variables[key].id !== variable.id;
        });
        return variableIndex > -1;
    }

}
