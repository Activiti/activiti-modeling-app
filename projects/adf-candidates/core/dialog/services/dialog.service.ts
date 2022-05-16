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

import { Injectable, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, Observable } from 'rxjs';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { DialogData, MultipleChoiceDialogData } from '../interfaces/dialog.interface';
import { InfoDialogComponent } from '../components/info-dialog/info-dialog.component';
import { MultipleChoiceDialogComponent, MultipleChoiceDialogReturnType } from '../components/multiple-choice-dialog/multiple-choice-dialog.component';
import { ComponentType } from '@angular/cdk/portal';

@Injectable()
export class DialogService {
    constructor(private dialog: MatDialog) {}

    openDialog<T>(dialog: ComponentType<T> | TemplateRef<T>, options = {}): MatDialogRef<T> {
        return this.dialog.open(dialog, {
            width: '600px',
            ...options
        });
    }

    closeAll(): void {
        this.dialog.closeAll();
    }

    info(dialogData?: DialogData): Observable<any> {
        return this.openObservableDialog(InfoDialogComponent, { disableClose: true }, dialogData);
    }

    confirm(dialogData?: DialogData): Observable<boolean> {
        return this.openObservableDialog(ConfirmationDialogComponent, { disableClose: true }, dialogData);
    }

    private openObservableDialog(dialog, options = {}, data = {}): Observable<any> {
        const dialogSubject = new Subject<any>();

        this.dialog.open(dialog, {
            width: '600px',
            ...options,
            data: {
                ...data,
                subject: dialogSubject
            }
        });

        return dialogSubject.asObservable();
    }

    openMultipleChoiceDialog<T>(dialogData: MultipleChoiceDialogData<T>): Observable<MultipleChoiceDialogReturnType<T>> {
        const subjectMultipleChoice = new Subject<MultipleChoiceDialogReturnType<T>>();

        this.dialog.open(MultipleChoiceDialogComponent, {
            width: '600px',
            disableClose: true,
            data: {
                ...dialogData,
                subject: subjectMultipleChoice
            }
        });

        return subjectMultipleChoice.asObservable();
    }
}
