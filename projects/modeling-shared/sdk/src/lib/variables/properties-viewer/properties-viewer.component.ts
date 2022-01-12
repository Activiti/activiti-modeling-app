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

import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef, AfterViewInit, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { VariablesService } from '../variables.service';
import { UuidService } from './../../services/uuid.service';
import { primitive_types } from '../../helpers/primitive-types';
import { EntityProperty, EntityProperties } from './../../api/types';
import { FIELD_VARIABLE_NAME_REGEX } from '../../helpers/utils/create-entries-names';
import { MatSort } from '@angular/material/sort';
import { ValueTypeInputComponent } from './value-type-input.component';

@Component({
    templateUrl: './properties-viewer.component.html',
    selector: 'modelingsdk-properties-viewer',
    styleUrls: ['./properties-viewer.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class PropertiesViewerComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
    subscription: Subscription;
    serviceSubscription: Subscription;
    dataSource: MatTableDataSource<EntityProperty>;
    data: EntityProperties = {};
    form: EntityProperty;
    expression: string;
    position: number;
    showForm = false;
    error = false;
    isSelected = false;
    selection = new SelectionModel<EntityProperty>();
    tabIndex = null;
    private readonly EXPRESSION_REGEX = /\${([^]*)}/m;
    @Input() types: string[] = primitive_types;
    @Input() properties = '';
    @Input() requiredCheckbox = true;
    @Input() displayedColumns = ['name', 'type', 'required', 'value', 'delete'];
    @Input() filterValue = '';
    @Input() filterPlaceholder: string;
    @Input() allowExpressions = false;
    @Output() propertyChanged: EventEmitter<boolean> = new EventEmitter();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(ValueTypeInputComponent) valueTypeInput: ValueTypeInputComponent;

    extendedProperties: {
        allowExpressions: boolean;
    };
    autocompletionContext: EntityProperty[];

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

        this.expression = '';
    }

    ngOnInit() {
        if (this.properties) {
            let dataArray: EntityProperty[] = [];
            dataArray = Object.values(JSON.parse(this.properties));

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
                        this.form = item;
                        this.setExpression(item);
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

    editRow(element: EntityProperty, index: number) {
        this.showForm = true;
        this.form = element;
        this.setExpression(element);
        this.position = index;
        this.extendedProperties = {
            allowExpressions: this.allowExpressions
        };
        this.autocompletionContext = this.getVariablesForExpressionEditor(element.id);
        this.updateTabIndex();
    }

    private getVariablesForExpressionEditor(id: any): EntityProperty[] {
        return this.dataSource.data.filter(property => property.id !== id);
    }

    onTypeChange() {
        delete this.form.value;
        this.expression = '';
        this.valueTypeInput?.resetInput();
        this.updateTabIndex();
        this.saveChanges();
    }

    saveChanges() {
        this.data[this.form.id] = this.form;

        if (this.isNotEmpty(this.data)) {

            if (!this.isValid(this.form.name)) {
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

    updateVariableValue(value?: any): void {
        if (this.isValidValue(value)) {
            this.form.value = value;
        } else if (!this.expression || this.expression.trim().length === 0) {
            delete this.form.value;
        }
        this.setExpression(this.form);
        this.saveChanges();
    }

    private isValidValue(value: any) {
        if (value !== null && value !== undefined) {
            return typeof value === 'string' ? value.trim().length > 0 : true;
        }
        return false;
    }

    updateVariableExpression(expression?: any): void {
        if (expression) {
            try {
                this.form.value = JSON.parse(expression);
            } catch (error) {
                this.form.value = expression;
            }
        } else {
            delete this.form.value;
        }
        this.expression = expression;
        this.saveChanges();
    }

    isNotEmpty(data: EntityProperties): boolean {
        return Object.values(data).every(item => !!item.name.trim().length);
    }

    isValid(name: string): boolean {
        return FIELD_VARIABLE_NAME_REGEX.test(name);
    }

    addRow() {
        const newVariable = {
            'id': this.uuidService.generate(),
            'name': '',
            'type': null,
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
    }

    updateTabIndex() {
        const actualValue = String(this.form.value);
        const expressionExist = this.EXPRESSION_REGEX.test(actualValue);
        if (expressionExist) {
            this.tabIndex = 1;
        } else {
            this.tabIndex = 0;
        }
    }

    private setExpression(property: EntityProperty) {
        try {
            if (!property.value || typeof property.value === 'string') {
                this.expression = property.value;
            } else {
                this.expression = JSON.stringify(property.value, null, 4);
            }
        } catch (error) {
            this.expression = property.value;
        }
        this.expression = this.expression || '';
    }
}
