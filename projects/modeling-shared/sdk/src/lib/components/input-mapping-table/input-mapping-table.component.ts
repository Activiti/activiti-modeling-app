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

import { Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConnectorParameter, ElementVariable, ExpressionSyntax, MappingType, ProcessEditorElementVariable, ServiceParameterMapping } from '../../api/types';
import { DialogService } from '@alfresco-dbp/adf-candidates/core/dialog';
import { MappingDialogComponent } from '../mapping-dialog/mapping-dialog.component';
import { Subject } from 'rxjs';
import { MappingDialogData, VariableMappingType } from '../../services/mapping-dialog.service';

export interface ParameterSelectOption {
    id: string | symbol;
    name: string;
}
export interface ParametersSelectOptions {
    [paramName: string]: ParameterSelectOption[];
}

@Component({
    selector: 'modelingsdk-input-mapping-table',
    templateUrl: './input-mapping-table.component.html',
    styleUrls: ['./input-mapping-table.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'modelingsdk-input-mapping-table' }
})
export class InputMappingTableComponent implements OnChanges {
    @Input()
    parameters: ConnectorParameter[];

    @Input()
    processProperties: ProcessEditorElementVariable[];

    @Input()
    mapping: ServiceParameterMapping;

    @Input()
    parameterColumnHeader = 'SDK.VARIABLE_MAPPING.PARAMETER';

    @Input()
    variableColumnHeader = 'SDK.VARIABLE_MAPPING.PROCESS_VARIABLE';

    @Input()
    editDialogKeyHeader = 'SDK.VARIABLE_MAPPING.PARAMETER';

    @Input()
    editDialogValueHeader = 'SDK.VARIABLE_MAPPING.PROCESS_VARIABLE';

    @Input()
    extensionObject: any;

    @Input()
    panelHeight = 300;

    @Input()
    panelWidth = 200;

    @Input()
    placeholder = 'SDK.VARIABLE_MAPPING.PROCESS_VARIABLE';

    @Input()
    expressionEditorVariables: ElementVariable[];

    @Input()
    expressionSyntax: ExpressionSyntax = ExpressionSyntax.JUEL;

    @Input()
    enableVariableSelection = true;

    @Input()
    enableValueSelection = true;

    @Output()
    update = new EventEmitter<ServiceParameterMapping>();

    data: ServiceParameterMapping = {};

    VALUE_TYPE = MappingType.value;
    VARIABLE_TYPE = MappingType.variable;

    displayedColumns: string[] = ['name', 'process-variable'];
    dataSource: MatTableDataSource<ConnectorParameter>;
    dataSelect: any[] = [];
    mappingTypes: { [paramName: string]: MappingType } = {};
    values: { [paramName: string]: string } = {};
    paramName2VariableName: { [paramName: string]: string } = {};

    constructor(
        private dialogService: DialogService
    ) { }

    ngOnChanges() {
        if (this.parameters) {
            this.initMapping();
            this.dataSource = new MatTableDataSource(this.getSortedCopy(this.parameters));
        }
        this.data = { ...this.mapping };
    }

    selectVariable(
        selection: {
            type: MappingType;
            value: any;
        },
        param: ConnectorParameter
    ): void {
        if (selection) {
            this.data[param.name] = selection;
            this.paramName2VariableName[param.name] = this.data[param.name].value;
        } else if (param.required) {
            this.data[param.name] = {
                type: MappingType.variable,
                value: null
            };
            this.paramName2VariableName[param.name] = this.data[param.name].value;
        } else {
            delete this.data[param.name];
            this.paramName2VariableName[param.name] = null;
        }
        this.update.emit(this.data);
    }

    setParamWithValue(value: string, param: ConnectorParameter): void {
        if (!value?.length && !param.required) {
            delete this.data[param.name];
        } else {
            this.data[param.name] = {
                type: MappingType.value,
                value
            };
        }
        this.update.emit(this.data);
    }

    initMapping() {
        this.parameters.forEach(param => {
            if (!this.mappingTypes[param.name]) {
                this.mappingTypes[param.name] = MappingType.variable;
            }

            if (this.mapping[param.name]) {
                this.mappingTypes[param.name] = this.mapping[param.name].value ? this.mapping[param.name].type : MappingType.variable;

                this.values[param.name] =
                    this.mapping[param.name].type === MappingType.value
                        ? this.mapping[param.name].value
                        : '';
                this.paramName2VariableName[param.name] =
                    this.mapping[param.name].type === MappingType.variable && this.mapping[param.name].value
                        ? this.mapping[param.name].value
                        : '';
            }
        });
    }

    edit(parameterRow: number) {
        const inputMappingUpdate$ = new Subject<ServiceParameterMapping>();

        const dialogData: MappingDialogData = {
            inputMapping: this.mapping,
            inputParameters: this.parameters,
            mappingType: VariableMappingType.input,
            editorVariables: this.processProperties,
            expressionEditorVariables: this.expressionEditorVariables,
            selectedRow: parameterRow,
            inputMappingUpdate$,
            extensionObject: { ...this.extensionObject, editDialogKeyHeader: this.editDialogKeyHeader, editDialogValueHeader: this.editDialogValueHeader },
            expressionSyntax: this.expressionSyntax,
            enableValueSelection: this.enableValueSelection,
            enableVariableSelection: this.enableVariableSelection
        };

        this.dialogService.openDialog(MappingDialogComponent, {
            disableClose: true,
            height: '530px',
            width: '1000px',
            data: dialogData,
        });

        inputMappingUpdate$.subscribe(data => {
            this.data = data;
            this.update.emit(data);
        });
    }

    private getSortedCopy(array: any[]): any[] {
        return array ? [...array].sort(this.sortByName) : [];
    }

    private sortByName(a: { name: string }, b: { name: string }): number {
        return (a.name > b.name) ? 1 : -1;
    }
}
