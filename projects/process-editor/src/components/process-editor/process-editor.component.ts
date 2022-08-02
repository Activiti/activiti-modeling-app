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
import { filter, map, take, tap, switchMap, catchError, shareReplay, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject, concat, zip, merge } from 'rxjs';
import {
    selectProcessLoading,
    selectProcessEditorSaving,
    PROCESS_MODEL_ENTITY_SELECTORS
} from '../../store/process-editor.selectors';
import {
    Process,
    AmaState,
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
    ModelExtensions,
    ModelEntitySelectors,
    BasicModelCommands,
    MODEL_COMMAND_SERVICE_TOKEN,
    UpdateTabDirtyState,
} from '@alfresco-dbp/modeling-shared/sdk';
import {
    ChangeProcessModelContextAction,
    DraftDeleteProcessAction,
    DraftUpdateProcessContentAction,
    UpdateProcessAttemptAction,
    UpdateProcessExtensionsAction,
} from '../../store/process-editor.actions';
import { ProcessDiagramLoaderService } from '../../services/process-diagram-loader.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ProcessModelContext } from '../../store/process-editor.state';
import { modelNameHandler } from '../../services/bpmn-js/property-handlers/model-name.handler';
import { documentationHandler } from '../../services/bpmn-js/property-handlers/documentation.handler';
import { categoryHandler } from '../../services/bpmn-js/property-handlers/category.handler';
import { ProcessCommandsService } from '../../services/commands/process-commands.service';

@Component({
    selector: 'ama-process-editor-component',
    templateUrl: './process-editor.component.html',
    styleUrls: ['./process-editor.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        ProcessCommandsService,
        {
            provide: MODEL_COMMAND_SERVICE_TOKEN,
            useExisting: ProcessCommandsService
        }
    ]
})
export class ProcessEditorComponent implements OnInit, CanComponentDeactivate, OnDestroy {
    @Input()
    modelId: string;

    loading$: Observable<boolean>;
    readonly modelType = PROCESS;
    modelId$: Observable<string>;
    editorContent$: Observable<ProcessContent>;
    contentFromStore$: Observable<ProcessContent>;
    modelMetadata$: Observable<Process>;
    editorContentSubject$: Subject<ProcessContent> = new Subject<ProcessContent>();
    editorMetadataSubject$: Subject<Process> = new Subject<Process>();

    extensions$: Observable<string>;
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
    onDestroy$ = new Subject<boolean>();

    constructor(
        private store: Store<AmaState>,
        private codeValidatorService: CodeValidatorService,
        @Inject(ProcessModelerServiceToken) private processModeler: ProcessModelerService,
        private processLoaderService: ProcessDiagramLoaderService,
        private statusBarService: StatusBarService,
        private modelCommands: ProcessCommandsService,
        @Inject(PROCESS_MODEL_ENTITY_SELECTORS)
        private entitySelector: ModelEntitySelectors
    ) {}

    ngOnInit() {
        this.contentFromStore$ = this.store.select(this.entitySelector.selectModelDraftContentById(this.modelId)).pipe(
            filter(content => !!content),
            take(1)
        );
        const metadataFromStore$ = this.store.select(this.entitySelector.selectModelDraftMetadataById(this.modelId)).pipe(
            filter(metadata => !!metadata)
        );
        this.editorContent$ = concat(this.contentFromStore$, this.editorContentSubject$).pipe(shareReplay(1));
        this.modelMetadata$ = merge(metadataFromStore$, this.editorMetadataSubject$).pipe(
            shareReplay(1)
        );

        this.extensions$ = this.modelMetadata$.pipe(
            filter(process => !!process && !!process.extensions),
            map(process => JSON.stringify(process.extensions, undefined, 4).trim())
        );

        this.modelCommands.tabIndexChanged$.subscribe(
            (index: number) => {
                this.selectedTabIndex = index;
            }
        );

        this.modelId$ = of(this.modelId); // Refactor this to not be an observable
        this.modelCommands.init(PROCESS, ContentType.Process, this.modelId$, this.editorContent$, this.modelMetadata$);

        this.processFileUri = getFileUri(PROCESS, this.processesLanguageType, this.modelId);
        this.extensionFileUri = getFileUri(PROCESS, this.extensionsLanguageType, this.modelId);

        this.loading$ = this.store.select(selectProcessLoading);
        this.setVisibilityConditions();
        this.store.select(this.entitySelector.selectModelDraftStateExists(this.modelId)).pipe(takeUntil(this.onDestroy$)).subscribe(isDirty => {
            this.store.dispatch(new UpdateTabDirtyState(isDirty, this.modelId));
            if (isDirty) {
                this.modelCommands.updateIcon(BasicModelCommands.save, 'cloud_upload');
                this.modelCommands.setDisable(BasicModelCommands.save, false);
            } else {
                this.modelCommands.updateIcon(BasicModelCommands.save, 'cloud_done');
                this.modelCommands.setDisable(BasicModelCommands.save, true);
            }
        });
    }

