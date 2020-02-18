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
import { MappingDialogData, MappingDialogComponent } from '../mapping-dialog/mapping-dialog.component';
import { Subject } from 'rxjs';
import { VariableMappingType } from '../../services/mapping-dialog.service';

export interface ParameterSelectOption {
    id: string | Symbol;
    name: string;
}
export interface ParametersSelectOptions {
    [paramName: string]: ParameterSelectOption[];
}
export const NoneValue = Symbol('None value');

@Component({
    selector: 'modelingsdk-input-mapping-table',
    templateUrl: 'input-mapping-table.component.html',
    host: { class: 'modelingsdk-input-mapping-table' }
})
export class InputMappingTableComponent implements OnChanges {
    @Input()
    parameters: ConnectorParameter[];

    @Input()
    processProperties: EntityProperty[];

    @Input()
    mapping: ServiceParameterMapping;

    @Input()
    parameterColumnHeader = 'SDK.VARIABLE_MAPPING.PARAMETER';

    @Input()
    variableColumnHeader = 'SDK.VARIABLE_MAPPING.PROCESS_VARIABLE';

    @Output()
    update = new EventEmitter<ServiceParameterMappings>();

    data: ServiceParameterMapping = {};

    VALUE_TYPE = MappingType.value;
    VARIABLE_TYPE = MappingType.variable;

    displayedColumns: string[] = ['name', 'process-variable'];
    dataSource: MatTableDataSource<ConnectorParameter>;
    dataSelect: any[] = [];
    optionsForParams: ParametersSelectOptions = {};
    mappingTypes: { [paramName: string]: MappingType } = {};
    values: { [paramName: string]: string } = {};
    paramName2VariableName: { [paramName: string]: string } = {};

    constructor(
        private dialogService: DialogService,
        private store: Store<AmaState>
    ) { }

    ngOnChanges() {
        this.initOptionsForParams();
        this.initMapping();
        this.dataSource = new MatTableDataSource(this.parameters);
        this.data = { ...this.mapping };
    }

    selectVariable(
        selection: ParameterSelectOption,
        param: ConnectorParameter
    ): void {
        const noneSelected = selection.id === NoneValue;

        if (noneSelected && !param.required) {
            delete this.data[param.name];
        } else {
            this.data[param.name] = {
                type: MappingType.variable,
                value: noneSelected ? null : selection.name
            };
        }
        this.update.emit(this.data);
    }

    setParamWithValue(value: string, param: ConnectorParameter): void {
        if (!value.length && !param.required) {
            delete this.data[param.name];
        } else {
            this.data[param.name] = {
                type: MappingType.value,
                value
            };
        }
        this.update.emit(this.data);
    }

    initOptionsForParams() {
        this.parameters.forEach(param => {
            this.optionsForParams[param.name] = [
                { id: NoneValue, name: 'None' },
                ...this.processProperties.filter(
                    prop => prop.type === param.type
                )
            ];
        });
    }

    initMapping() {
        this.parameters.forEach(param => {
            if (!this.mappingTypes[param.name]) {
                this.mappingTypes[param.name] = MappingType.variable;
            }

            if (this.mapping[param.name]) {
                this.mappingTypes[param.name] = this.mapping[param.name].type;
                this.values[param.name] =
                    this.mapping[param.name].type === MappingType.value
                        ? this.mapping[param.name].value
                        : '';
                this.paramName2VariableName[param.name] =
                    this.mapping[param.name].type === MappingType.variable
                        ? this.mapping[param.name].value
                        : '';
            }
        });
    }

    compareWith(option: ParameterSelectOption, selectedVariableName: string) {
        if (selectedVariableName === null && option.id === NoneValue) {
            return true;
        }

        return option.name === selectedVariableName;
    }

    isThereOptionForParam(parameter: ConnectorParameter) {
        if (parameter.required) {
            return this.optionsForParams[parameter.name].length > 1;
        }

        return this.optionsForParams[parameter.name].length > 0;
    }

    toggle(paramName: string) {
        this.mappingTypes[paramName] =
            this.mappingTypes[paramName] === MappingType.variable
                ? MappingType.value
                : MappingType.variable;
    }

    edit(parameterRow: number) {
        const inputMappingUpdate$ = new Subject<ServiceParameterMapping>();

        const theme$ = this.store.select(selectSelectedTheme).pipe(
            map(theme => (theme.className === 'dark-theme' ? 'vs-dark' : 'vs-light'))
        );

        const dialogData: MappingDialogData = {
            inputMapping: this.mapping,
            inputParameters: this.parameters,
            mappingType: VariableMappingType.input,
            processProperties: this.processProperties,
            selectedRow: parameterRow,
            theme$: theme$,
            inputMappingUpdate$: inputMappingUpdate$
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
}
