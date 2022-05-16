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

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ElementVariable, JSONSchemaInfoBasics } from '../../../../../api/types';
import { ModeledObjectChanges } from '../../modeled-object/modeled-object-input.component';

export interface ArrayInputDialogPayload {
    title?: string;
    value?: any;
    model: JSONSchemaInfoBasics;
    autocompletionContext: ElementVariable[];
    disabled?: boolean;
}

@Component({
    templateUrl: './array-input-dialog.component.html'
})
export class ArrayInputDialogComponent implements OnInit {
    title: string;
    value: any = {};
    valid = false;
    model: JSONSchemaInfoBasics;
    disabled: boolean;
    autocompletionContext: ElementVariable[];
    edit = false;

    constructor(
        public dialog: MatDialogRef<ArrayInputDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ArrayInputDialogPayload
    ) { }

    ngOnInit() {
        this.title = this.data.title;
        this.edit = !!this.data.value;
        this.value = this.data.value ? this.data.value : {};
        this.model = this.data.model;
        this.disabled = this.data.disabled;
        this.autocompletionContext = this.data.autocompletionContext;
    }

    onValidChanges(valid: boolean) {
        this.valid = valid;
    }

    onValueChanges(value: ModeledObjectChanges) {
        this.value = value.value;
        this.valid = value.valid;
    }

    close() {
        this.dialog.close();
    }
}
