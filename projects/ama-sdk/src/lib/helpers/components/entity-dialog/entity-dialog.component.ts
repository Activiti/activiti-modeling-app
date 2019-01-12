 /*!
 * @license
 * Copyright 2018 Alfresco, Inc. and/or its affiliates.
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

import { Component, OnInit, Optional, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngrx/store';
import { AmaState } from '../../../store/app.state';
import { EntityDialogPayload } from '../../common';
import { EntityDialogForm } from '../../common';

@Component({
    templateUrl: './entity-dialog.component.html'
})
export class EntityDialogComponent implements OnInit {

    submitButton: string;
    form: Partial<EntityDialogForm>;
    ENTER_KEY = 13;

    constructor(
        private store: Store<AmaState>,
        public dialog: MatDialogRef<EntityDialogComponent>,
        @Optional()
        @Inject(MAT_DIALOG_DATA)
        public data: EntityDialogPayload
    ) {}

    ngOnInit() {
        const { values } = this.data;
        this.submitButton = values ? 'APP.DIALOGS.SAVE' : 'APP.DIALOGS.CREATE';
        this.form = {
            name: values && values.name ? values.name : '',
            description: values && values.description ? values.description : ''
        };
    }

    submit(): void {
        const { values } = this.data;
        const payload = values ? { id: values.id, form: this.form } : this.form;
        this.store.dispatch(new this.data.action(payload));
        this.dialog.close();
    }

    @HostListener('document:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        const currentlySelectedElementIsDescription  = event.srcElement.classList.contains('mat-input-element');
        if (event.keyCode === this.ENTER_KEY && !currentlySelectedElementIsDescription) {
            this.submit();
        }
    }
}
