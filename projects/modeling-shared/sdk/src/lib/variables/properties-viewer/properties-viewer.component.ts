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
import { CodeValidatorService } from '../../code-editor/services/code-validator.service';

@Component({
    templateUrl: './properties-viewer.component.html',
    selector: 'modelingsdk-properties-viewer',
    styleUrls: ['./properties-viewer.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class PropertiesViewerComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
    @Input() types: string[] = primitive_types;
    @Input() properties = '';
    @Input() requiredCheckbox = true;
    @Input() displayedColumns = ['name', 'type', 'required', 'displayName', 'value', 'delete'];
    @Input() filterValue = '';
    @Input() filterPlaceholder: string;
    @Input() allowExpressions = false;
    @Output() propertyChanged: EventEmitter<boolean> = new EventEmitter();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(ValueTypeInputComponent) valueTypeInput: ValueTypeInputComponent;

    subscription: Subscription;
    serviceSubscription: Subscription;
    dataSource: MatTableDataSource<EntityProperty>;
    data: EntityProperties = {};
    form: EntityProperty;
    expression: string;
    position: number;
    showForm = false;
    error = false;
    currentValueErrorMessage: string | null = null;
    isSelected = false;
    selection = new SelectionModel<EntityProperty>();
    tabIndex = null;
    extendedProperties: {
        allowExpressions: boolean;
    };
    autocompletionContext: EntityProperty[];

    private readonly EXPRESSION_REGEX = /\${([^]*)}/m;

    constructor(
        private variablesService: VariablesService,
        private uuidService: UuidService,
        private changeDetectorRef: ChangeDetectorRef,
        private codeValidatorService: CodeValidatorService
    ) {
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

        this.serviceSubscription = this.variablesService.variablesData$.subscribe((dataObj) => {
            if (!dataObj.error || dataObj.error === 'SDK.VARIABLES_EDITOR.ERRORS.EMPTY_NAME') {
                this.error = false;
            }

            const parsedData: EntityProperties = JSON.parse(dataObj.data);
            const dataArray = Object.values(parsedData);

            this.dataSource = new MatTableDataSource(dataArray);
            this.applyFilter(this.filterValue);
            this.data = parsedData;

            const item = this.dataSource.filteredData.find((_, index) => index === this.position);

            if (item) {
                this.form = item;
                this.setExpression(item);
            }

        });

        this.dataSource.filterPredicate = (data, filter) => (data.name.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1);
    }

    showDisplayName(value: boolean) {
        this.form.display = value;

        if (!this.form.display) {
            this.form.displayName = undefined;
        }

        this.saveChanges();
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

    deleteRow(id: string) {
        this.showForm = false;
        this.position = -1;
        this.currentValueErrorMessage = null;

        delete this.data[id];

        const errorMessage = this.getErrorMessageFromData(this.data, this.form.name);
        this.variablesService.sendData(JSON.stringify(this.data, null, 2), errorMessage);

        if (this.isNotEmpty(this.data)) {
            this.error = !!errorMessage;
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
        this.validateCurrentFormValue();
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

        const data = JSON.stringify(this.data, null, 2);
        const errorMessage = this.getErrorMessageFromData(this.data, this.form.name);

        this.variablesService.sendData(data, errorMessage);
        this.error = !!errorMessage;

        this.validateCurrentFormValue();
        this.propertyChanged.emit(true);
    }

    validateCurrentFormValue() {
        this.currentValueErrorMessage = this.getValueErrorMessage(this.form.value, this.form.type);
    }

    getErrorMessageFromData(entityProperties: EntityProperties, currentFormName: string): string | null {

        if (!this.isNotEmpty(entityProperties)) {
            return 'SDK.VARIABLES_EDITOR.ERRORS.EMPTY_NAME';
        }

        if (currentFormName && !this.isValid(currentFormName)) {
            return 'SDK.VARIABLES_EDITOR.ERRORS.INVALID_NAME';
        }

        if (this.hasInvalidJson(entityProperties)) {
            return 'APP.GENERAL.ERRORS.NOT_VALID_JSON';
        }

        if (this.hasVariableWithoutType(entityProperties)) {
            return 'SDK.VARIABLES_EDITOR.ERRORS.EMPTY_TYPE';
        }

        if (this.hasVariableWithoutDisplayName(entityProperties)) {
            return 'SDK.VARIABLES_EDITOR.ERRORS.EMPTY_DISPLAY_NAME';
        }

        return null;
    }

    private hasVariableWithoutType(entityProperties: EntityProperties) {
        return !!Object.keys(entityProperties).find(variable => !entityProperties[variable].type);
    }

    hasVariableWithoutDisplayName(entityProperties: EntityProperties) {
        return Object.keys(entityProperties).some(variable => entityProperties[variable].display && !entityProperties[variable].displayName);
    }

    updateVariableValue(value?: any): void {
        if (this.isValidValue(value, this.form.type)) {
            this.form.value = value;
        } else if (!this.expression || this.expression.trim().length === 0) {
            delete this.form.value;
        }
        this.setExpression(this.form);
        this.saveChanges();
    }

    private isValidValue(value: any, type: string) {

        if (type === 'json' && this.isValidJson(value)) {
            return true;
        }

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

    isValidJson(value?: string | any) {
        if (!value || typeof value === 'object') {
            return true;
        }

        return this.codeValidatorService.validateJson(value).valid;
    }

    getValueErrorMessage(value: string | any, type: string): string {
        if (type === 'json' && !this.isValidJson(value)) {
            return 'APP.GENERAL.ERRORS.NOT_VALID_JSON';
        }

        return '';
    }

    hasInvalidJson(data: EntityProperties): boolean {
        return Object.values(data).filter(({ type }) => type === 'json').some(({ value }) => !this.isValidJson(value));
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
