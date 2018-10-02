/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ProcessProperty, ProcessProperties } from 'ama-sdk';
import { ProcessVariablesService } from '../process-variables.service';
import { UuidService } from '../../process-editor/services/uuid.service';
import { primitive_types } from '../../common/helpers/primitive-types';



@Component({
    templateUrl: './properties-viewer.component.html',
    selector: 'ama-properties-viewer'
})

export class PropertiesViwerComponent implements OnInit, OnDestroy {
    displayedColumns = [ 'name', 'type', 'required', 'value', 'delete' ];
    types = primitive_types;
    subscription: Subscription;
    serviceSubscription: Subscription;
    dataSource: MatTableDataSource<ProcessProperty>;
    data: ProcessProperties = {};
    name: string;
    selectedType: string;
    form: ProcessProperty;
    position: number;
    showForm = false;
    error = false;
    isSelected = false;
    required: boolean;
    value: string;
    id: string;
    selection = new SelectionModel<ProcessProperty>();
    @Input() properties = '';


    constructor (private variablesService: ProcessVariablesService, private uuidService: UuidService) {
        this.form = {
            id: '',
            name: '',
            type: '',
            required: false,
            value: ''
        };
    }

    ngOnInit() {
        if (this.properties) {
            let dataArray: ProcessProperty[] = [];
            dataArray = Object.values(JSON.parse(this.properties));

            this.dataSource = new MatTableDataSource(dataArray);
            this.data = JSON.parse(this.properties);

        }
        this.serviceSubscription = this.variablesService.variablesData.subscribe(dataObj => {
            if (!dataObj.error || dataObj.error === 'APP.PROCESS_EDITOR.PROPERTIES.ERRORS.EMPTY_NAME') {
                let dataArray: ProcessProperty[] = [];
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
            }
        });
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
    }

    editRow(element, index) {
        this.showForm = true;
        this.name = element.name;
        this.selectedType = element.type;
        this.required = element.required;
        this.value = element.value;
        this.position = index;
        this.id = element.id;
    }

    saveChanges() {
        this.form.name = this.name;
        this.form.type = this.selectedType;
        this.form.required = this.required;
        this.form.value = this.value;
        this.form.id = this.id;

        this.data[this.id] = this.form;

        if (this.isNotEmpty(this.data)) {
            this.variablesService.sendData(JSON.stringify(this.data, null, 2), null);
            this.error = false;
        } else {
            this.variablesService.sendData(JSON.stringify(this.data, null, 2), 'APP.PROCESS_EDITOR.PROPERTIES.ERRORS.EMPTY_NAME');
            this.error = true;
        }
    }

    isNotEmpty(data: ProcessProperties) {
        return Object.values(data).every(item => !!item.name.trim().length);
    }

    addRow() {
        const newVariable = {
            'id': this.uuidService.generate(),
            'name' : 'name',
            'type' : 'string',
            'required': false,
            'value': ''
        };

        this.data[newVariable.id] = newVariable;
        this.variablesService.sendData(JSON.stringify(this.data, null, 2), null);
        const length = Object.keys(this.data).length;
        this.editRow(newVariable, length - 1);
    }
}
