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
import { ServiceParameterMapping, ConnectorParameter, MappingType, EntityProperty } from '../api/types';

@Injectable({
    providedIn: 'root'
})
export class OutputMappingDialogService extends MappingDialogService {
    getDataSourceValue(dataSource: MappingRowModel[], i: number): any {
        return dataSource[i].name;
    }

    getDataSourceName(dataSource: MappingRowModel[], i: number): any {
        return dataSource[i].value;
    }

    setDataSourceValue(dataSource: MappingRowModel[], i: number, value: any) {
        dataSource[i].name = value;
    }

    dataSourceInit(mapping: ServiceParameterMapping, parameters: ConnectorParameter[], properties: EntityProperty[]): MappingRowModel[] {
        const dataSource: MappingRowModel[] = [];

        if (mapping === undefined || mapping === null) {
            mapping = {};
        }

        const processParameters = Object.keys(mapping);
        processParameters.forEach(key => {
            const processVariable = properties.find(variable => variable.name === key);
            const outputParameter = mapping[key].type === MappingType.variable ?
                parameters.find(parameter => parameter.name === mapping[key].value)
                : null;

            const mappingValueType = outputParameter !== null ?
                MappingValueType.variable
                : (JSON.stringify(mapping[key].value).includes('${') ? MappingValueType.expression : MappingValueType.value);

            dataSource.push({
                id: outputParameter?.id,
                name: mapping[key].value,
                label: outputParameter?.label || null,
                description: outputParameter?.description || null,
                value: key,
                type: processVariable.type,
                mappingValueType: mappingValueType,
                model: outputParameter?.model,
                aggregatedTypes: outputParameter?.aggregatedTypes
            });
        });
        return dataSource;
    }

    createMappingFromDataSource(dataSource: MappingRowModel[]): ServiceParameterMapping {
        const outputMapping = {};
        dataSource.forEach(item => {
            if (item.value) {
                outputMapping[item.value] = {
                    type: item.mappingValueType === MappingValueType.variable ? MappingType.variable : MappingType.value,
                    value: item.name
                };
            }
        });
        return outputMapping;
    }

    validateMapping(dataSource: MappingRowModel[]): boolean {
        return dataSource.every(item => !!item.name && (item.mappingValueType === MappingValueType.expression ? !!item.value : true));
    }
}
