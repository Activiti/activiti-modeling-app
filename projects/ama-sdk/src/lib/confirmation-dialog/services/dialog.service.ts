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

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subject, Observable } from 'rxjs';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { ConfirmDialogData } from '../../store/app.actions';
import { Action } from '@ngrx/store';

@Injectable()
export class DialogService {
    constructor(private dialog: MatDialog) {}

    openDialog(dialog, options = {}): void {
        this.dialog.open(dialog, {
            width: '600px',
            ...options
        });
    }

    closeAll(): void {
        this.dialog.closeAll();
    }

    confirm(dialogData?: ConfirmDialogData, action?: Action): Observable<boolean> {
        const subjectConfirm = new Subject<boolean>();

        this.dialog.open(ConfirmationDialogComponent, {
            width: '600px',
            disableClose: true,
            data: {
                ...dialogData,
                ...({ confirmButton: !!action }),
                subject: subjectConfirm
            }
        });

        return subjectConfirm.asObservable();
    }
}
