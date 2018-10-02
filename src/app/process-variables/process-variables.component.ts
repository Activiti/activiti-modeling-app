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

import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import * as propertiesSchema from '../schemas/properties.schema.json';
import { JsonValidatorService } from 'ama-sdk';
import { ProcessVariablesService } from './process-variables.service';
import { ProcessProperties } from 'ama-sdk';

const Ajv = require('ajv');

export interface VariableDialogData extends MatDialogConfig {
    properties: ProcessProperties;
    propertiesUpdate$: Subject<ProcessProperties>;
}

@Component({
    templateUrl: './process-variables.component.html'
})

export class ProcessVariablesComponent implements OnInit, OnDestroy {
    error: string;
    ajv = new Ajv();
    editorContent = '{}';
    subscription: Subscription;
    serviceSubscription: Subscription;

    constructor(
        public dialog: MatDialogRef<ProcessVariablesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: VariableDialogData,

        private variablesService: ProcessVariablesService,
        private jsonValidatorService: JsonValidatorService
    ) {}

    ngOnInit() {
        this.serviceSubscription = this.variablesService.variablesData.subscribe(dataObj => {
            if (dataObj.data) {
                this.editorContent = dataObj.data;
                this.error = dataObj.error;
            }

        });

        if (this.data && this.data.properties) {
            if (this.data.properties) {
                this.editorContent = JSON.stringify(this.data.properties, null, 2);
                this.variablesService.sendData(this.editorContent, null);
            }
        }
    }

    ngOnDestroy() {
        this.serviceSubscription.unsubscribe();
    }

    onChange($event) {
        this.error = this.validate($event).error;
        this.variablesService.sendData($event, this.error);
    }

    validate(properties: string) {
        return this.jsonValidatorService.validate(properties, propertiesSchema);
    }

    save() {
        const data = JSON.parse(this.editorContent);
        this.data.propertiesUpdate$.next(data);
    }

    onClose() {
        this.data.propertiesUpdate$.complete();
    }
}
