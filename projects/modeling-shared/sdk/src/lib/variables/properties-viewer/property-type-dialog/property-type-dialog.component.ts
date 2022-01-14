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

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JSONSchemaInfoBasics } from '../../../api/types';

@Component({
    templateUrl: './property-type-dialog.component.html',
    styleUrls: ['./property-type-dialog.component.scss']
})
export class PropertyTypeDialogComponent {

    value: JSONSchemaInfoBasics;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: { value: JSONSchemaInfoBasics }
    ) {
        this.value = this.data.value;
    }

}
