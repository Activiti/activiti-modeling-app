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

/* eslint-disable max-lines */
import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { ConnectorParameter, ElementVariable, EntityProperty, ProcessEditorElementVariable, ServiceParameterMapping } from '../../api/types';
import { VariableMappingType, MappingRowModel, MappingValueType, MappingDialogService, MappingDialogData } from '../../services/mapping-dialog.service';
import { InputMappingDialogService } from '../../services/input-mapping-dialog.service';
import { OutputMappingDialogService } from '../../services/output-mapping-dialog.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';

@Component({
    templateUrl: './mapping-dialog.component.html',
    selector: 'modelingsdk-mapping-dialog',
    styleUrls: ['./mapping-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'modelingsdk-mapping-dialog' }
})

export class MappingDialogComponent implements OnInit {
    inputMapping: ServiceParameterMapping;
    inputParameters: ConnectorParameter[];
    outputParameters: ConnectorParameter[];
    outputMapping: ServiceParameterMapping;
    processProperties: EntityProperty[];
    mappingType: VariableMappingType;
    selectedRow: number;
    selectedProcessVariable: string;
    selectedOutputParameter: string;
    selectedDestination: string;
    extensionObject: any;
    keyColumnHeader = 'SDK.MAPPING_DIALOG.INPUT_PARAMETER';
    valueColumnHeader = 'SDK.MAPPING_DIALOG.PROCESS_VARIABLE';
    service: MappingDialogService;

    dataSource: MappingRowModel[];
    displayedColumns: string[] = ['name', 'icon', 'value'];

    selectedTab = 0;
    tabCheck = 0;

    variableValue = undefined;
    valueValue = undefined;
    expressionValue = '';

    filteredProcessVariables: EntityProperty[];

    extendedProperties = {};
    editorVariables: ProcessEditorElementVariable[];
    expressionEditorVariables: ElementVariable[];
    enableVariableSelection = true;
    enableValueSelection = true;
    changeDetectorRef = Math.random();

    private readonly EXPRESSION_REGEX = /\${([^]*)}/gm;

    constructor(
        public dialog: MatDialogRef<MappingDialogComponent>,
        private inputMappingDataSourceService: InputMappingDialogService,
        private outputMappingDataSourceService: OutputMappingDialogService,
        @Inject(MAT_DIALOG_DATA) public data: MappingDialogData
    ) {
        this.inputMapping = data.inputMapping;
        this.inputParameters = this.getSortedCopy(data.inputParameters);
        this.outputMapping = data.outputMapping;
        this.outputParameters = this.getSortedCopy(data.outputParameters);
        this.editorVariables = data.editorVariables;
        this.expressionEditorVariables = data.expressionEditorVariables;
        this.enableVariableSelection = data.enableVariableSelection === false ? data.enableVariableSelection : this.enableVariableSelection;
        this.enableValueSelection = data.enableValueSelection === false ? data.enableValueSelection : this.enableValueSelection;
        this.processProperties = this.getSortedCopy(this.getVariablesList(this.editorVariables));
        this.mappingType = data.mappingType;
        this.selectedRow = data.selectedRow;
        this.selectedProcessVariable = data.selectedProcessVariable;
        this.selectedOutputParameter = data.selectedOutputParameter;
        this.extensionObject = data.extensionObject;
        this.configDialogLabels();
    }

    private getVariablesList(variables: ProcessEditorElementVariable[]): ElementVariable[] {
        let vars: ElementVariable[] = [];
        if (variables) {
            variables.filter((variable) => variable.variables && variable.variables.length > 0).forEach((element) => vars = vars.concat(element.variables));
        }
        return vars;
    }

    private getSortedCopy(array: any[]): any[] {
        return array ? [...array].sort(this.sortByName) : [];
    }

    sortByName(a: { name: string }, b: { name: string }): number {
        return (a.name > b.name) ? 1 : -1;
    }

    ngOnInit() {
        this.dataSourceInit(this.mappingType);
        if (this.selectedRow) {
            this.extendedProperties = this.getExtendedProperties(this.dataSource[this.selectedRow].type);
        }
        this.initSelectedRow();
        if (this.mappingType === VariableMappingType.output) {
            this.displayedColumns.push('delete');
            this.filteredProcessVariables = this.service.getFilteredProcessVariables(this.dataSource, this.processProperties, this.selectedRow);
        }
        this.selectedDestination = this.service.getDataSourceName(this.dataSource, this.selectedRow);
        this.initSelectedTab(this.selectedRow, true);
        const values = this.service.initMappingValue(this.dataSource, this.selectedRow);
        Object.assign(this, { variableValue: values.variableValue, expressionValue: values.expressionValue, valueValue: values.valueValue });
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
                this.extendedProperties = this.getExtendedProperties(this.dataSource[this.selectedRow].type);
            }
        }
    }

    private initSelectedTab(i: number, isInit?: boolean) {
        switch (this.dataSource[i].mappingValueType) {
        case MappingValueType.variable:
            this.selectedTab = 0;
            break;
        case MappingValueType.value:
            this.selectedTab = this.enableVariableSelection ? 1 : 0;
            break;
        case MappingValueType.expression:
            this.selectedTab = this.enableVariableSelection ? (this.enableValueSelection ? 2 : 1) : (this.enableValueSelection ? 1 : 0);
            break;
        default:
            this.selectedTab = 0;
            break;
        }

        if (isInit) {
            this.tabCheck = this.selectedTab;
        }
    }

    isMappingSelectorEnabled(): boolean {
        switch (this.mappingType) {
        case VariableMappingType.output:
            return this.inputParameters !== undefined && this.inputParameters !== null && this.inputParameters.length > 0;
        default:
            return this.outputParameters !== undefined && this.outputParameters !== null && this.outputParameters.length > 0;
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
            if (this.variableValue && this.service.getPrimitiveType(this.dataSource[this.selectedRow].type) === 'json' && this.valueValue) {
                this.service.setDataSourceValue(this.dataSource, this.selectedRow, this.parseObjectOrString(this.valueValue));
            } else {
                this.service.setDataSourceValue(this.dataSource, this.selectedRow, this.valueValue);
            }
            break;
        case 2:
            this.dataSource[this.selectedRow].mappingValueType = MappingValueType.expression;
            if (this.expressionValue && this.service.getPrimitiveType(this.dataSource[this.selectedRow].type) === 'json' && this.expressionValue) {
                this.service.setDataSourceValue(this.dataSource, this.selectedRow, this.parseObjectOrString(this.expressionValue));
            } else {
                this.service.setDataSourceValue(this.dataSource, this.selectedRow, this.expressionValue);
            }
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
        if (!this.dataSource[i].readOnly) {
            if (i !== undefined && i < this.dataSource.length) {
                this.selectedRow = i;
                this.extendedProperties = this.getExtendedProperties(this.dataSource[this.selectedRow].type);
                this.selectedDestination = this.service.getDataSourceName(this.dataSource, i);
                const values = this.service.initMappingValue(this.dataSource, i);
                Object.assign(this, { variableValue: values.variableValue, expressionValue: values.expressionValue, valueValue: values.valueValue });
                this.initSelectedTab(i);
                if (this.mappingType === VariableMappingType.output) {
                    this.filteredProcessVariables = this.service.getFilteredProcessVariables(this.dataSource, this.processProperties, i);
                }
            }

            if (this.selectedTab !== this.tabCheck) {
                this.selectedTabChange();
            }
        }
    }

    getFilteredProcessProperties(type: string): EntityProperty[] {
        return this.getSortedArrayFilteredByType(this.processProperties, type);
    }

    getFilteredOutputParameters(type: string): ConnectorParameter[] {
        return this.getSortedArrayFilteredByType(this.outputParameters, type);
    }

    private getSortedArrayFilteredByType(array: any[], type: string): any[] {
        return array.filter(prop => this.service.getPrimitiveType(prop.type) === this.service.getPrimitiveType(type)).sort(this.sortByName);
    }

    mappingChanges(event: string, i: number) {
        if (event && event.match(this.EXPRESSION_REGEX)) {
            this.valueMappingExpressionChange(event, i);
            this.selectedTab = 2;
            this.tabCheck = 2;
        } else {
            this.variableMappingValueChange(event, i);
        }
        this.changeDetectorRef = Math.random();
    }

    variableMappingValueChange(name: string, i: number) {
        this.dataSource[i].mappingValueType = MappingValueType.variable;
        this.variableValue = name;
        this.service.setDataSourceValue(this.dataSource, i, name);
        this.changeDetectorRef = Math.random();
    }

    valueMappingValueChange($event: any, i: number) {
        this.dataSource[i].mappingValueType = MappingValueType.value;
        let value = $event;
        if (typeof $event === 'string' && this.service.getPrimitiveType(this.dataSource[i].type) === 'json') {
            value = this.parseObjectOrString($event);
            this.expressionValue = $event;
        } else if (this.service.getPrimitiveType(this.dataSource[i].type) === 'json') {
            this.expressionValue = JSON.stringify($event);
        }
        this.service.setDataSourceValue(this.dataSource, i, value);
        this.changeDetectorRef = Math.random();
    }

    valueMappingExpressionChange($event: string, i: number) {
        this.dataSource[i].mappingValueType = MappingValueType.expression;
        this.expressionValue = $event?.trim().length > 0 ? $event.trim() : null;
        if (this.service.getPrimitiveType(this.dataSource[i].type) === 'json') {
            this.valueValue = this.parseObjectOrString(this.expressionValue);
            this.service.setDataSourceValue(this.dataSource, i, this.valueValue);
        } else {
            this.service.setDataSourceValue(this.dataSource, i, this.expressionValue);
        }
        this.changeDetectorRef = Math.random();
    }

    outputMappingDestinationChange($event: MatSelectChange) {
        this.selectedDestination = $event.value;
        const processVariable = this.processProperties.find(variable => variable.name === $event.value);
        if (this.dataSource[this.selectedRow].type !== processVariable.type && this.dataSource[this.selectedRow].mappingValueType === MappingValueType.value) {
            this.dataSource[this.selectedRow].name = null;
        }
        this.dataSource[this.selectedRow].type = processVariable.type;
        this.dataSource[this.selectedRow].value = $event.value;
        this.changeDetectorRef = Math.random();
    }

    addOutputMapping(defaultOutputParameter: string) {
        let type;
        let label;
        let mappingValueType = MappingValueType.expression;
        if (defaultOutputParameter) {
            const outputParameter = this.outputParameters.find(parameter => parameter.name === defaultOutputParameter);
            if (outputParameter) {
                label = outputParameter.label;
                type = outputParameter.type;
                mappingValueType = MappingValueType.variable;
            }
        }
        this.dataSource = this.dataSource.concat({ id: defaultOutputParameter, name: defaultOutputParameter, label, value: undefined, type, mappingValueType });
        this.editRow(this.dataSource.length - 1);
    }

    deleteRow(i: number) {
        this.dataSource.splice(i, 1);
        this.dataSource = this.dataSource.filter(() => true);
        this.selectedRow = undefined;
        this.extendedProperties = null;
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

    private getExtendedProperties(inputType: string): any {
        let extendedProperties;
        switch (inputType) {
        case 'content-metadata':
            extendedProperties = { editorVariables: this.editorVariables };
            break;
        case 'expression-mapping':
            extendedProperties = this.extensionObject;
            extendedProperties['panelWidth'] = 200;
            break;
        default:
            extendedProperties = {};
        }
        return extendedProperties;
    }

    private configDialogLabels() {
        if (this.extensionObject && this.extensionObject.editDialogKeyHeader && this.extensionObject.editDialogValueHeader) {
            this.keyColumnHeader = this.extensionObject.editDialogKeyHeader;
            this.valueColumnHeader = this.extensionObject.editDialogValueHeader;
        }
    }

    private parseObjectOrString(value: string): any {
        try {
            return JSON.parse(value);
        } catch (error) {
            return value;
        }
    }
}
