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

import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs';

export interface ConfirmDialogPayload {
    subject: Subject<boolean>;
    title?: string;
    subtitle?: string;
    errors?: string[];
    confirmButton?: boolean;
}

@Component({
    templateUrl: './confirmation-dialog.component.html'
})
export class ConfirmationDialogComponent implements OnInit {
    title: string;
    subtitle: string;
    confirmButton: boolean;
    errors: string[];
    subject: Subject<boolean>;

    constructor(
        public dialog: MatDialogRef<ConfirmationDialogComponent>,
        @Optional()
        @Inject(MAT_DIALOG_DATA)
        public data: ConfirmDialogPayload
    ) {}

    ngOnInit() {
        this.title = this.data.title || 'APP.DIALOGS.CONFIRM.TITLE';
        this.subtitle = this.data.subtitle || 'APP.DIALOGS.CONFIRM.SUBTITLE';
        this.subject = this.data.subject;
        this.confirmButton = this.data.confirmButton;
        this.errors = this.data.errors || [];
    }

    choose(choice: boolean): void {
        this.subject.next(choice);
        this.dialog.close();
        this.subject.complete();
    }
}
