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

import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelectChange } from '@angular/material';
import { Subject, Observable } from 'rxjs';
import { ConnectorParameter, EntityProperty, ServiceParameterMapping } from '../../api/types';
import { CodeEditorComponent } from '../../code-editor/components/code-editor/code-editor.component';
import { UuidService } from '../../services/uuid.service';
import { VariableMappingType, MappingRowModel, MappingValueType, MappingDialogService } from '../../services/mapping-dialog.service';
import { InputMappingDialogService } from '../../services/input-mapping-dialog.service';
import { OutputMappingDialogService } from '../../services/output-mapping-dialog.service';

export interface MappingDialogData {
    inputMapping?: ServiceParameterMapping;
    inputParameters?: ConnectorParameter[];
    outputMapping?: ServiceParameterMapping;
    outputParameters?: ConnectorParameter[];
    processProperties: EntityProperty[];
    mappingType: VariableMappingType;
    selectedRow?: number;
    selectedProcessVariable?: string;
    selectedOutputParameter?: string;
    theme$: Observable<string>;
    inputMappingUpdate$?: Subject<ServiceParameterMapping>;
    outputMappingUpdate$?: Subject<ServiceParameterMapping>;
}

@Component({
    templateUrl: './mapping-dialog.component.html',
    selector: 'modelingsdk-mapping-dialog',
    host: { class: 'modelingsdk-mapping-dialog' }
})

export class MappingDialogComponent implements OnInit, OnDestroy {
    inputMapping: ServiceParameterMapping;
    inputParameters: ConnectorParameter[];
    outputParameters: ConnectorParameter[];
    outputMapping: ServiceParameterMapping;
    processProperties: EntityProperty[];
    mappingType: VariableMappingType;
    selectedRow: number;
    selectedProcessVariable: string;
    selectedOutputParameter: string;
    vsTheme$: Observable<string>;
    selectedDestination: string;

    service: MappingDialogService;

    dataSource: MappingRowModel[];
    displayedColumns: string[] = ['name', 'icon', 'value'];

    selectedTab = 0;
    tabCheck = 0;

    variableValue = undefined;
    valueValue = undefined;
    expressionValue = '';

    filteredProcessVariables: EntityProperty[];

    language = 'expressions';

    editorOptions = {
        language: this.language
    };

    @ViewChild('expressionInput') editor: CodeEditorComponent;

    constructor(
        public dialog: MatDialogRef<MappingDialogComponent>,
        private uuidService: UuidService,
        private inputMappingDataSourceService: InputMappingDialogService,
        private outputMappingDataSourceService: OutputMappingDialogService,
        @Inject(MAT_DIALOG_DATA) public data: MappingDialogData
    ) {
        this.inputMapping = data.inputMapping;
        this.inputParameters = data.inputParameters;
        this.outputMapping = data.outputMapping;
        this.outputParameters = data.outputParameters;
        this.processProperties = data.processProperties;
        this.mappingType = data.mappingType;
        this.selectedRow = data.selectedRow;
        this.selectedProcessVariable = data.selectedProcessVariable;
        this.selectedOutputParameter = data.selectedOutputParameter;
        this.vsTheme$ = data.theme$;
    }

    ngOnInit() {
        this.language = this.language + '-' + this.uuidService.generate();
        this.dataSourceInit(this.mappingType);
        this.service.initExpressionEditor(this.language, this.mappingType === VariableMappingType.output ? this.outputParameters : this.processProperties);
        this.initSelectedRow();
        if (this.mappingType === VariableMappingType.output) {
            this.displayedColumns.push('delete');
            this.getFilteredProcessVariables(this.selectedRow);
        }
        this.setSelectedDestination(this.selectedRow);
        this.initSelectedTab(this.selectedRow, true);
        this.initMappingValue(this.selectedRow);
    }

    ngOnDestroy() {
        this.service.removeEditorLanguageSettings(this.language);
    }

