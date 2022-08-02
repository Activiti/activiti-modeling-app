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

import { Component, ChangeDetectorRef, ViewEncapsulation, OnDestroy, OnInit, Input, Inject } from '@angular/core';
import { ComponentRegisterService } from '@alfresco/adf-extensions';
import { Store } from '@ngrx/store';
import { selectConnectorLoadingState, selectConnectorEditorSaving } from '../../store/connector-editor.selectors';
import { map, filter, take, tap, switchMap, catchError, shareReplay, takeUntil } from 'rxjs/operators';
import { Observable, of, concat, Subject } from 'rxjs';
import {
    AmaState,
    ConnectorContent,
    CodeValidatorService,
    ValidationResponse,
    AdvancedConnectorEditorData,
    AdvancedConnectorEditorKey,
    CONNECTOR,
    getFileUri,
    CodeEditorPosition,
    ModelEditorState,
    CanComponentDeactivate,
    StatusBarService,
    ContentType,
    CONNECTOR_MODEL_ENTITY_SELECTORS,
    ModelEntitySelectors,
    MODEL_COMMAND_SERVICE_TOKEN,
    BasicModelCommands,
    UpdateTabDirtyState
} from '@alfresco-dbp/modeling-shared/sdk';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ConnectorCommandsService } from '../../services/commands/connector-commands.service';
import { ChangeConnectorContent, DraftDeleteConnectorAction, DraftUpdateConnectorContentAction, UpdateConnectorContentAttemptAction} from '../../store/connector-editor.actions';
const memoize = require('lodash/memoize');

@Component({
    selector: 'ama-connector-editor-component',
    templateUrl: './connector-editor.component.html',
    styleUrls: ['./connector-editor.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        ConnectorCommandsService,
        {
            provide: MODEL_COMMAND_SERVICE_TOKEN,
            useExisting: ConnectorCommandsService
        }
    ]
})

export class ConnectorEditorComponent implements OnInit, CanComponentDeactivate, OnDestroy {
    @Input()
    modelId: string;

    disableSave = false;
    readonly modelType = CONNECTOR;
    modelId$: Observable<string>;
    editorContent$: Observable<string>;
    editorContentSubject$: Subject<string> = new Subject<string>();
    loadingState$: Observable<boolean>;
    componentKey = AdvancedConnectorEditorKey;

    boundOnChangeAttempt: any;
    getMemoizedDynamicComponentData: any;
    fileUri: string;
    languageType = 'json';
    tabNames = [
        'ADV_CONNECTOR_EDITOR.TABS.CONNECTOR_EDITOR',
        'ADV_CONNECTOR_EDITOR.TABS.JSON_EDITOR'
    ];
    selectedTabIndex = 0;
    onDestroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private store: Store<AmaState>,
        private modelCommands: ConnectorCommandsService,
        private codeValidatorService: CodeValidatorService,
        private changeDetectorRef: ChangeDetectorRef,
        private componentRegister: ComponentRegisterService,
        private statusBarService: StatusBarService,
        @Inject(CONNECTOR_MODEL_ENTITY_SELECTORS)
        private entitySelector: ModelEntitySelectors
    ) {}

    ngOnInit() {
        this.loadingState$ = this.store.select(selectConnectorLoadingState);
        this.modelId$ = of(this.modelId);
        const contentFromStore$ = this.store.select(this.entitySelector.selectModelDraftContentById(this.modelId)).pipe(
            filter(content => !!content),
            take(1),
            map(content => JSON.stringify(content, undefined, 4).trim())
        );
        this.editorContent$ = concat(contentFromStore$, this.editorContentSubject$).pipe(shareReplay(1));

        this.boundOnChangeAttempt = this.onChangeAttempt.bind(this);
        this.getMemoizedDynamicComponentData = memoize((connectorContent, onChangeAttempt) => ({ connectorContent, onChangeAttempt }));

        this.modelCommands.tabIndexChanged$.subscribe(
            (index: number) => {
                this.selectedTabIndex = index;
            }
        );

        this.fileUri = getFileUri(CONNECTOR, this.languageType, this.modelId);
        this.modelCommands.init(CONNECTOR, ContentType.Connector, this.modelId$, this.editorContent$);
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

    onTabChange(event: MatTabChangeEvent): void {
        this.disableSave = false;
        this.selectedTabIndex = event.index;
        this.statusBarService.setText(this.tabNames[this.selectedTabIndex]);
        this.setVisibilityConditions();
    }

    isAdvancedEditorEmbedded(): boolean {
        return this.componentRegister.hasComponentById(this.componentKey);
    }

    getDynamicComponentData(editorContent: string): AdvancedConnectorEditorData {
        return this.getMemoizedDynamicComponentData(editorContent, this.boundOnChangeAttempt);
    }

    onChangeAttempt(connectorContentString: string): void {
        this.disableSave = !this.validate(connectorContentString).valid;

        if (!this.disableSave) {
            this.editorContentSubject$.next(connectorContentString);
            this.store.dispatch(new ChangeConnectorContent());
            this.store.dispatch(new DraftUpdateConnectorContentAction({id: this.modelId, changes: JSON.parse(connectorContentString)}));
        }

        this.changeDetectorRef.detectChanges();
    }

    private validate(connectorContentString: string): ValidationResponse<ConnectorContent> {
        return this.codeValidatorService.validateJson<ConnectorContent>(connectorContentString);
    }

    codeEditorPositionChanged(position: CodeEditorPosition) {
        if (!this.isAdvancedEditorEmbedded() || this.selectedTabIndex > 0 ) {
            this.statusBarService.setText(`Ln ${position.lineNumber}, Col ${position.column}`);
        }
    }

    private saveAction(content): UpdateConnectorContentAttemptAction {
        return new UpdateConnectorContentAttemptAction({ modelId: this.modelId, modelContent: JSON.parse(content)});
    }

    canDeactivate(): Observable<boolean> {
        return this.editorContent$.pipe(
            take(1),
            tap((content) => this.store.dispatch(this.saveAction(content))),
            switchMap(() => this.store.select(selectConnectorEditorSaving)),
            filter(updateState => (updateState === ModelEditorState.SAVED) || (updateState === ModelEditorState.FAILED)),
            take(1),
            map(state => state === ModelEditorState.SAVED),
            catchError(() => of(false))
        );
    }

    deleteDraftState() {
        this.store.dispatch(new DraftDeleteConnectorAction(this.modelId));
    }

    private setVisibilityConditions() {
        this.modelCommands.setIconVisible(<BasicModelCommands> ConnectorCommandsService.CONNECTOR_EDITOR_MENU_ITEM, this.selectedTabIndex === 0);
        this.modelCommands.setIconVisible(<BasicModelCommands> ConnectorCommandsService.JSON_EDITOR_MENU_ITEM, this.selectedTabIndex === 1);
    }

    ngOnDestroy() {
        this.modelCommands.destroy();
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
