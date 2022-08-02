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

/* eslint-disable max-lines */

import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, mergeMap, take, withLatestFrom, tap } from 'rxjs/operators';
import {
    EntityDialogForm,
    CONNECTOR,
    ModelClosedAction,
    OpenConfirmDialogAction,
    GetConnectorAttemptAction,
    GET_CONNECTOR_ATTEMPT,
    ModelOpenedAction,
    LOAD_CONNECTOR_ATTEMPT,
    LoadConnectorAttemptAction,
    SetAppDirtyStateAction,
    CreateConnectorSuccessAction,
    CREATE_CONNECTOR_SUCCESS,
    SetApplicationLoadingStateAction,
    LogFactoryService,
    AmaState,
    SnackbarErrorAction,
    SnackbarInfoAction,
    UploadFileAttemptPayload,
    changeFileName,
    Connector,
    selectSelectedProjectId,
    CreateConnectorAttemptAction,
    CREATE_CONNECTOR_ATTEMPT,
    ErrorResponse,
    SaveAsDialogPayload,
    SaveAsDialogComponent,
    ShowConnectorsAction,
    SHOW_CONNECTORS,
    ConnectorContent,
    CONNECTOR_MODEL_ENTITY_SELECTORS,
    ModelEntitySelectors,
    UpdateTabTitle,
    SetLogHistoryVisibilityAction,
    TabManagerService
} from '@alfresco-dbp/modeling-shared/sdk';
import { DialogService } from '@alfresco-dbp/adf-candidates/core/dialog';
import { ConnectorEditorService } from '../services/connector-editor.service';
import { of, zip, forkJoin, Observable, EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectConnectorsLoaded } from './connector-editor.selectors';
import {
    ValidateConnectorAttemptAction,
    VALIDATE_CONNECTOR_ATTEMPT,
    UpdateConnectorContentAttemptAction,
    UPDATE_CONNECTOR_CONTENT_ATTEMPT,
    DeleteConnectorAttemptAction,
    DELETE_CONNECTOR_ATTEMPT,
    DeleteConnectorSuccessAction,
    DELETE_CONNECTOR_SUCCESS,
    ChangeConnectorContent,
    CHANGE_CONNECTOR_CONTENT,
    UpdateConnectorSuccessAction,
    UPDATE_CONNECTOR_SUCCESS,
    UpdateConnectorFailedAction,
    UPDATE_CONNECTOR_FAILED,
    GetConnectorsAttemptAction,
    GET_CONNECTORS_ATTEMPT,
    UploadConnectorAttemptAction,
    UPLOAD_CONNECTOR_ATTEMPT,
    DownloadConnectorAction,
    DOWNLOAD_CONNECTOR,
    OpenSaveAsConnectorAction,
    OPEN_CONNECTOR_SAVE_AS_FORM,
    SaveAsConnectorAttemptAction,
    SAVE_AS_CONNECTOR_ATTEMPT,
    ValidateConnectorPayload,
    GetConnectorsSuccessAction,
    GetConnectorSuccessAction,
    ValidateConnectorSuccessAction,
    VALIDATE_CONNECTOR_SUCCESS,
    DraftDeleteConnectorAction} from './connector-editor.actions';
import { getConnectorLogInitiator } from '../services/connector-editor.constants';
import { TranslationService } from '@alfresco/adf-core';

@Injectable()
export class ConnectorEditorEffects {
    constructor(
        private store: Store<AmaState>,
        private actions$: Actions,
        private dialogService: DialogService,
        private connectorEditorService: ConnectorEditorService,
        private logFactory: LogFactoryService,
        private router: Router,
        private translationService: TranslationService,
        @Inject(CONNECTOR_MODEL_ENTITY_SELECTORS)
        private entitySelector: ModelEntitySelectors,
        private tabManagerService: TabManagerService
    ) {}

    @Effect()
    validateConnectorEffect = this.actions$.pipe(
        ofType<ValidateConnectorAttemptAction>(VALIDATE_CONNECTOR_ATTEMPT),
        withLatestFrom(this.store.select(selectSelectedProjectId)),
        mergeMap(([action, projectId]) => this.validateConnector({...action.payload, projectId}))
    );

    @Effect()
    validateConnectorSuccessEffect = this.actions$.pipe(
        ofType<ValidateConnectorSuccessAction>(VALIDATE_CONNECTOR_SUCCESS),
        mergeMap((action) => action.payload)
    );

