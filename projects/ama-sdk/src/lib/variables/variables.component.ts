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

import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { Subject, Subscription, Observable } from 'rxjs';
import { VariablesService } from './variables.service';
import { CodeValidatorService } from './../code-editor/services/code-validator.service';
import { propertiesSchema } from './../schemas/properties.schema';
import { EntityProperties } from '../../lib/api/types';

const Ajv = require('ajv');

export interface VariableDialogData extends MatDialogConfig {
    properties: EntityProperties;
    fileUri: string;
    columns: string[];
    title: string;
    required: boolean;
    propertiesUpdate$: Subject<EntityProperties>;
    theme$: Observable<string>;
}

@Component({
    templateUrl: './variables.component.html'
})

export class VariablesComponent implements OnInit, OnDestroy {
    error: string;
    ajv = new Ajv();
    editorContent = '{}';
    subscription: Subscription;
    serviceSubscription: Subscription;
    vsTheme$: Observable<string>;
    title: string;
    fileUri: string;
    requiredCheckbox: boolean;
    columns: string[];
    validVariables = true;


    constructor(
        public dialog: MatDialogRef<VariablesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: VariableDialogData,
        private variablesService: VariablesService,
        private codeValidatorService: CodeValidatorService
    ) {
        this.vsTheme$ = data.theme$;
        this.title = data.title;
        this.fileUri = data.fileUri;
        this.requiredCheckbox = data.required;
        this.columns = data.columns;
    }

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

    onPropertyChanged() {
        try {
            const data = JSON.parse(this.editorContent);
            this.validVariables = this.validateDuplicateVariable(<EntityProperties> data);
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.log('Error cannot parse JSON', e);
        }
    }

    validate(properties: string) {
        return this.codeValidatorService.validateJson(properties, propertiesSchema);
    }

    validateDuplicateVariable(variables: EntityProperties): boolean {
        return this.variablesService.validateFormVariable(variables);
    }

    save() {
        const data = JSON.parse(this.editorContent);

        this.convertJsonStringVariablesToJsonObjects(data);
        this.data.propertiesUpdate$.next(data);
        this.data.propertiesUpdate$.complete();
        this.dialog.close();
    }

    private convertJsonStringVariablesToJsonObjects(data) {
        for (const key  in data) {
            if (data[key].type === 'json' && typeof(data[key].value) !== 'object') {
                data[key].value = JSON.parse(data[key].value);
            }
        }
    }

    onClose() {
        this.data.propertiesUpdate$.complete();
    }

    isSaveDisabled(): boolean {
        return !!(this.error && this.error !== 'undefined' || !this.validVariables);
    }
}