    async onBpmnEditorChange(): Promise<void> {
        const modelContent = await this.processModeler.export();
        this.editorContentSubject$.next(modelContent);

        const element = this.processModeler.getRootProcessElement();
        const metadata = {
            ...this.metadataSnapshot,
            extensions: {
                ...this.extensionsSnapshot
            },
            name: modelNameHandler.get(element),
            description: documentationHandler.get(element),
            category: categoryHandler.get(element),
        };
        this.editorMetadataSubject$.next(metadata);
        this.store.dispatch(new DraftUpdateProcessContentAction({
            id: this.modelId,
            changes: metadata
        }, modelContent));
    }

    onXmlEditorChange(modelContent: ProcessContent): void {
        this.processLoaderService.load(modelContent)
            .subscribe(() => {
                this.store.dispatch(new SetAppDirtyStateAction(true));
            });
        this.editorContentSubject$.next(modelContent);
        const element = this.processModeler.getRootProcessElement();
        this.store.dispatch(new DraftUpdateProcessContentAction({
            id: this.modelId,
            changes: {
                ...this.metadataSnapshot,
                extensions: {
                    ...this.extensionsSnapshot
                },
                name: modelNameHandler.get(element),
                description: documentationHandler.get(element),
                category: categoryHandler.get(element),
            }
        }, modelContent));
    }

    onExtensionEditorChange(extensions: string): void {
        const validation = this.codeValidatorService.validateJson<ProcessExtensions>(extensions);
        this.updateDisabledStatusForButton(!validation.valid, [BasicModelCommands.save, BasicModelCommands.saveAs]);

        if (validation.valid) {
            this.store.dispatch(new UpdateProcessExtensionsAction({ extensions: JSON.parse(extensions), modelId: this.modelId }));
            this.store.dispatch(new SetAppDirtyStateAction(true));
        }
    }

    selectedTabChange(event: MatTabChangeEvent) {
        this.selectedTabIndex = event.index;
        this.statusBarService.setText(this.tabNames[this.selectedTabIndex]);
        this.store.dispatch(new ChangeProcessModelContextAction(this.modelContext[this.selectedTabIndex]));
        this.setVisibilityConditions();
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

    deleteDraftState() {
        this.store.dispatch(new DraftDeleteProcessAction(this.modelId));
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

    private isDiagramTabSelected(): boolean {
        return this.modelContext[this.selectedTabIndex] === ProcessModelContext.diagram;
    }

    private isXmlTabSelected(): boolean {
        return this.modelContext[this.selectedTabIndex] === ProcessModelContext.bpmn;
    }

    private isExtensionsTabSelected(): boolean {
        return this.modelContext[this.selectedTabIndex] === ProcessModelContext.extension;
    }

    private setVisibilityConditions() {
        this.modelCommands.setVisible(<BasicModelCommands> ProcessCommandsService.DOWNLOAD_PROCESS_SVG_IMAGE_COMMAND_BUTTON, this.isDiagramTabSelected());
        this.modelCommands.setIconVisible(<BasicModelCommands> ProcessCommandsService.DIAGRAM_MENU_ITEM, this.isDiagramTabSelected());
        this.modelCommands.setIconVisible(<BasicModelCommands> ProcessCommandsService.XML_MENU_ITEM, this.isXmlTabSelected());
        this.modelCommands.setIconVisible(<BasicModelCommands> ProcessCommandsService.EXTENSIONS_MENU_ITEM, this.isExtensionsTabSelected());
    }

    updateDisabledStatusForButton(status: boolean, buttons: BasicModelCommands[]) {
        buttons.forEach(button => this.modelCommands.setDisable(button, status));
    }

    ngOnDestroy() {
        this.modelCommands.destroy();
        this.onDestroy$.complete();
        this.modelCommands.destroy();
    }
}
