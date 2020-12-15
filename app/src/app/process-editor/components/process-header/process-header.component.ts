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

import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import {
    Process,
    AmaState,
    OpenConfirmDialogAction,
    ProcessContent,
    BreadcrumbItem,
    SnackbarInfoAction,
    SnackbarErrorAction
} from '@alfresco-dbp/modeling-shared/sdk';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { DeleteProcessAttemptAction, ValidateProcessAttemptAction, DownloadProcessAction, DownloadProcessSVGImageAction } from '../../store/process-editor.actions';
import { takeUntil } from 'rxjs/operators';
import { selectProcessModelContext } from '../../store/process-editor.selectors';
import { ProcessModelContext } from '../../store/process-editor.state';

@Component({
    selector: 'ama-process-header',
    templateUrl: './process-header.component.html'
})
export class ProcessHeaderComponent implements  OnInit, OnDestroy {
    private destroy$ = new Subject<boolean>();

    @Input() process: Process;
    @Input() content: ProcessContent;
    @Input() breadcrumbs$: Observable<BreadcrumbItem[]>;
    @Input() disableSave = false;

    @Output()
    save = new EventEmitter<void>();

    public modeler: Bpmn.Modeler;
    private modelContext: ProcessModelContext;

    constructor(private store: Store<AmaState>) {}

    ngOnInit(): void {
        this.store.select(selectProcessModelContext).pipe(
            takeUntil(this.destroy$))
            .subscribe(context => this.modelContext = context);
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    isDiagramTabSelected(): boolean {
        return this.modelContext === ProcessModelContext.diagram;
    }

    onSaveClick(): void {
        this.save.emit();
    }

    onDownload(process: Process): void {
        this.store.dispatch(new ValidateProcessAttemptAction({
            title: 'APP.DIALOGS.CONFIRM.DOWNLOAD.PROCESS',
            processId: process.id,
            content: this.content,
            extensions: this.process.extensions,
            action: new DownloadProcessAction(process)
        }));
    }

    deleteProcess(): void {
        this.store.dispatch(
            new OpenConfirmDialogAction({
                dialogData: { title: 'APP.DIALOGS.CONFIRM.DELETE.PROCESS' },
                action: new DeleteProcessAttemptAction(this.process.id)
            })
        );
    }

    onSaveProcessImage(process: Process): void {
        this.store.dispatch(new ValidateProcessAttemptAction({
            title: 'APP.DIALOGS.CONFIRM.DOWNLOAD.IMAGE',
            processId: process.id,
            content: this.content,
            extensions: this.process.extensions,
            action: new DownloadProcessSVGImageAction(process)
        }));
    }

    onValidateProcess(process: Process): void {
        this.store.dispatch(new ValidateProcessAttemptAction({
            title: 'APP.DIALOGS.ERROR.SUBTITLE',
            processId: process.id,
            content: this.content,
            extensions: this.process.extensions,
            action: new SnackbarInfoAction('PROCESS_EDITOR.PROCESS_VALID'),
            errorAction: new SnackbarErrorAction('PROCESS_EDITOR.PROCESS_INVALID')
        }));
    }
}