    @Effect()
    updateConnectorContentEffect = this.actions$.pipe(
        ofType<UpdateConnectorContentAttemptAction>(UPDATE_CONNECTOR_CONTENT_ATTEMPT),
        map(action => action.payload),
        mergeMap((payload) => zip(of(payload), this.store.select(this.entitySelector.selectModelMetadataById(payload.modelId)), this.store.select(selectSelectedProjectId))),
        mergeMap(([payload, connector, projectId]) => this.updateConnector(connector, payload.modelContent, projectId))
    );

    @Effect()
    deleteConnectorAttemptEffect = this.actions$.pipe(
        ofType<DeleteConnectorAttemptAction>(DELETE_CONNECTOR_ATTEMPT),
        map(action => action.connectorId),
        mergeMap(connectorId => this.deleteConnector(connectorId))
    );

    @Effect({ dispatch: false })
    deleteConnectorSuccessEffect = this.actions$.pipe(
        ofType<DeleteConnectorSuccessAction>(DELETE_CONNECTOR_SUCCESS),
        withLatestFrom(this.store.select(selectSelectedProjectId)),
        map(([deletedSuccessAction, projectId]) => {
            if (!this.tabManagerService.isTabListEmpty()) {
                this.tabManagerService.removeTabByModelId(deletedSuccessAction.connectorId);
            } else {
                void this.router.navigate(['/projects', projectId]);
            }
        })
    );

    @Effect({ dispatch: false })
    createConnectorSuccessEffect = this.actions$.pipe(
        ofType<CreateConnectorSuccessAction>(CREATE_CONNECTOR_SUCCESS),
        withLatestFrom(this.store.select(selectSelectedProjectId)),
        tap(([action, projectId]) => {
            if (action.navigateTo) {
                void this.router.navigate(['/projects', projectId, 'connector', action.connector.id]);
            }
        })
    );

    @Effect()
    getConnectorEffect = this.actions$.pipe(
        ofType<GetConnectorAttemptAction>(GET_CONNECTOR_ATTEMPT),
        mergeMap(action => zip(of(action.connectorId), this.store.select(selectSelectedProjectId))),
        switchMap(([connectorId, projectId]) => this.getConnector(connectorId, projectId))
    );

    @Effect()
    loadConnectorEffect = this.actions$.pipe(
        ofType<LoadConnectorAttemptAction>(LOAD_CONNECTOR_ATTEMPT),
        mergeMap(action => zip(of(action.connectorId), this.store.select(selectSelectedProjectId))),
        switchMap(([connectorId, projectId]) => this.getConnector(connectorId, projectId, true))
    );

    @Effect()
    changeConnectorContentEffect = this.actions$.pipe(
        ofType<ChangeConnectorContent>(CHANGE_CONNECTOR_CONTENT),
        mergeMap(() => of(new SetAppDirtyStateAction(true)))
    );

    @Effect()
    updateConnectorSuccessEffect = this.actions$.pipe(
        ofType<UpdateConnectorSuccessAction>(UPDATE_CONNECTOR_SUCCESS),
        mergeMap((action) => [
            new UpdateTabTitle(action.connector.changes.name, action.connector.id),
            new SetApplicationLoadingStateAction(false),
            new SetAppDirtyStateAction(false)
        ])
    );

    @Effect()
    updateConnectorFailedEffect = this.actions$.pipe(
        ofType<UpdateConnectorFailedAction>(UPDATE_CONNECTOR_FAILED),
        mergeMap(() => of(new SetApplicationLoadingStateAction(false)))
    );

    @Effect()
    createConnectorEffect = this.actions$.pipe(
        ofType<CreateConnectorAttemptAction>(CREATE_CONNECTOR_ATTEMPT),
        mergeMap(action => zip(of(action), this.store.select(selectSelectedProjectId))),
        mergeMap(([action, projectId]) => this.createConnector(action.payload, action.navigateTo, projectId, action.callback))
    );

    @Effect()
    showConnectorsEffect = this.actions$.pipe(
        ofType<ShowConnectorsAction>(SHOW_CONNECTORS),
        map(action => action.projectId),
        mergeMap(projectId => zip(of(projectId), this.store.select(selectConnectorsLoaded))),
        mergeMap(([projectId, loaded]) => {
            if (!loaded) {
                return of(new GetConnectorsAttemptAction(projectId));
            } else {
                return EMPTY;
            }
        })
    );

    @Effect()
    getConnectorsEffect = this.actions$.pipe(
        ofType<GetConnectorsAttemptAction>(GET_CONNECTORS_ATTEMPT),
        mergeMap(action => this.getConnectors(action.projectId))
    );

