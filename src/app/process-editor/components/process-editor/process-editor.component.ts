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
import { filter, map } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { selectProcessCrumb, selectProcessLoading, selectSelectedProcessDiagram } from '../../store/process-editor.selectors';
import {
    Process,
    BreadcrumbItem,
    AmaState,
    selectProjectCrumb,
    ProcessContent,
    selectSelectedProcess,
    selectSelectedTheme,
    SetAppDirtyStateAction,
    ProcessModelerService,
    ProcessModelerServiceToken,
    CodeValidatorService,
    ProcessExtensions,
    extensionsSchema,
    PROCESS,
    getFileUri,
    EditorHelperService
} from 'ama-sdk';
import { UpdateProcessExtensionsAction } from '../../store/process-editor.actions';
import { ProcessDiagramLoaderService } from '../../services/process-diagram-loader.service';

@Component({
    templateUrl: './process-editor.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ProcessEditorComponent implements OnInit {
    loading$: Observable<boolean>;
    breadcrumbs$: Observable<BreadcrumbItem[]>;
    content$: Observable<ProcessContent>;
    bpmnContent$: Observable<ProcessContent>;
    process$: Observable<Process>;
    extensions$: Observable<string>;
    vsTheme$: Observable<string>;
    disableSave: boolean;
    tabNames = [
        'PROCESS_EDITOR.TABS.DIAGRAM_EDITOR',
        'PROCESS_EDITOR.TABS.RAW_EDITOR',
        'PROCESS_EDITOR.TABS.EXTENSIONS_EDITOR'
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
        public editorHelper: EditorHelperService
    ) {
        this.vsTheme$ = this.getVsTheme();
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

    onBpmnEditorChange(): void {
        this.processModeler.export().then(content => this.content$ = of(content));
    }

    onXmlChangeAttempt(processContent: ProcessContent): void {
        this.processLoaderService.load(processContent)
            .subscribe(() => {
                this.content$ = of(processContent);
                this.store.dispatch(new SetAppDirtyStateAction(true));
            });
    }

    onExtensionsChangeAttempt(extensionsString: string, processId: string): void {
        const validation = this.codeValidatorService.validateJson<ProcessExtensions>(extensionsString, extensionsSchema);

        this.disableSave = !validation.valid;

        if (validation.valid) {
            this.store.dispatch(new UpdateProcessExtensionsAction({ extensions: JSON.parse(extensionsString), processId }));
            this.store.dispatch(new SetAppDirtyStateAction(true));
        }
    }
}
