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

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ConnectorParameter, EntityProperty, MappingType, ServiceOutputParameterMapping, ServiceParameterMappings } from '../../api/types';


export const VALUE_MAPPING_ID_REGEX = /{.*?\.id}/;
export const VALUE_MAPPING_LABEL_REGEX = /{.*?\.label}/;
export function sanitizeLabelIdValue(value: string): string {
    if (VALUE_MAPPING_ID_REGEX.test(value) || VALUE_MAPPING_LABEL_REGEX.test(value)) {
        value = value.substring(2, value.length - 1);
    }

    return value;
}

@Component({
    selector: 'amasdk-output-mapping-table',
    templateUrl: 'output-mapping-table.component.html',
    host: { class: 'amasdk-input-mapping-table' }
})
export class OutputMappingTableComponent implements OnChanges {
    @Input()
    parameters: ConnectorParameter[];

    @Input()
    processProperties: EntityProperty[];

    @Input()
    mapping: ServiceOutputParameterMapping;

    @Output()
    update = new EventEmitter<ServiceParameterMappings>();
    data: ServiceOutputParameterMapping = {};

    displayedColumns: string[] = ['name', 'process-variable'];
    dataSource: MatTableDataSource<ConnectorParameter>;
    optionsForParams: {
        [paramName: string]: { id: string; name: string }[];
    } = {};
    paramName2VariableName: { [paramName: string]: string } = {};

    ngOnChanges() {
        this.initOptionsForParams();
        this.initMapping();
        this.dataSource = new MatTableDataSource(this.parameters);
        this.data = { ...this.mapping };
    }

    changeSelection(
        { value: variableName },
        parameter: ConnectorParameter
    ): void {
        const previousVariableMapped = this.paramName2VariableName[
            parameter.name
        ];
        if (previousVariableMapped) {
            delete this.data[previousVariableMapped];
        }

        this.data[variableName] = {
            type: MappingType.variable,
            value: this.getMappableKey(parameter)
        };
        this.update.emit(this.data);
    }

    clearSelection(parameterName) {
        delete this.data[this.paramName2VariableName[parameterName]];
        delete this.paramName2VariableName[parameterName];
        this.update.emit(this.data);
    }

    initOptionsForParams() {
        this.parameters.forEach(this.setOptionForAParam.bind(this));
    }

    initMapping() {
        const variableNames = Object.keys(this.mapping);

        for (const variableName of variableNames) {
            this.paramName2VariableName[
                sanitizeLabelIdValue(this.mapping[variableName].value)
            ] = variableName;
        }
    }

    private setOptionForAParam(parameter: ConnectorParameter) {
        this.optionsForParams[parameter.name] = [
            ...(parameter.required === false ? [{ id: null, name: 'None' }] : []),
            ...this.processProperties
                .filter(variable => {
                    return variable.type === parameter.type || this.isMappableToString(variable, parameter);
                })
                .filter(
                    variable =>
                        !this.mapping[variable.name] ||
                        sanitizeLabelIdValue(this.mapping[variable.name].value) === parameter.name
                )
        ];
    }

    isMappableToString(variable: EntityProperty, parameter: ConnectorParameter): boolean {
        return variable.type === 'string' && (parameter.type === 'id' || parameter.type === 'label');
    }

    getMappableKey(parameter: ConnectorParameter): string {
        let parameterKey = parameter.name;
        if (parameter.type === 'id' || parameter.type === 'label') {
            parameterKey = '${' + parameter.name + '}';
        }

        return parameterKey;
    }
}
