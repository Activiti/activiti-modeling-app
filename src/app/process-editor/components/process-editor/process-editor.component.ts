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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, of } from 'rxjs';
import { ProcessModelerService } from '../../services/process-modeler.service';
import { selectProcessCrumb, selectProcessLoading, selectSelectedProcessDiagram } from '../../store/process-editor.selectors';
import {
    Process,
    OpenConfirmDialogAction,
    BreadcrumbItem,
    AmaState,
    SnackbarErrorAction,
    EntityDialogForm,
    selectProjectCrumb,
    ProcessContent,
    selectSelectedProcess,
} from 'ama-sdk';
import { DownloadProcessAction, ValidateProcessAttemptAction, UpdateProcessAttemptAction, DeleteProcessAttemptAction } from '../../store/process-editor.actions';
import { filter } from 'rxjs/operators';
import { documentationHandler } from '../../services/bpmn-js/property-handlers/documentation.handler';
import { nameHandler } from '../../services/bpmn-js/property-handlers/name.handler';

@Component({
    templateUrl: './process-editor.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ProcessEditorComponent implements OnInit {
    loading$: Observable<boolean>;
    breadcrumbs$: Observable<BreadcrumbItem[]>;
    diagram$: Observable<ProcessContent>;
    process$: Observable<Process>;

    constructor(private store: Store<AmaState>, private processModeler: ProcessModelerService) {}

    ngOnInit() {
        this.loading$ = this.store.select(selectProcessLoading);
        this.process$ = this.store.select(selectSelectedProcess);
        this.diagram$ = this.store.select(selectSelectedProcessDiagram);

        this.breadcrumbs$ = combineLatest(
            of({ url: '/home', name: 'Dashboard' }),
            this.store.select(selectProjectCrumb).pipe(filter(value => value !== null)),
            this.store.select(selectProcessCrumb).pipe(filter(value => value !== null))
        );
    }

    saveDiagram(processId: string): void {
        const element = this.processModeler.getRootProcessElement();
        const metadata: Partial<EntityDialogForm> = {
            name: nameHandler.get(element),
            description: documentationHandler.get(element),
        };
        this.processModeler
            .export()
            .then(content => this.store.dispatch(new ValidateProcessAttemptAction({
                processId,
                content,
                action: new UpdateProcessAttemptAction({ processId, content, metadata })
            })))
            .catch(() => this.store.dispatch(new SnackbarErrorAction('APP.PROCESS_EDITOR.ERRORS.SAVE_DIAGRAM')));
    }

    downloadDiagram(process: Process): void {
        this.processModeler
            .export()
            .then(content => this.store.dispatch(new ValidateProcessAttemptAction({
                processId: process.id,
                content,
                action: new DownloadProcessAction(process)
            })))
            .catch(() => this.store.dispatch(new SnackbarErrorAction('APP.PROCESSES.ERRORS.DOWNLOAD_DIAGRAM')));
    }

    deleteProcess(processId: string): void {
        this.store.dispatch(
            new OpenConfirmDialogAction({
                dialogData: {
                    subtitle: 'APP.DIALOGS.CONFIRM.CUSTOM.PROCESS'
                },
                action: new DeleteProcessAttemptAction(processId)
            })
        );
    }
}