    private dataSourceInit(type: VariableMappingType): void {
        let mapping: ServiceParameterMapping;
        let parameters: ConnectorParameter[];
        switch (type) {
            case VariableMappingType.output:
                this.service = this.outputMappingDataSourceService;
                mapping = this.outputMapping;
                parameters = this.outputParameters;
                break;
            default:
                this.service = this.inputMappingDataSourceService;
                mapping = this.inputMapping;
                parameters = this.inputParameters;
        }
        this.dataSource = this.service.dataSourceInit(mapping, parameters, this.processProperties);
    }

    private initSelectedRow() {
        if (this.mappingType === VariableMappingType.output) {
            const index = this.dataSource.findIndex(row => row.value === this.selectedProcessVariable);
            if (index < 0) {
                this.addOutputMapping(this.selectedOutputParameter);
            } else {
                this.selectedRow = index;
            }
        }
    }

    private getFilteredProcessVariables(i: number) {
        let filteredProcessVariables = this.processProperties.filter(() => true);
        const element = this.dataSource[i];
        if (element.type) {
            filteredProcessVariables = this.processProperties.filter(variable => variable.type === element.type);
        }
        this.dataSource.forEach(mapping => {
            if (mapping.value && mapping.value !== element.value) {
                const index = filteredProcessVariables.findIndex(variable => variable.name === mapping.value);
                if (index >= 0) {
                    filteredProcessVariables.splice(index, 1);
                }
            }
        });

        this.filteredProcessVariables = filteredProcessVariables;
    }

    private setSelectedDestination(i: number) {
        this.selectedDestination = this.service.getDataSourceName(this.dataSource, i);
    }

    private initSelectedTab(i: number, isInit?: boolean) {
        switch (this.dataSource[i].mappingValueType) {
            case MappingValueType.variable:
                this.selectedTab = 0;
                break;
            case MappingValueType.value:
                this.selectedTab = 1;
                break;
            case MappingValueType.expression:
                this.selectedTab = 2;
                break;
            default:
                this.selectedTab = 0;
                break;
        }

        if (isInit) {
            this.tabCheck = this.selectedTab;
        }
    }

    private initMappingValue(i: number) {
        switch (this.dataSource[i].mappingValueType) {
            case MappingValueType.variable:
                this.variableValue = this.service.getDataSourceValue(this.dataSource, i);
                this.valueValue = undefined;
                this.expressionValue = '';
                break;
            case MappingValueType.value:
                this.variableValue = undefined;
                this.valueValue = this.service.getDataSourceValue(this.dataSource, i);
                this.expressionValue = '';
                break;
            case MappingValueType.expression:
                this.variableValue = undefined;
                this.valueValue = undefined;
                if (typeof this.service.getDataSourceValue(this.dataSource, i) === 'string') {
                    this.expressionValue = this.service.getDataSourceValue(this.dataSource, i);
                } else {
                    this.expressionValue = JSON.stringify(this.service.getDataSourceValue(this.dataSource, i), null, 4);
                }
                break;
        }
    }

    isMappingSelectorEnabled(): boolean {
        switch (this.mappingType) {
            case VariableMappingType.output:
                return this.inputParameters !== undefined && this.inputParameters !== null;
            default:
                return this.outputParameters !== undefined && this.outputParameters !== null;
        }
    }

    selectedTabChange() {
        switch (this.selectedTab) {
            case 0:
                this.dataSource[this.selectedRow].mappingValueType = MappingValueType.variable;
                this.service.setDataSourceValue(this.dataSource, this.selectedRow, this.variableValue);
                break;
            case 1:
                this.dataSource[this.selectedRow].mappingValueType = MappingValueType.value;
                this.service.setDataSourceValue(this.dataSource, this.selectedRow, this.valueValue);
                break;
            case 2:
                this.dataSource[this.selectedRow].mappingValueType = MappingValueType.expression;
                this.service.setDataSourceValue(this.dataSource, this.selectedRow, this.expressionValue);
        }
        this.tabCheck = this.selectedTab;
    }

