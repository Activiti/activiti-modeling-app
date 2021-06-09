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

import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { VariablesService } from '../variables.service';
import { UuidService } from './../../services/uuid.service';
import { primitive_types } from '../../helpers/primitive-types';
import { EntityProperty, EntityProperties } from './../../api/types';
import { FIELD_VARIABLE_NAME_REGEX } from '../../helpers/utils/create-entries-names';
import { MatSort } from '@angular/material/sort';

@Component({
    templateUrl: './properties-viewer.component.html',
    selector: 'modelingsdk-properties-viewer'
})

export class PropertiesViewerComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
    subscription: Subscription;
    serviceSubscription: Subscription;
    dataSource: MatTableDataSource<EntityProperty>;
    data: EntityProperties = {};
    name: string;
    selectedType: string;
    form: EntityProperty;
    position: number;
    showForm = false;
    error = false;
    isSelected = false;
    required?: boolean;
    value: any;
    id: string;
    selection = new SelectionModel<EntityProperty>();
    @Input() types: string[] = primitive_types;
    @Input() properties = '';
    @Input() requiredCheckbox = true;
    @Input() displayedColumns = ['name', 'type', 'required', 'value', 'delete'];
    @Input() filterValue = '';
    @Output() propertyChanged: EventEmitter<boolean> = new EventEmitter();
    @ViewChild(MatSort) sort: MatSort;

    extendedProperties: {
        variables: EntityProperty[]
    };

    constructor(private variablesService: VariablesService, private uuidService: UuidService, private changeDetectorRef: ChangeDetectorRef) {
        this.form = {
            id: '',
            name: '',
            type: '',
            value: ''
        };

        if (this.requiredCheckbox) {
            this.form.required = false;
        }
    }

    ngOnInit() {
        if (this.properties) {
            let dataArray: EntityProperty[] = [];
            dataArray = Object.values(JSON.parse(this.properties));
            this.convertJsonObjectsToJsonStringVariables(dataArray);

            this.dataSource = new MatTableDataSource(dataArray);
            this.data = JSON.parse(this.properties);
        }

        this.serviceSubscription = this.variablesService.variablesData.subscribe(dataObj => {
            if (!dataObj.error || dataObj.error === 'SDK.VARIABLES_EDITOR.ERRORS.EMPTY_NAME') {
                let dataArray: EntityProperty[] = [];
                dataArray = Object.values(JSON.parse(dataObj.data));

                this.dataSource = new MatTableDataSource(dataArray);
                this.data = JSON.parse(dataObj.data);

                dataArray.forEach((item, index) => {
                    if (this.position === index) {
                        this.name = item.name;
                        this.selectedType = item.type;
                        this.required = item.required;
                        this.id = item.id;
                    }
                });

                this.error = false;
            }
        });
        this.dataSource.filterPredicate = (data, filter) => (data.name.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.filterValue && !changes.filterValue.firstChange) {
            this.applyFilter(changes.filterValue.currentValue);
        }
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        this.changeDetectorRef.detectChanges();
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    clearFilterInput() {
        this.filterValue = '';
        this.dataSource.filter = '';
    }

    private convertJsonObjectsToJsonStringVariables(properties) {
        for (const key in properties) {
            if ((properties[key].type === 'json' || properties[key].type === 'folder') && typeof (properties[key].value) === 'object') {
                properties[key].value = JSON.stringify(properties[key].value, null, 4);
            }
        }
    }

    ngOnDestroy() {
        this.serviceSubscription.unsubscribe();
    }

    deleteRow(element, index) {
        this.showForm = false;
        this.position = -1;
        delete this.data[element.id];
        this.variablesService.sendData(JSON.stringify(this.data, null, 2), null);

        if (this.isNotEmpty(this.data)) {
            this.error = false;
        }
        this.propertyChanged.emit(true);
        this.dataSource.sort = this.sort;
    }

    editRow(element, index: number) {
        this.showForm = true;
        this.name = element.name;
        this.selectedType = element.type;
        this.required = element.required;
        this.value = this.form.value = element.value;
        this.position = index;
        this.id = element.id;
        this.extendedProperties = {
            variables: this.getVariablesForExpressionEditor(element.id)
        };
    }

    private getVariablesForExpressionEditor(id: any): EntityProperty[] {
        return this.dataSource.data.filter(property => property.id !== id);
    }

    onTypeChange() {
        delete this.form.value;
        this.saveChanges();
    }

    saveChanges() {
        this.form.name = this.name;
        this.form.type = this.selectedType;
        this.form.required = this.required;
        this.form.id = this.id;

        this.data[this.id] = this.form;

        if (this.isNotEmpty(this.data)) {

            if (!this.isValid(this.name)) {
                this.variablesService.sendData(JSON.stringify(this.data, null, 2), 'SDK.VARIABLES_EDITOR.ERRORS.INVALID_NAME');
                this.error = true;
            } else {
                this.variablesService.sendData(JSON.stringify(this.data, null, 2), null);
                this.error = false;
            }

        } else {
            this.variablesService.sendData(JSON.stringify(this.data, null, 2), 'SDK.VARIABLES_EDITOR.ERRORS.EMPTY_NAME');
            this.error = true;
        }
        this.propertyChanged.emit(true);
    }

    updateVariableValue(value?: any) {
        if (value !== '' || value !== undefined || value !== null) {
            this.form.value = value;
        } else {
            delete this.form.value;
        }

        this.saveChanges();
    }

    isNotEmpty(data: EntityProperties) {
        return Object.values(data).every(item => !!item.name.trim().length);
    }

    isValid(name: string): boolean {
        return FIELD_VARIABLE_NAME_REGEX.test(name);
    }

    addRow() {
        const newVariable = {
            'id': this.uuidService.generate(),
            'name': '',
            'type': 'string',
            'value': ''
        };

        if (this.requiredCheckbox) {
            newVariable['required'] = false;
        }

        this.data[newVariable.id] = newVariable;
        this.variablesService.sendData(JSON.stringify(this.data, null, 2), 'SDK.VARIABLES_EDITOR.ERRORS.EMPTY_NAME');
        this.error = true;
        const length = Object.keys(this.data).length;
        this.editRow(newVariable, length - 1);
        this.propertyChanged.emit(true);
        this.dataSource.sort = this.sort;
        this.extendedProperties = {
            variables: this.getVariablesForExpressionEditor(newVariable.id)
        };
    }
}
