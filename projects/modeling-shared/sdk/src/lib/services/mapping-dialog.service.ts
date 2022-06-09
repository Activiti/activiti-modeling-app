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

import { ServiceParameterMapping, ConnectorParameter, MappingType, ProcessEditorElementVariable, ElementVariable, EntityProperty, ExpressionSyntax } from '../api/types';
import { Subject } from 'rxjs';
import { InputTypeItem, INPUT_TYPE_ITEM_HANDLER } from '../variables/public-api';
import { Inject, Injectable } from '@angular/core';

export interface MappingDialogData {
    inputMapping?: ServiceParameterMapping;
    inputParameters?: ConnectorParameter[];
    outputMapping?: ServiceParameterMapping;
    outputParameters?: ConnectorParameter[];
    editorVariables: ProcessEditorElementVariable[];
    expressionEditorVariables?: ElementVariable[];
    mappingType: VariableMappingType;
    selectedRow?: number;
    selectedProcessVariable?: string;
    selectedOutputParameter?: string;
    inputMappingUpdate$?: Subject<ServiceParameterMapping>;
    outputMappingUpdate$?: Subject<ServiceParameterMapping>;
    extensionObject?: any;
    expressionSyntax?: ExpressionSyntax;
    enableVariableSelection?: boolean;
    enableValueSelection?: boolean;
}

export enum VariableMappingType {
    input = 'input',
    output = 'output'
}

export interface MappingRowModel extends ElementVariable {
    mappingValueType: MappingValueType;
}

export enum MappingValueType {
    variable = 'variable',
    value = 'value',
    expression = 'expression'
}

@Injectable()
export abstract class MappingDialogService {
    constructor(
        @Inject(INPUT_TYPE_ITEM_HANDLER) private inputTypeItemHandler: InputTypeItem[]) { }

    abstract getDataSourceValue(dataSource: MappingRowModel[], i: number): any;
    abstract getDataSourceName(dataSource: MappingRowModel[], i: number): any;
    abstract setDataSourceValue(dataSource: MappingRowModel[], i: number, value: any);
    abstract dataSourceInit(mapping: ServiceParameterMapping, parameters: ConnectorParameter[], properties: EntityProperty[]): MappingRowModel[];
    abstract createMappingFromDataSource(dataSource: MappingRowModel[]): ServiceParameterMapping;
    abstract validateMapping(dataSource: MappingRowModel[]): boolean;

    getPrimitiveType(type: string) {
        for (const handler of this.inputTypeItemHandler) {
            if (handler.type === type) {
                return handler.primitiveType;
            }
        }
        return 'json';
    }

    getFilteredProcessVariables(dataSource: MappingRowModel[], processProperties: ElementVariable[], i: number): ElementVariable[] {
        let filteredProcessVariables = processProperties.filter((property) => !property.onlyForExpression);
        const element = dataSource[i];
        if (element.type) {
            filteredProcessVariables = processProperties.filter(variable => variable.type === element.type);
        }
        dataSource.forEach(mapping => {
            if (mapping.value && mapping.value !== element.value) {
                const index = filteredProcessVariables.findIndex(variable => variable.name === mapping.value);
                if (index >= 0) {
                    filteredProcessVariables.splice(index, 1);
                }
            }
        });

        return filteredProcessVariables;
    }

    initMappingValue(dataSource: MappingRowModel[], i: number): { variableValue: string; valueValue: any; expressionValue: string } {
        let expressionValue = '';
        let variableValue;
        let valueValue;

        const value = this.getDataSourceValue(dataSource, i);

        switch (dataSource[i].mappingValueType) {
        case MappingValueType.variable:
            variableValue = value;
            break;
        case MappingValueType.value:
            valueValue = value;
            if (this.getPrimitiveType(dataSource[i].type) === 'json') {
                expressionValue = typeof value === 'string' ? value : JSON.stringify(value, null, 4);
            }
            break;
        case MappingValueType.expression:
            if (typeof value === 'string') {
                expressionValue = value;
            } else {
                expressionValue = JSON.stringify(value, null, 4);
            }
            if (this.getPrimitiveType(dataSource[i].type) === 'json') {
                if (value) {
                    valueValue = JSON.parse(expressionValue);
                } else {
                    valueValue = value;
                }
            }
            break;
        }

        return { variableValue, valueValue, expressionValue };
    }

    getMappingValueTypeFromMappingType(type: MappingType, value: any, parameterType: string): MappingValueType {
        switch (type) {
        case MappingType.variable:
            return MappingValueType.variable;
        case MappingType.static:
            return MappingValueType.value;
        case MappingType.value:
        default:
            if (JSON.stringify(value).includes('${') && parameterType !== 'json') {
                return MappingValueType.expression;
            } else {
                return MappingValueType.value;
            }
        }
    }
}