    @Effect()
    uploadConnectorEffect = this.actions$.pipe(
        ofType<UploadConnectorAttemptAction>(UPLOAD_CONNECTOR_ATTEMPT),
        switchMap(action => this.uploadConnector(action.payload))
    );

    @Effect({ dispatch: false })
    downloadConnectorEffect = this.actions$.pipe(
        ofType<DownloadConnectorAction>(DOWNLOAD_CONNECTOR),
        switchMap((action) => this.downloadConnector(action.modelId))
    );

    @Effect({ dispatch: false })
    openSaveAsConnectorEffect = this.actions$.pipe(
        ofType<OpenSaveAsConnectorAction>(OPEN_CONNECTOR_SAVE_AS_FORM),
        tap((action) => this.openSaveAsConnectorDialog(action.dialogData))
    );

    @Effect()
    saveAsConnectorEffect = this.actions$.pipe(
        ofType<SaveAsConnectorAttemptAction>(SAVE_AS_CONNECTOR_ATTEMPT),
        mergeMap(action => zip(of(action), this.store.select(selectSelectedProjectId))),
        mergeMap(([action, projectId]) => this.saveAsConnector(action.payload, action.navigateTo, projectId))
    );

    private validateConnector({ modelId, modelContent, action, title, errorAction, projectId }: ValidateConnectorPayload) {
        return this.connectorEditorService.validate(modelId, modelContent, projectId).pipe(
            switchMap(() => [new SetApplicationLoadingStateAction(true), action, new SetApplicationLoadingStateAction(false)]),
            catchError(response => {
                const errors = JSON.parse(response.message).errors.map(error => error.description);
                if (errorAction) {
                    return [
                        errorAction,
                        this.logFactory.logError(getConnectorLogInitiator(), errors),
                        new SetLogHistoryVisibilityAction(true)
                    ];
                }
                return [
                    new OpenConfirmDialogAction({
                        action,
                        dialogData: {
                            title: title || 'APP.DIALOGS.CONFIRM.TITLE',
                            subtitle: 'APP.DIALOGS.ERROR.SUBTITLE',
                            messages: errors
                        }
                    }),
                    this.logFactory.logError(getConnectorLogInitiator(), errors)
                ];
            })
        );
    }

    private uploadConnector(payload: UploadFileAttemptPayload): Observable<void | any | SnackbarInfoAction |CreateConnectorSuccessAction> {
        const file = changeFileName(payload.file, payload.file.name);
        return this.connectorEditorService.upload({ ...payload, file }).pipe(
            switchMap((connector: Connector) => [
                new CreateConnectorSuccessAction(connector, true),
                new SnackbarInfoAction('ADV_CONNECTOR_EDITOR.UPLOAD_SUCCESS')
            ]),
            catchError(error => {
                if (error.status === 409) {
                    const message = this.translationService.instant('PROJECT_EDITOR.ERROR.UPLOAD_DUPLICATE_FILE',
                        { modelType: this.translationService.instant('PROJECT_EDITOR.NEW_MENU.MENU_ITEMS.CREATE_CONNECTOR') });
                    return this.handleError(message);
                }
                return this.handleError('PROJECT_EDITOR.ERROR.UPLOAD_FILE');
            })
        );
    }

    private getConnectors(projectId: string): Observable<any | GetConnectorsSuccessAction> {
        return this.connectorEditorService.fetchAll(projectId).pipe(
            mergeMap(connectors => of(new GetConnectorsSuccessAction(connectors))),
            catchError(() => this.handleError('PROJECT_EDITOR.ERROR.LOAD_MODELS')));
    }

    private createConnector(form: Partial<EntityDialogForm>, navigateTo: boolean,
                            projectId: string, callback: (param: Connector) => any): Observable<any | SnackbarInfoAction | CreateConnectorSuccessAction> {
        return this.connectorEditorService.create(form, projectId).pipe(
            tap((connector) => callback && callback(connector)),
            mergeMap((connector) => [
                new CreateConnectorSuccessAction(connector, navigateTo),
                new SnackbarInfoAction('PROJECT_EDITOR.CONNECTOR_DIALOG.CONNECTOR_CREATED')
            ]),
            catchError(e => this.handleConnectorCreationError(e)));
    }

