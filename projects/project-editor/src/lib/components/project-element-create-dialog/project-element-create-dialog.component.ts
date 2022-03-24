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

import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { EntityProperty } from '@alfresco-dbp/modeling-shared/sdk';
import { MatDialogRef } from '@angular/material/dialog';

export interface CalledElementModel {
    processVariables: EntityProperty[];
    processName: string;
    calledElement: string;
    calledElementType: string;
}

@Component({
    templateUrl: './project-element-create-dialog.component.html',
    styleUrls: ['./project-element-create-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectElementCreateDialogComponent {

    constructor(public dialog: MatDialogRef<ProjectElementCreateDialogComponent>) {
    }

    onClickClose() {
        this.dialog.close();
    }

}
