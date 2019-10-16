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

import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { VariablesService } from '../variables.service';
import { UuidService } from './../../services/uuid.service';
import { primitive_types } from '../../helpers/primitive-types';
import { EntityProperty, EntityProperties } from './../../api/types';

@Component({
    templateUrl: './properties-viewer.component.html',
    selector: 'amasdk-properties-viewer'
})

export class PropertiesViewerComponent implements OnInit, OnDestroy {
    types = primitive_types;
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
    value: string;
    id: string;
    selection = new SelectionModel<EntityProperty>();
    @Input() properties = '';
    @Input() requiredCheckbox = true;
    @Input() displayedColumns = [ 'name', 'type', 'required', 'value', 'delete' ];
    @Output() propertyChanged: EventEmitter<boolean> = new EventEmitter();

    constructor(private variablesService: VariablesService, private uuidService: UuidService) {
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
                        this.value = item.value;
                        this.id = item.id;
                    }
                });

                this.error = false;
            }
        });
    }

    private convertJsonObjectsToJsonStringVariables(properties) {
        for (const key  in properties) {
            if (properties[key].type === 'json' && typeof(properties[key].value) === 'object') {
                properties[key].value = JSON.stringify(properties[key].value);
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
    }

    editRow(element, index: number) {
        this.showForm = true;
        this.name = element.name;
        this.selectedType = element.type;
        this.required = element.required;
        this.value = element.value;
        this.position = index;
        this.id = element.id;
    }

    onTypeChange() {
        this.value = null;
        this.saveChanges();
    }

    saveChanges() {
        this.form.name = this.name;
        this.form.type = this.selectedType;
        this.form.required = this.required;
        this.form.id = this.id;

        if (this.value === null) {
            delete this.form.value;
        } else {
            this.form.value = this.value;
        }

        this.data[this.id] = this.form;

        if (this.isNotEmpty(this.data)) {
            this.variablesService.sendData(JSON.stringify(this.data, null, 2), null);
            this.error = false;
        } else {
            this.variablesService.sendData(JSON.stringify(this.data, null, 2), 'SDK.VARIABLES_EDITOR.ERRORS.EMPTY_NAME');
            this.error = true;
        }
        this.propertyChanged.emit(true);
    }

    isNotEmpty(data: EntityProperties) {
        return Object.values(data).every(item => !!item.name.trim().length);
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
    }
}