    private deleteConnector(connectorId: string): Observable<any | SnackbarInfoAction | UpdateConnectorSuccessAction> {
        return this.connectorEditorService.delete(connectorId).pipe(
            mergeMap(() => [
                new DeleteConnectorSuccessAction(connectorId),
                new ModelClosedAction({id: connectorId, type: CONNECTOR}),
                new SetAppDirtyStateAction(false),
                new SnackbarInfoAction('PROJECT_EDITOR.CONNECTOR_DIALOG.CONNECTOR_DELETED')
            ]),
            catchError(e => this.handleConnectorUpdatingError(e)));
    }

    private updateConnector(connector: Connector, content: ConnectorContent, projectId: string): Observable<any | SnackbarInfoAction | UpdateConnectorSuccessAction> {
        return this.connectorEditorService.update(connector.id, connector, content, projectId).pipe(
            switchMap(() => [
                new SetApplicationLoadingStateAction(true),
                new DraftDeleteConnectorAction(connector.id),
                new UpdateConnectorSuccessAction({ id: connector.id, changes: content }),
                this.logFactory.logInfo(getConnectorLogInitiator(), 'PROJECT_EDITOR.CONNECTOR_DIALOG.CONNECTOR_UPDATED'),
                new SnackbarInfoAction('PROJECT_EDITOR.CONNECTOR_DIALOG.CONNECTOR_UPDATED')
            ]),
            catchError(e => this.handleConnectorUpdatingError(e)));
    }

    private getConnector(connectorId: string, projectId: string, loadConnector?: boolean) {
        const connectorDetails$ = this.connectorEditorService.getDetails(connectorId, projectId),
            connectorContent$ = this.connectorEditorService.getContent(connectorId);

        return forkJoin(connectorDetails$, connectorContent$).pipe(
            switchMap(([connector, connectorContent]) => [
                new GetConnectorSuccessAction(connector, connectorContent),
                ...(loadConnector ? [new ModelOpenedAction({ id: connectorId, type: CONNECTOR })] : [])
            ]),
            catchError(() => this.handleError('ADV_CONNECTOR_EDITOR.ERRORS.GET_CONNECTOR')));
    }

    private handleConnectorUpdatingError(error: ErrorResponse): Observable<SnackbarErrorAction | any> {
        let errorMessage;

        if (error.status === 409) {
            errorMessage = 'PROJECT_EDITOR.ERROR.UPDATE_CONNECTOR.DUPLICATION';
        } else {
            errorMessage = 'PROJECT_EDITOR.ERROR.UPDATE_CONNECTOR.GENERAL';
        }

        return of(new SnackbarErrorAction(errorMessage), new UpdateConnectorFailedAction());
    }

    private handleConnectorCreationError(error: ErrorResponse): Observable<SnackbarErrorAction> {
        let errorMessage;

        if (error.status === 409) {
            errorMessage = 'PROJECT_EDITOR.ERROR.CREATE_CONNECTOR.DUPLICATION';
        } else {
            errorMessage = 'PROJECT_EDITOR.ERROR.CREATE_CONNECTOR.GENERAL';
        }

        return of(new SnackbarErrorAction(errorMessage));
    }

    private handleError(userMessage): Observable<SnackbarErrorAction> {
        return of(new SnackbarErrorAction(userMessage));
    }

    private downloadConnector(modelId: string) {
        return this.store.select(this.entitySelector.selectModelContentById(modelId)).pipe(
            map(content => this.connectorEditorService.download(content.name, JSON.stringify(content))),
            map(() => new SetApplicationLoadingStateAction(false)),
            take(1)
        );
    }

    private openSaveAsConnectorDialog(data: SaveAsDialogPayload) {
        this.dialogService.openDialog(SaveAsDialogComponent, { data });
    }

    private saveAsConnector(
        connectorData: Partial<SaveAsDialogPayload>,
        navigateTo: boolean,
        projectId: string): Observable<any | SnackbarInfoAction | CreateConnectorSuccessAction> {
        return this.connectorEditorService.create(connectorData, projectId).pipe(
            tap(() => this.updateContentOnSaveAs(connectorData)),
            mergeMap((connector) => this.connectorEditorService.update(connector.id, connector, connectorData.sourceModelContent, projectId)),
            mergeMap((connector) => [
                new CreateConnectorSuccessAction(connector, navigateTo),
                new SnackbarInfoAction('PROJECT_EDITOR.CONNECTOR_DIALOG.CONNECTOR_CREATED')
            ]),
            catchError(e => this.handleConnectorCreationError(e)));
    }

    private updateContentOnSaveAs(data: Partial<SaveAsDialogPayload>): void {
        data.sourceModelContent.name = data.name;
        data.sourceModelContent.description = data.description;
    }

}