    variableMappingTypeChange($event: MatSelectChange) {
        if ($event.value === VariableMappingType.output) {
            this.displayedColumns.push('delete');
            this.inputMapping = this.service.createMappingFromDataSource(this.dataSource);
        } else {
            this.displayedColumns.pop();
            this.outputMapping = this.service.createMappingFromDataSource(this.dataSource);
        }
        this.dataSourceInit($event.value);
    }

    editRow(i: number) {
        if (i !== undefined && i < this.dataSource.length) {
            this.selectedRow = i;
            this.setSelectedDestination(i);
            this.initMappingValue(i);
            this.initSelectedTab(i);
            if (this.mappingType === VariableMappingType.output) {
                this.getFilteredProcessVariables(i);
            }
        }

        if (this.selectedTab !== this.tabCheck) {
            this.selectedTabChange();
        }
    }

    getFilteredProcessProperties(type: string): EntityProperty[] {
        return this.processProperties.filter(prop => prop.type === type);
    }

    getFilteredOutputParameters(type: string): ConnectorParameter[] {
        return this.outputParameters.filter(prop => prop.type === type);
    }

    variableMappingValueChange($event: MatSelectChange, i: number) {
        this.dataSource[i].mappingValueType = MappingValueType.variable;
        this.variableValue = $event.value;
        this.service.setDataSourceValue(this.dataSource, i, $event.value);
    }

    valueMappingValueChange($event: any, i: number) {
        this.dataSource[i].mappingValueType = MappingValueType.value;
        this.valueValue = $event;
        this.service.setDataSourceValue(this.dataSource, i, $event);
    }

    valueMappingExpressionChange($event: string, i: number) {
        this.expressionValue = $event;
        this.dataSource[i].mappingValueType = MappingValueType.expression;
        try {
            this.service.setDataSourceValue(this.dataSource, i, JSON.parse(this.expressionValue));
        } catch (error) {
            this.service.setDataSourceValue(this.dataSource, i, this.expressionValue);
        }
    }

    outputMappingDestinationChange($event: MatSelectChange) {
        this.selectedDestination = $event.value;
        const processVariable = this.processProperties.find(variable => variable.name === $event.value);
        if (this.dataSource[this.selectedRow].type !== processVariable.type && this.dataSource[this.selectedRow].mappingValueType === MappingValueType.value) {
            this.dataSource[this.selectedRow].name = null;
        }
        this.dataSource[this.selectedRow].type = processVariable.type;
        this.dataSource[this.selectedRow].value = $event.value;
    }

    addOutputMapping(defaultOutputParameter: string) {
        let type = undefined;
        let mappingValueType = MappingValueType.expression;
        if (defaultOutputParameter) {
            const outputParameter = this.outputParameters.find(parameter => parameter.name === defaultOutputParameter);
            if (outputParameter) {
                type = outputParameter.type;
                mappingValueType = MappingValueType.variable;
            }
        }
        this.dataSource = this.dataSource.concat({ name: defaultOutputParameter, value: undefined, type: type, mappingValueType: mappingValueType });
        this.editRow(this.dataSource.length - 1);
    }

    deleteRow(i: number) {
        this.dataSource.splice(i, 1);
        this.dataSource = this.dataSource.filter(() => true);
        this.selectedRow = undefined;
        this.selectedTab = 0;
        this.tabCheck = 0;
    }

    save() {
        if (this.mappingType === VariableMappingType.input) {
            this.inputMapping = this.service.createMappingFromDataSource(this.dataSource);
        } else {
            this.outputMapping = this.service.createMappingFromDataSource(this.dataSource);
        }

        if (this.inputMapping) {
            this.data.inputMappingUpdate$.next(this.inputMapping);
            this.data.inputMappingUpdate$.complete();
        }
        if (this.outputMapping) {
            this.data.outputMappingUpdate$.next(this.outputMapping);
            this.data.outputMappingUpdate$.complete();
        }

        this.dialog.close();
    }

    onClose() {
        this.dialog.close();
    }

    trackBy(index: number) {
        return index;
    }
}
