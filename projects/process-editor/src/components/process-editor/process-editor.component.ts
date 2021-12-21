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

import { Component, OnInit, ViewEncapsulation, Inject, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, take, tap, switchMap, catchError, shareReplay } from 'rxjs/operators';
import { Observable, combineLatest, of, Subject, concat, zip, merge } from 'rxjs';
import {
    selectProcessCrumb,
    selectProcessLoading,
    selectProcessEditorSaving,
    selectProcessContentById
} from '../../store/process-editor.selectors';
import {
    Process,
    BreadcrumbItem,
    AmaState,
    selectProjectCrumb,
    ProcessContent,
    SetAppDirtyStateAction,
    ProcessModelerService,
    ProcessModelerServiceToken,
    CodeValidatorService,
    ProcessExtensions,
    PROCESS,
    getFileUri,
    CodeEditorPosition,
    CanComponentDeactivate,
    ModelEditorState,
    StatusBarService,
    ContentType,
    selectProcessById,
    ModelExtensions
} from '@alfresco-dbp/modeling-shared/sdk';
import {
    ChangeProcessModelContextAction,
    UpdateProcessAttemptAction,
    UpdateProcessExtensionsAction,
} from '../../store/process-editor.actions';
import { ProcessDiagramLoaderService } from '../../services/process-diagram-loader.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ProcessModelContext } from '../../store/process-editor.state';
import { modelNameHandler } from '../../services/bpmn-js/property-handlers/model-name.handler';
import { documentationHandler } from '../../services/bpmn-js/property-handlers/documentation.handler';
import { ProcessCommandsService } from '../../services/commands/process-commands.service';

@Component({
    selector: 'ama-process-editor-component',
    templateUrl: './process-editor.component.html',
    styleUrls: ['./process-editor.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [ ProcessCommandsService ]
})
export class ProcessEditorComponent implements OnInit, CanComponentDeactivate, OnDestroy {
    @Input()
    modelId: string;

    loading$: Observable<boolean>;
    breadcrumbs$: Observable<BreadcrumbItem[]>;

    modelId$: Observable<string>;
    editorContent$: Observable<ProcessContent>;
    initialContent: ProcessContent;
    modelMetadata$: Observable<Process>;
    editorContentSubject$: Subject<ProcessContent> = new Subject<ProcessContent>();
    editorMetadataSubject$: Subject<Process> = new Subject<Process>();

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
    extensionFileUri: string;
    processFileUri: string;
    extensionsLanguageType = 'json';
    processesLanguageType = 'xml';

    constructor(
        private store: Store<AmaState>,
        private codeValidatorService: CodeValidatorService,
        @Inject(ProcessModelerServiceToken) private processModeler: ProcessModelerService,
        private processLoaderService: ProcessDiagramLoaderService,
        private statusBarService: StatusBarService,
        private modelCommands: ProcessCommandsService
    ) {}

    ngOnInit() {
        const contentFromStore$ = this.store.select(selectProcessContentById(this.modelId)).pipe(
            filter(content => !!content),
            take(1),
            tap(content => this.initialContent = content)
        );
        const metadataFromStore$ = this.store.select(selectProcessById(this.modelId)).pipe(
            filter(metadata => !!metadata)
        );
        this.editorContent$ = concat(contentFromStore$, this.editorContentSubject$).pipe(shareReplay(1));
        this.modelMetadata$ = merge(metadataFromStore$, this.editorMetadataSubject$).pipe(
            shareReplay(1)
        );

        this.extensions$ = this.modelMetadata$.pipe(
            filter(process => !!process && !!process.extensions),
            map(process => JSON.stringify(process.extensions, undefined, 4).trim())
        );

        this.modelId$ = of(this.modelId); // Refactor this to not be an observable
        this.modelCommands.init(PROCESS, ContentType.Process, this.modelId$, this.editorContent$, this.modelMetadata$);

        this.processFileUri = getFileUri(PROCESS, this.processesLanguageType, this.modelId);
        this.extensionFileUri = getFileUri(PROCESS, this.extensionsLanguageType, this.modelId);

        this.loading$ = this.store.select(selectProcessLoading);
        this.breadcrumbs$ = combineLatest([
            of({ url: '/home', name: 'Dashboard' }),
            this.store.select(selectProjectCrumb).pipe(filter(value => value !== null)),
            this.store.select(selectProcessCrumb).pipe(filter(value => value !== null))
        ]);
    }

    async onBpmnEditorChange(): Promise<void> {
        const modelContent = await this.processModeler.export();
        this.editorContentSubject$.next(modelContent);

        const element = this.processModeler.getRootProcessElement();
        this.editorMetadataSubject$.next({
            ...this.metadataSnapshot,
            extensions: {
                ...this.extensionsSnapshot
            },
            name: modelNameHandler.get(element),
            description: documentationHandler.get(element),
        });
    }

    onXmlEditorChange(modelContent: ProcessContent): void {
        this.processLoaderService.load(modelContent)
            .subscribe(() => {
                this.store.dispatch(new SetAppDirtyStateAction(true));
            });
        this.editorContentSubject$.next(modelContent);
    }

    onExtensionEditorChange(extensions: string): void {
        const validation = this.codeValidatorService.validateJson<ProcessExtensions>(extensions);

        this.disableSave = !validation.valid;

        if (validation.valid) {
            this.store.dispatch(new UpdateProcessExtensionsAction({ extensions: JSON.parse(extensions), modelId: this.modelId }));
            this.store.dispatch(new SetAppDirtyStateAction(true));
        }
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
        return zip(this.editorContent$, this.modelMetadata$)
            .pipe(
                take(1),
                tap(([modelContent, modelMetadata]) => this.store.dispatch(
                    new UpdateProcessAttemptAction({ modelId: this.modelId,
                        modelContent,
                        modelMetadata
                    })
                )),
                switchMap(() => this.store.select(selectProcessEditorSaving)),
                filter(updateState => (updateState === ModelEditorState.SAVED) || (updateState === ModelEditorState.FAILED)),
                take(1),
                map(state => state === ModelEditorState.SAVED),
                catchError(() => of(false))
            );
    }

    private get metadataSnapshot(): Process {
        let metadata: Process;
        this.modelMetadata$.pipe(take(1)).subscribe(m => metadata = m);
        return metadata;
    }

    private get extensionsSnapshot(): ModelExtensions {
        let extensions: ModelExtensions;
        this.extensions$.pipe(take(1)).subscribe(e => extensions = JSON.parse(e));
        return extensions;
    }

    ngOnDestroy() {
        this.modelCommands.destroy();
    }
}
