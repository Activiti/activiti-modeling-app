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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, of, Subject, BehaviorSubject } from 'rxjs';
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
    selectSelectedTheme,
    SetAppDirtyStateAction,
} from 'ama-sdk';
import { DownloadProcessAction, ValidateProcessAttemptAction, UpdateProcessAttemptAction, DeleteProcessAttemptAction } from '../../store/process-editor.actions';
import { filter, map, takeUntil } from 'rxjs/operators';
import { documentationHandler } from '../../services/bpmn-js/property-handlers/documentation.handler';
import { processNameHandler } from '../../services/bpmn-js/property-handlers/process-name.handler';

@Component({
    templateUrl: './process-editor.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ProcessEditorComponent implements OnInit {
    loading$: Observable<boolean>;
    breadcrumbs$: Observable<BreadcrumbItem[]>;
    diagram$: Observable<ProcessContent>;
    process$: Observable<Process>;
    vsTheme$: Observable<string>;
    diagramChange$ = new BehaviorSubject<string>('');
    onDestroy$: Subject<void> = new Subject<void>();

    constructor(private store: Store<AmaState>, private processModeler: ProcessModelerService) {
        this.vsTheme$ = this.getVsTheme();
    }

    ngOnInit() {
        this.loading$ = this.store.select(selectProcessLoading);
        this.process$ = this.store.select(selectSelectedProcess);
        this.diagram$ = this.store.select(selectSelectedProcessDiagram);

        this.diagram$.pipe(takeUntil(this.onDestroy$))
            .subscribe(content => this.diagramChange$.next(content));

        this.breadcrumbs$ = combineLatest(
            of({ url: '/home', name: 'Dashboard' }),
            this.store.select(selectProjectCrumb).pipe(filter(value => value !== null)),
            this.store.select(selectProcessCrumb).pipe(filter(value => value !== null))
        );
    }

    private getVsTheme(): Observable<string> {
        return this.store
            .select(selectSelectedTheme)
            .pipe(map(theme => (theme.className === 'dark-theme' ? 'vs-dark' : 'vs-light')));
    }

    onDiagramChange(): void {
        this.processModeler.export()
            .then(content => this.diagramChange$.next(content));
    }

    onXmlChangeAttempt(processContent: ProcessContent): void {
        this.processModeler.loadXml(processContent)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => this.store.dispatch(new SetAppDirtyStateAction(true)));
    }

    saveDiagram(processId: string): void {
        const element = this.processModeler.getRootProcessElement();
        const metadata: Partial<EntityDialogForm> = {
            name: processNameHandler.get(element),
            description: documentationHandler.get(element),
        };
        this.processModeler
            .export()
            .then(content => this.store.dispatch(new ValidateProcessAttemptAction({
                title: 'APP.DIALOGS.CONFIRM.SAVE.PROCESS',
                processId,
                content,
                action: new UpdateProcessAttemptAction({ processId, content, metadata })
            })))
            .catch(() => this.store.dispatch(new SnackbarErrorAction('PROCESS_EDITOR.ERRORS.SAVE_DIAGRAM')));
    }

    downloadDiagram(process: Process): void {
        this.processModeler
            .export()
            .then(content => this.store.dispatch(new ValidateProcessAttemptAction({
                title: 'APP.DIALOGS.CONFIRM.DOWNLOAD.PROCESS',
                processId: process.id,
                content,
                action: new DownloadProcessAction(process)
            })))
            .catch(() => this.store.dispatch(new SnackbarErrorAction('APP.PROCESSES.ERRORS.DOWNLOAD_DIAGRAM')));
    }

    deleteProcess(processId: string): void {
        this.store.dispatch(
            new OpenConfirmDialogAction({
                dialogData: { title: 'APP.DIALOGS.CONFIRM.DELETE.PROCESS' },
                action: new DeleteProcessAttemptAction(processId)
            })
        );
    }
}
