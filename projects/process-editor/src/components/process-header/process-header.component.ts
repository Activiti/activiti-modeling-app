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

import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {
    Process,
    AmaState,
    ProcessContent,
    BreadcrumbItem,
    BasicModelCommands,
} from '@alfresco-dbp/modeling-shared/sdk';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { ValidateProcessAttemptAction, DownloadProcessSVGImageAction } from '../../store/process-editor.actions';
import { takeUntil } from 'rxjs/operators';
import { selectProcessModelContext } from '../../store/process-editor.selectors';
import { ProcessModelContext } from '../../store/process-editor.state';
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
        private modelCommands: ProcessCommandsService
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

    onDownload(): void {
        this.modelCommands.dispatchEvent(BasicModelCommands.download);
    }

    deleteProcess(): void {
        this.modelCommands.dispatchEvent(BasicModelCommands.delete);
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

    onValidateProcess(): void {
        this.modelCommands.dispatchEvent(BasicModelCommands.validate);
    }

    onSaveAs() {
        this.modelCommands.dispatchEvent(BasicModelCommands.saveAs);
    }
}
