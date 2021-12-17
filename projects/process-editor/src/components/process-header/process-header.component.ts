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

import { Component, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import {
    Process,
    AmaState,
    OpenConfirmDialogAction,
    ProcessContent,
    BreadcrumbItem,
    SnackbarInfoAction,
    SnackbarErrorAction,
    ProcessModelerService,
    ProcessModelerServiceToken,
    BasicModelCommands
} from '@alfresco-dbp/modeling-shared/sdk';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { DeleteProcessAttemptAction, ValidateProcessAttemptAction, DownloadProcessAction, DownloadProcessSVGImageAction, OpenSaveAsProcessAction, SaveAsProcessAttemptAction } from '../../store/process-editor.actions';
import { takeUntil } from 'rxjs/operators';
import { selectProcessModelContext } from '../../store/process-editor.selectors';
import { ProcessModelContext } from '../../store/process-editor.state';
import { documentationHandler } from '../../services/bpmn-js/property-handlers/documentation.handler';
import { ProcessCommandsService } from '../../services/commands/process-commands.service';

@Component({
    selector: 'ama-process-header',
    templateUrl: './process-header.component.html'
})
export class ProcessHeaderComponent implements  OnInit, OnDestroy {
    private destroy$ = new Subject<boolean>();

    @Input()
    modelId: string;

    @Input()
    content: ProcessContent;

    @Input()
    modelMetadata: Process;

    @Input()
    breadcrumbs$: Observable<BreadcrumbItem[]>;

    @Input()
    disableSave = false;

    public modeler: Bpmn.Modeler;
    private modelContext: ProcessModelContext;

    constructor(
        private store: Store<AmaState>,
        private modelCommands: ProcessCommandsService,
        @Inject(ProcessModelerServiceToken)
        private processModeler: ProcessModelerService
    ) {}

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
        this.modelCommands.dispatchEvent(BasicModelCommands.save);
    }

    onDownload(process: Process): void {
        this.store.dispatch(new ValidateProcessAttemptAction({
            title: 'APP.DIALOGS.CONFIRM.DOWNLOAD.PROCESS',
            modelId: process.id,
            modelContent: this.content,
            modelMetadata: this.modelMetadata,
            action: new DownloadProcessAction(process)
        }));
    }

    deleteProcess(): void {
        this.store.dispatch(
            new OpenConfirmDialogAction({
                dialogData: { title: 'APP.DIALOGS.CONFIRM.DELETE.PROCESS' },
                action: new DeleteProcessAttemptAction(this.modelId)
            })
        );
    }

    onSaveProcessImage(process: Process): void {
        this.store.dispatch(new ValidateProcessAttemptAction({
            title: 'APP.DIALOGS.CONFIRM.DOWNLOAD.IMAGE',
            modelId: process.id,
            modelContent: this.content,
            modelMetadata: this.modelMetadata,
            action: new DownloadProcessSVGImageAction(process)
        }));
    }

    onValidateProcess(process: Process): void {
        this.store.dispatch(new ValidateProcessAttemptAction({
            title: 'APP.DIALOGS.ERROR.SUBTITLE',
            modelId: process.id,
            modelContent: this.content,
            modelMetadata: this.modelMetadata,
            action: new SnackbarInfoAction('PROCESS_EDITOR.PROCESS_VALID'),
            errorAction: new SnackbarErrorAction('PROCESS_EDITOR.PROCESS_INVALID')
        }));
    }

    onSaveAs() {
        const element = this.processModeler.getRootProcessElement();
        this.store.dispatch(new ValidateProcessAttemptAction({
            title: 'APP.DIALOGS.CONFIRM.SAVE_AS.PROCESS',
            modelId: this.modelId,
            modelContent: this.content,
            modelMetadata: this.modelMetadata,
            action: new OpenSaveAsProcessAction({
                id: this.modelId,
                name: this.modelMetadata.name,
                description: documentationHandler.get(element),
                sourceContent: this.content,
                sourceExtensions: this.modelMetadata.extensions,
                action: SaveAsProcessAttemptAction
            })
        }));
    }
}
