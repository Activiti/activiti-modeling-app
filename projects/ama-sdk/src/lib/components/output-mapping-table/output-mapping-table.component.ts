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
            value: parameter.name
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

    private setOptionForAParam(param) {
        this.optionsForParams[param.name] = [
            ...(param.required === false ? [{ id: null, name: 'None' }] : []),
            ...this.processProperties
                .filter(variable => variable.type === param.type)
                .filter(
                    variable =>
                        !this.mapping[variable.name] ||
                        this.mapping[variable.name].value === param.name
                )
        ];
    }

    initMapping() {
        const variableNames = Object.keys(this.mapping);

        for (const variableName of variableNames) {
            this.paramName2VariableName[
                this.mapping[variableName].value
            ] = variableName;
        }
    }
}
