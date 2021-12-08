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

import { Component, ChangeDetectorRef, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ComponentRegisterService } from '@alfresco/adf-extensions';
import { Store } from '@ngrx/store';
import { selectSelectedConnectorContent, selectConnectorLoadingState, selectSelectedConnectorId, selectConnectorEditorSaving } from '../../store/connector-editor.selectors';
import { map, filter, take, tap, switchMap, catchError, takeUntil } from 'rxjs/operators';
import { Observable, of, Subject, zip } from 'rxjs';
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
    StatusBarService
} from '@alfresco-dbp/modeling-shared/sdk';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {
    ChangeConnectorContent,
    UpdateConnectorContentAttemptAction,
    ValidateConnectorAttemptAction
} from '../../store/connector-editor.actions';
import { ActivatedRoute } from '@angular/router';
const memoize = require('lodash/memoize');

@Component({
    templateUrl: './connector-editor.component.html',
    styleUrls: ['./connector-editor.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ConnectorEditorComponent implements CanComponentDeactivate, OnDestroy {
    disableSave = false;

    connectorId$: Observable<string>;
    editorContent$: Observable<string>;
    loadingState$: Observable<boolean>;
    componentKey = AdvancedConnectorEditorKey;

    boundOnChangeAttempt: any;
    getMemoizedDynamicComponentData: any;
    fileUri$: Observable<string>;
    languageType: string;
    tabNames = [
        'CONNECTOR_EDITOR.TABS.CONNECTOR_EDITOR',
        'CONNECTOR_EDITOR.TABS.JSON_EDITOR'
    ];
    selectedTabIndex = 0;
    private unsubscribe$ = new Subject<void>();

    constructor(
        private store: Store<AmaState>,
        private route: ActivatedRoute,
        private codeValidatorService: CodeValidatorService,
        private changeDetectorRef: ChangeDetectorRef,
        private componentRegister: ComponentRegisterService,
        private statusBarService: StatusBarService
    ) {
        this.route.params.pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => {
                this.initialLoad_QuickFix_RenameToConstructor();
            });
    }

    initialLoad_QuickFix_RenameToConstructor() {
        this.loadingState$ = this.store.select(selectConnectorLoadingState);
        this.connectorId$ = this.store.select(selectSelectedConnectorId);
        this.editorContent$ = this.store.select(selectSelectedConnectorContent).pipe(
            filter(content => !!content),
            map(content => JSON.stringify(content, undefined, 4).trim())
        );

        this.boundOnChangeAttempt = this.onChangeAttempt.bind(this);
        this.getMemoizedDynamicComponentData = memoize((connectorContent, onChangeAttempt) => {
            return { connectorContent, onChangeAttempt };
        });

        this.languageType = 'json';
        this.fileUri$ = this.connectorId$.pipe(
            map(id => getFileUri(CONNECTOR, this.languageType, id))
        );
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
            this.editorContent$ = of(connectorContentString);
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
        return new UpdateConnectorContentAttemptAction(JSON.parse(content));
    }

    onSave() {
        zip(this.editorContent$, this.connectorId$)
            .pipe(take(1)).subscribe(([content, connectorId]) => {
                this.store.dispatch(new ValidateConnectorAttemptAction({
                    title: 'APP.DIALOGS.CONFIRM.SAVE.CONNECTOR',
                    connectorId: connectorId,
                    connectorContent: JSON.parse(content),
                    action: this.saveAction(content)
                }));
        });
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
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
