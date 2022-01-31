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
import { map, filter, take, tap, switchMap, catchError, shareReplay } from 'rxjs/operators';
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
    ModelEntitySelectors
} from '@alfresco-dbp/modeling-shared/sdk';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ConnectorCommandsService } from '../../services/commands/connector-commands.service';

import {
    ChangeConnectorContent,
    UpdateConnectorContentAttemptAction} from '../../store/connector-editor.actions';
const memoize = require('lodash/memoize');

@Component({
    selector: 'ama-connector-editor-component',
    templateUrl: './connector-editor.component.html',
    styleUrls: ['./connector-editor.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        ConnectorCommandsService,
    ]
})

export class ConnectorEditorComponent implements OnInit, CanComponentDeactivate, OnDestroy {
    @Input()
    modelId: string;

    disableSave = false;

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
        'CONNECTOR_EDITOR.TABS.CONNECTOR_EDITOR',
        'CONNECTOR_EDITOR.TABS.JSON_EDITOR'
    ];
    selectedTabIndex = 0;

    constructor(
        private store: Store<AmaState>,
        private modelCommands: ConnectorCommandsService,
        private codeValidatorService: CodeValidatorService,
        private changeDetectorRef: ChangeDetectorRef,
        private componentRegister: ComponentRegisterService,
        private statusBarService: StatusBarService,
        @Inject(CONNECTOR_MODEL_ENTITY_SELECTORS)
        private entitySelector: ModelEntitySelectors,
    ) {}

    ngOnInit() {
        this.loadingState$ = this.store.select(selectConnectorLoadingState);
        this.modelId$ = of(this.modelId);
        const contentFromStore$ = this.store.select(this.entitySelector.selectModelContentById(this.modelId)).pipe(
            filter(content => !!content),
            take(1),
            map(content => JSON.stringify(content, undefined, 4).trim())
        );
        this.editorContent$ = concat(contentFromStore$, this.editorContentSubject$).pipe(shareReplay(1));

        this.boundOnChangeAttempt = this.onChangeAttempt.bind(this);
        this.getMemoizedDynamicComponentData = memoize((connectorContent, onChangeAttempt) => {
            return { connectorContent, onChangeAttempt };
        });

        this.fileUri = getFileUri(CONNECTOR, this.languageType, this.modelId);
        this.modelCommands.init(CONNECTOR, ContentType.Connector, this.modelId$, this.editorContent$);
    }

    onTabChange(event: MatTabChangeEvent): void {
        this.disableSave = false;
        this.selectedTabIndex = event.index;
        this.statusBarService.setText(this.tabNames[this.selectedTabIndex]);
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

    ngOnDestroy() {
        this.modelCommands.destroy();
    }
}
