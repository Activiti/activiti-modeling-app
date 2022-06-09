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
import { MappingDialogService, MappingRowModel, MappingValueType } from './mapping-dialog.service';
import { ServiceParameterMapping, ConnectorParameter, MappingType } from '../api/types';

@Injectable({
    providedIn: 'root'
})
export class InputMappingDialogService extends MappingDialogService {
    getDataSourceValue(dataSource: MappingRowModel[], i: number): any {
        return dataSource[i].value;
    }
    getDataSourceName(dataSource: MappingRowModel[], i: number): any {
        return dataSource[i].name;
    }
    setDataSourceValue(dataSource: MappingRowModel[], i: number, value: any) {
        dataSource[i].value = value;
    }

    dataSourceInit(mapping: ServiceParameterMapping, parameters: ConnectorParameter[]): MappingRowModel[] {
        const dataSource: MappingRowModel[] = [];

        if (mapping === undefined || mapping === null) {
            mapping = {};
        }

        parameters.forEach(parameter => {
            let value = null;
            let mappingValueType = MappingValueType.variable;
            if (mapping[parameter.name]) {
                mappingValueType = this.getMappingValueTypeFromMappingType(mapping[parameter.name].type, mapping[parameter.name].value, this.getPrimitiveType(parameter.type));
                value = mapping[parameter.name].value;
            }
            dataSource.push({
                id: parameter.id,
                name: parameter.name,
                label: parameter.label,
                description: parameter.description,
                value: value,
                type: parameter.type,
                required: parameter.required,
                readOnly: parameter.readOnly,
                model: parameter.model,
                mappingValueType: mappingValueType,
                placeholder: parameter.placeholder,
                aggregatedTypes: parameter.aggregatedTypes
            });
        });

        return dataSource;
    }

    createMappingFromDataSource(dataSource: MappingRowModel[]): ServiceParameterMapping {
        const inputMapping = {};
        dataSource.filter(mapping => mapping.mappingValueType !== MappingValueType.variable || (!!mapping.value || mapping.required)).forEach(item => {
            inputMapping[item.name] = {
                type: item.mappingValueType === MappingValueType.variable ? MappingType.variable : MappingType.value,
                value: item.value
            };
        });
        return inputMapping;
    }

    validateMapping(): boolean {
        return true;
    }
}
