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

import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { ProcessErrorsService } from '../../../services/process-errors.service';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

export interface ProcessErrorsDialogData extends MatDialogConfig {
    columns: string[];
    propertiesUpdate$: Subject<Bpmn.BusinessObject[]>;
}

@Component({
    templateUrl: './process-errors-dialog.component.html',
    selector: 'ama-process-errors-dialog',
    styleUrls: ['./process-errors-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ProcessErrorsDialogComponent implements OnInit {

    displayedColumns: string[];
    selectedProcessError: Bpmn.BusinessObject;
    dataSource: MatTableDataSource<Bpmn.BusinessObject>;
    processErrors: Bpmn.BusinessObject[] = [];

    position: number;
    showForm: boolean;
    processErrorsChanged = false;

    constructor(
        public dialog: MatDialogRef<ProcessErrorsDialogComponent>,
        private processErrorsService: ProcessErrorsService,
        @Inject(MAT_DIALOG_DATA) public data: ProcessErrorsDialogData) {
        this.displayedColumns = data.columns;
    }

    ngOnInit() {
        const processErrorsFromXML = this.processErrorsService.getUpdatedProcessErrors();
        this.processErrors = [...processErrorsFromXML];
        this.updateProcessErrors();
    }

    updateProcessErrors() {
        this.dataSource = new MatTableDataSource(this.processErrors);
    }

    createProcessError() {
        this.processErrorsChanged = true;
        const newProcessError = this.processErrorsService.createProcessError();
        this.processErrors.push(newProcessError);
        this.updateProcessErrors();
    }

    deleteProcessError(element: Bpmn.DiagramElement) {
        this.processErrorsChanged = true;
        const deletedProcessErrorIndex = this.processErrors.map((processError) => processError.id).indexOf(element.id);
        this.processErrors.splice(deletedProcessErrorIndex, 1);
        this.updateProcessErrors();
    }

    editProcessError(element: Bpmn.BusinessObject, index: number) {
        this.selectedProcessError = element;
        this.showForm = true;
        this.position = index;
    }

    onProcessErrorChanged() {
        this.processErrorsChanged = this.selectedProcessError.name && this.selectedProcessError.errorCode;
    }

    onSave() {
        this.processErrorsChanged = false;
        this.processErrorsService.saveProcessErrors(this.processErrors);
        this.data.propertiesUpdate$.next();
        this.data.propertiesUpdate$.complete();
        this.dialog.close();
    }

    onClose() {
        this.processErrorsChanged = false;
        this.processErrors = [];
        this.data.propertiesUpdate$.complete();
        this.dialog.close();
    }
}
