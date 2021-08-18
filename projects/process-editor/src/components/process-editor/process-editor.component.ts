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

import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, take, tap, switchMap, catchError } from 'rxjs/operators';
import { Observable, combineLatest, of, zip } from 'rxjs';
import {
    selectProcessCrumb,
    selectProcessLoading,
    selectSelectedProcessDiagram,
    selectProcessEditorSaving
} from '../../store/process-editor.selectors';
import {
    Process,
    BreadcrumbItem,
    AmaState,
    selectProjectCrumb,
    ProcessContent,
    selectSelectedProcess,
    SetAppDirtyStateAction,
    ProcessModelerService,
    ProcessModelerServiceToken,
    CodeValidatorService,
    ProcessExtensions,
    PROCESS,
    getFileUri,
    CodeEditorPosition,
    EntityDialogForm,
    CanComponentDeactivate,
    ModelEditorState,
    StatusBarService
} from '@alfresco-dbp/modeling-shared/sdk';
import {
    UpdateProcessExtensionsAction,
    ChangeProcessModelContextAction,
    ValidateProcessAttemptAction,
    UpdateProcessAttemptAction
} from '../../store/process-editor.actions';
import { ProcessDiagramLoaderService } from '../../services/process-diagram-loader.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ProcessModelContext } from '../../store/process-editor.state';
import { modelNameHandler } from '../../services/bpmn-js/property-handlers/model-name.handler';
import { documentationHandler } from '../../services/bpmn-js/property-handlers/documentation.handler';

@Component({
    templateUrl: './process-editor.component.html',
    styleUrls: ['./process-editor.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ProcessEditorComponent implements OnInit, CanComponentDeactivate {
    loading$: Observable<boolean>;
    breadcrumbs$: Observable<BreadcrumbItem[]>;
    content$: Observable<ProcessContent>;
    bpmnContent$: Observable<ProcessContent>;
    process$: Observable<Process>;
    extensions$: Observable<string>;
    disableSave: boolean;
    tabNames = [
        'PROCESS_EDITOR.TABS.DIAGRAM_EDITOR',
        'PROCESS_EDITOR.TABS.RAW_EDITOR',
        'PROCESS_EDITOR.TABS.EXTENSIONS_EDITOR'
    ];
    modelContext = [
        ProcessModelContext.diagram,
        ProcessModelContext.bpmn,
        ProcessModelContext.extension
    ];
    selectedTabIndex = 0;
    extensionFileUri$: Observable<string>;
    processFileUri$: Observable<string>;
    extensionsLanguageType: string;
    processesLanguageType: string;

    constructor(
        private store: Store<AmaState>,
        private codeValidatorService: CodeValidatorService,
        @Inject(ProcessModelerServiceToken) private processModeler: ProcessModelerService,
        private processLoaderService: ProcessDiagramLoaderService,
        private statusBarService: StatusBarService
    ) {
        this.extensionsLanguageType = 'json';
        this.processesLanguageType = 'xml';
    }

    ngOnInit() {
        this.loading$ = this.store.select(selectProcessLoading);
        this.process$ = this.store.select(selectSelectedProcess);
        this.processFileUri$ = this.process$.pipe(
            filter(process => !!process),
            map(process => getFileUri(PROCESS, this.processesLanguageType, process.id))
        );
        this.extensionFileUri$ = this.process$.pipe(
            filter(process => !!process),
            map(process => getFileUri(PROCESS, this.extensionsLanguageType, process.id))
        );
        this.content$ = this.store.select(selectSelectedProcessDiagram);
        this.bpmnContent$ = this.store.select(selectSelectedProcessDiagram);
        this.extensions$ = this.process$.pipe(
            filter(process => !!process && !!process.extensions),
            map(process => JSON.stringify(process.extensions, undefined, 4).trim())
        );

        this.breadcrumbs$ = combineLatest([
            of({ url: '/home', name: 'Dashboard' }),
            this.store.select(selectProjectCrumb).pipe(filter(value => value !== null)),
            this.store.select(selectProcessCrumb).pipe(filter(value => value !== null))
        ]);
    }

    onBpmnEditorChange(): void {
        this.processModeler.export().then(content => this.content$ = of(content));
    }

    onXmlChangeAttempt(processContent: ProcessContent): void {
        this.processLoaderService.load(processContent)
            .subscribe(() => {
                this.store.dispatch(new SetAppDirtyStateAction(true));
            });
        this.content$ = of(processContent);
    }

    onExtensionsChangeAttempt(extensionsString: string, processId: string): void {
        const validation = this.codeValidatorService.validateJson<ProcessExtensions>(extensionsString);

        this.disableSave = !validation.valid;

        if (validation.valid) {
            this.store.dispatch(new UpdateProcessExtensionsAction({ extensions: JSON.parse(extensionsString), processId }));
            this.store.dispatch(new SetAppDirtyStateAction(true));
        }
    }

    private saveAction(processId: string, content): UpdateProcessAttemptAction {
        const element = this.processModeler.getRootProcessElement();
        const metadata: Partial<EntityDialogForm> = {
            name: modelNameHandler.get(element),
            description: documentationHandler.get(element),
        };
        return new UpdateProcessAttemptAction({ processId: processId, content: content, metadata });
    }

    onSave() {
        zip(this.content$, this.process$)
            .pipe(take(1)).subscribe(([content, process]) => {
                this.store.dispatch(new ValidateProcessAttemptAction({
                    title: 'APP.DIALOGS.CONFIRM.SAVE.PROCESS',
                    processId: process.id,
                    content: content,
                    extensions: process.extensions,
                    action: this.saveAction(process.id, content)
                }));
        });
    }

    selectedTabChange(event: MatTabChangeEvent) {
        this.selectedTabIndex = event.index;
        this.statusBarService.setText(this.tabNames[this.selectedTabIndex]);
        this.store.dispatch(new ChangeProcessModelContextAction(this.modelContext[this.selectedTabIndex]));
    }

    codeEditorPositionChanged(position: CodeEditorPosition) {
        if (this.selectedTabIndex > 0 ) {
            this.statusBarService.setText(`Ln ${position.lineNumber}, Col ${position.column}`);
        }
    }

    canDeactivate(): Observable<boolean> {
        return zip(this.content$, this.process$)
            .pipe(
                take(1),
                tap(([content, process]) => this.store.dispatch(this.saveAction(process.id, content)) ),
                switchMap(() => this.store.select(selectProcessEditorSaving)),
                filter(updateState => (updateState === ModelEditorState.SAVED) || (updateState === ModelEditorState.FAILED)),
                take(1),
                map(state => state === ModelEditorState.SAVED),
                catchError(() => of(false))
            );

    }
}
