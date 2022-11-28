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

import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ProjectEntityDialogForm } from '../../helpers/common';
import { EntityDialogContentSubmitData } from '../../helpers/components/entity-dialog/dialog-content/entity-dialog-content.component';
import { AmaState } from '../../store/app.state';

@Component({
    templateUrl: './edit-project-dialog.component.html',
})
export class EditProjectDialogComponent {

    constructor(
        @Optional()
        @Inject(MAT_DIALOG_DATA)
        public data: ProjectEntityDialogForm,

        public dialog: MatDialogRef<EditProjectDialogComponent>,
        private store: Store<AmaState>,
    ) {
    }

    submit($event: EntityDialogContentSubmitData): void {
        const {
            payload,
            navigateTo,
            callback
        } = $event;

        this.store.dispatch(new this.data.action({...payload }, navigateTo, callback));
        this.dialog.close();
    }
}
