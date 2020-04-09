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
import { ConnectorParameter, EntityProperty, MappingType, ServiceParameterMapping, ServiceParameterMappings } from '../../api/types';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { selectSelectedTheme } from '../../store/app.selectors';
import { DialogService } from '../../confirmation-dialog/services/dialog.service';
import { AmaState } from '../../store/app.state';
import { MappingDialogComponent } from '../mapping-dialog/mapping-dialog.component';
import { Subject } from 'rxjs';
import { MappingDialogData, VariableMappingType } from '../../services/mapping-dialog.service';
import { OutputMappingDialogService } from '../../services/output-mapping-dialog.service';
import { EXPRESSION } from '../../helpers/primitive-types';

@Component({
    selector: 'modelingsdk-output-mapping-table',
    templateUrl: 'output-mapping-table.component.html',
    host: { class: 'modelingsdk-input-mapping-table' }
})
export class OutputMappingTableComponent implements OnChanges {
    @Input()
    parameters: ConnectorParameter[];

    @Input()
    processProperties: EntityProperty[];

    @Input()
    mapping: ServiceParameterMapping;

    @Output()
    update = new EventEmitter<ServiceParameterMappings>();
    data: ServiceParameterMapping = {};

    noneValue = 'None';
    displayedColumns: string[] = ['name', 'process-variable'];
    dataSource: MatTableDataSource<ConnectorParameter>;
    optionsForParams: {
        [paramName: string]: { id: string; name: string }[];
    } = {};

    filteredParameters = [];
    mappingParameters = [];
    tableParameters = [];

    constructor(
        private dialogService: DialogService,
        private store: Store<AmaState>,
        private outputMappingDataSourceService: OutputMappingDialogService
    ) { }

    ngOnChanges() {
        this.initFilteredParameters();
        this.initParametersFromMapping();
        this.tableParameters = this.filteredParameters.concat(this.mappingParameters);
        this.dataSource = new MatTableDataSource(this.tableParameters);
        this.data = { ...this.mapping };
        this.initOptionsForParams(this.tableParameters);
    }

    private initParametersFromMapping() {
        this.mappingParameters = [];
        const filtered = this.parameters.filter((param) => param.mappingValueType && param.mappingValueType === EXPRESSION);
        filtered.forEach(params => this.mappingParameters.push({ ...params }));

        const processVariables = Object.keys(this.mapping);
        processVariables.forEach(processVariable => {
            if (this.mapping[processVariable].type !== MappingType.variable) {
                this.createOrUpdateMapping(processVariable);
            } else {
                const index = this.filteredParameters.findIndex(parameter => parameter.name === this.mapping[processVariable].value && !parameter['processVariable']);
                if (index >= 0) {
                    this.filteredParameters[index]['processVariable'] = processVariable;
                } else {
                    this.mappingParameters.push({
                        id: processVariable,
                        processVariable: processVariable,
                        name: this.mapping[processVariable].value,
                        type: this.processProperties.find(variable => variable.name === processVariable).type,
                        description: ''
                    });
                }
            }
        });
    }

    createOrUpdateMapping(processVariable) {
        const parameter = this.mappingParameters.find(param => param.name === this.mapping[processVariable].value);
        if (parameter) {
            parameter.processVariable = processVariable;
            parameter.type = this.processProperties.find(variable => variable.name === processVariable).type;
        } else {
            this.mappingParameters.push({
                id: processVariable,
                processVariable: processVariable,
                name: this.mapping[processVariable].value,
                type: this.processProperties.find(variable => variable.name === processVariable).type,
                description: ''
            });
        }
    }

    private initFilteredParameters() {
        this.filteredParameters = [];
        const filtered = this.parameters.filter((param) => !param.name.includes('variables.') && param.mappingValueType !== EXPRESSION);
        filtered.forEach(filteredParam => this.filteredParameters.push({ ...filteredParam, processVariable: undefined }));
    }

    changeSelection(
        { value: variableName },
        index: number,
        parameter: ConnectorParameter
    ): void {
        const oldVariable = this.getProcessVariable(index);
        if (oldVariable) {
            delete this.data[oldVariable];
        }

        if (this.isExpression(parameter)) {
            this.data[variableName] = {
                type: MappingType.value,
                value: parameter.name
            };
        } else if (variableName !== this.noneValue) {
            this.data[variableName] = {
                type: MappingType.variable,
                value: parameter.name
            };
        }
        this.update.emit(this.data);
    }

    initOptionsForParams(parameters: ConnectorParameter[]) {
        parameters.forEach((param, index) => this.setOptionForAParam(param, index));
    }

    private setOptionForAParam(param, index) {
        this.optionsForParams[index] = [
            ...(param.required === false ? [{ id: null, name: 'None' }] : []),
            ...this.processProperties
                .filter(variable => this.outputMappingDataSourceService.getPrimitiveType(variable.type) === this.outputMappingDataSourceService.getPrimitiveType(param.type))
                .filter(
                    variable =>
                        !this.mapping[variable.name] ||
                        variable.name === this.getProcessVariable(index)
                )
        ];
    }

    edit(parameterRow: number) {
        const outputMappingUpdate$ = new Subject<ServiceParameterMapping>();

        const theme$ = this.store.select(selectSelectedTheme).pipe(
            map(theme => (theme.className === 'dark-theme' ? 'vs-dark' : 'vs-light'))
        );

        let selectedProcessVariable;
        const variableNames = Object.keys(this.data);
        variableNames.forEach(variable => {
            if (this.data[variable].value === this.tableParameters[parameterRow].name) {
                selectedProcessVariable = variable;
            }
        });

        const dialogData: MappingDialogData = {
            mappingType: VariableMappingType.output,
            outputMapping: this.mapping,
            outputParameters: this.parameters,
            processProperties: this.processProperties,
            selectedProcessVariable: selectedProcessVariable,
            selectedOutputParameter: this.tableParameters[parameterRow].name,
            theme$: theme$,
            outputMappingUpdate$: outputMappingUpdate$
        };

        this.dialogService.openDialog(MappingDialogComponent, {
            disableClose: true,
            height: '530px',
            width: '1000px',
            data: dialogData,
        });

        outputMappingUpdate$.subscribe(data => {
            this.mapping = data;
            this.update.emit(data);
            this.ngOnChanges();
        });
    }

    isValueMapping(parameterName: string): boolean {
        return this.parameters.findIndex(parameter => parameter.name === parameterName) === -1;
    }

    getProcessVariable(i: number): string {
        return this.tableParameters[i]['processVariable'];
    }

    private isExpression(parameter: ConnectorParameter): boolean {
        return parameter.mappingValueType && parameter.mappingValueType === EXPRESSION;
    }
}
