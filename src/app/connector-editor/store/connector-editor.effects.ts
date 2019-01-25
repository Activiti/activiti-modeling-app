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

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
    GetConnectorSuccessAction,
    UpdateConnectorContentAttemptAction,
    UPDATE_CONNECTOR_CONTENT_ATTEMPT,
    UpdateConnectorSuccessAction,
    UPDATE_CONNECTOR_SUCCESS,
    DELETE_CONNECTOR_ATTEMPT,
    DeleteConnectorAttemptAction,
    DeleteConnectorSuccessAction,
    DELETE_CONNECTOR_SUCCESS,
    CreateConnectorSuccessAction,
    GetConnectorsSuccessAction,
    GET_CONNECTORS_ATTEMPT,
    GetConnectorsAttemptAction,
    ShowConnectorsAction,
    SHOW_CONNECTORS,
    CREATE_CONNECTOR_ATTEMPT,
    CreateConnectorAttemptAction,
    UploadConnectorAttemptAction,
    UPLOAD_CONNECTOR_ATTEMPT,
    DownloadConnectorAction,
    DOWNLOAD_CONNECTOR,
    ValidateConnectorAttemptAction,
    VALIDATE_CONNECTOR_ATTEMPT,
    ValidateConnectorPayload,
    CREATE_CONNECTOR_SUCCESS
} from './connector-editor.actions';
import { map, switchMap, catchError, mergeMap, take, withLatestFrom } from 'rxjs/operators';
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
    SetAppDirtyStateAction
} from 'ama-sdk';
import { ConnectorEditorService } from '../services/connector-editor.service';
import { of, zip, forkJoin, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LogService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { AmaState, SnackbarErrorAction, SnackbarInfoAction } from 'ama-sdk';
import { CHANGE_CONNECTOR_CONTENT, ChangeConnectorContent } from './connector-editor.actions';
import { selectConnectorsLoaded, selectSelectedConnectorContent, selectSelectedConnector } from './connector-editor.selectors';
import { UploadFileAttemptPayload, changeFileName, ConnectorContent, Connector, selectSelectedProjectId, BaseEffects } from 'ama-sdk';

@Injectable()
export class ConnectorEditorEffects extends BaseEffects {
    constructor(
        private store: Store<AmaState>,
        private actions$: Actions,
        private connectorEditorService: ConnectorEditorService,
        logService: LogService,
        router: Router
    ) {
        super(router, logService);
    }

    @Effect()
    validateConnectorEffect = this.actions$.pipe(
        ofType<ValidateConnectorAttemptAction>(VALIDATE_CONNECTOR_ATTEMPT),
        mergeMap(action => this.validateConnector(action.payload))
    );

    @Effect()
    updateConnectorContentEffect = this.actions$.pipe(
        ofType<UpdateConnectorContentAttemptAction>(UPDATE_CONNECTOR_CONTENT_ATTEMPT),
        map(action => action.payload),
        withLatestFrom(this.store.select(selectSelectedConnector), this.store.select(selectSelectedProjectId)),
        mergeMap(([content, model, projectId]) => this.updateConnector(model, content, projectId))
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
        mergeMap(() => this.store.select(selectSelectedProjectId)),
        map(projectId => {
            this.router.navigate(['/projects', projectId]);
        })
    );

    @Effect({ dispatch: false })
    createConnectorSuccessEffect = this.actions$.pipe(
        ofType<CreateConnectorSuccessAction>(CREATE_CONNECTOR_SUCCESS),
        withLatestFrom(this.store.select(selectSelectedProjectId)),
        map(([action, projectId]) => {
            this.router.navigate(['/projects', projectId, 'connector', action.connector.id]);
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
        mergeMap(() => of(new SetAppDirtyStateAction(false)))
    );

    @Effect()
    createConnectorEffect = this.actions$.pipe(
        ofType<CreateConnectorAttemptAction>(CREATE_CONNECTOR_ATTEMPT),
        mergeMap(action => zip(of(action.payload), this.store.select(selectSelectedProjectId))),
        mergeMap(([form, projectId]) => {
            return this.createConnector(form, projectId);
        })
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
                return of();
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
        switchMap(() => this.downloadConnector())
    );

    private validateConnector({ connectorId, connectorContent, action }: ValidateConnectorPayload) {
        return this.connectorEditorService.validate(connectorId, connectorContent).pipe(
            switchMap(() => [ action ]),
            catchError(response => [ new OpenConfirmDialogAction({
                action,
                dialogData: {
                    title: 'APP.DIALOGS.CONFIRM.TITLE',
                    subtitle: 'APP.DIALOGS.ERROR.SUBTITLE',
                    errors: JSON.parse(response.message).errors.map(error => error.description)
                }
            })])
        );
    }

    private uploadConnector(payload: UploadFileAttemptPayload): Observable<void | {} | SnackbarInfoAction |CreateConnectorSuccessAction> {
        const file = changeFileName(payload.file, payload.file.name);
        return this.connectorEditorService.upload({ ...payload, file }).pipe(
            switchMap((connector: Connector) => [
                new CreateConnectorSuccessAction(connector),
                new SnackbarInfoAction('APP.PROJECT.UPLOAD_FILE_SUCCESS')
            ]),
            catchError(e =>
                this.genericErrorHandler(this.handleError.bind(this, 'APP.PROJECT.ERROR.UPLOAD_FILE'), e)
            )
        );
    }

    private getConnectors(projectId: string): Observable<{} | GetConnectorsSuccessAction> {
        return this.connectorEditorService.fetchAll(projectId).pipe(
            mergeMap(connectors => of(new GetConnectorsSuccessAction(connectors))),
            catchError(e =>
                this.genericErrorHandler(this.handleError.bind(this, 'APP.PROJECT.ERROR.LOAD_MODELS'), e)
            )
        );
    }

    private createConnector(form: Partial<EntityDialogForm>, projectId: string): Observable<{} | SnackbarInfoAction | CreateConnectorSuccessAction> {
        return this.connectorEditorService.create(form, projectId).pipe(
            mergeMap((connector) => [
                new CreateConnectorSuccessAction(connector),
                new SnackbarInfoAction('APP.PROJECT.CONNECTOR_DIALOG.CONNECTOR_CREATED')
            ]),
            catchError(e => this.genericErrorHandler(this.handleConnectorCreationError.bind(this), e))
        );
    }

    private deleteConnector(connectorId: string): Observable<{} | SnackbarInfoAction | UpdateConnectorSuccessAction> {
        return this.connectorEditorService.delete(connectorId).pipe(
            mergeMap(() => [
                new DeleteConnectorSuccessAction(connectorId),
                new ModelClosedAction({id: connectorId, type: CONNECTOR}),
                new SetAppDirtyStateAction(false),
                new SnackbarInfoAction('APP.PROJECT.CONNECTOR_DIALOG.CONNECTOR_DELETED')
            ]),
            catchError(e => this.genericErrorHandler(this.handleConnectorUpdatingError.bind(this), e))
        );
    }

    private updateConnector(connector: Connector, content: ConnectorContent, projectId: string): Observable<{} | SnackbarInfoAction | UpdateConnectorSuccessAction> {
        return this.connectorEditorService.update(connector.id, connector, content, projectId).pipe(
            mergeMap(() => [
                new UpdateConnectorSuccessAction({ id: connector.id, changes: content }),
                new SnackbarInfoAction('APP.PROJECT.CONNECTOR_DIALOG.CONNECTOR_UPDATED')
            ]),
            catchError(e => this.genericErrorHandler(this.handleConnectorUpdatingError.bind(this), e))
        );
    }

    private getConnector(connectorId: string, projectId: string, loadConnector?: boolean): Observable<GetConnectorSuccessAction | SnackbarErrorAction> {
        const connectorDetails$ = this.connectorEditorService.getDetails(connectorId, projectId),
            connectorContent$ = this.connectorEditorService.getContent(connectorId);

        return forkJoin(connectorDetails$, connectorContent$).pipe(
            switchMap(([connector, connectorContent]) => [
                new GetConnectorSuccessAction(connector, connectorContent),
                ...(loadConnector ? [new ModelOpenedAction({ id: connectorId, type: CONNECTOR })] : [])
            ]),
            catchError<any, SnackbarErrorAction>(e =>
                this.genericErrorHandler(this.handleError.bind(this, 'APP.CONNECTOR_EDITOR.ERRORS.GET_CONNECTOR'), e)
            )
        );
    }

    private handleConnectorUpdatingError(error): Observable<SnackbarErrorAction> {
        let errorMessage;

        if (error.status === 409) {
            errorMessage = 'APP.PROJECT.ERROR.UPDATE_CONNECTOR.DUPLICATION';
        } else {
            errorMessage = 'APP.PROJECT.ERROR.UPDATE_CONNECTOR.GENERAL';
        }

        return of(new SnackbarErrorAction(errorMessage));
    }

    private handleConnectorCreationError(error): Observable<SnackbarErrorAction> {
        let errorMessage;

        if (error.status === 409) {
            errorMessage = 'APP.PROJECT.ERROR.CREATE_CONNECTOR.DUPLICATION';
        } else {
            errorMessage = 'APP.PROJECT.ERROR.CREATE_CONNECTOR.GENERAL';
        }

        return of(new SnackbarErrorAction(errorMessage));
    }

    private handleError(userMessage): Observable<SnackbarErrorAction> {
        return of(new SnackbarErrorAction(userMessage));
    }

    private downloadConnector() {
       return this.store.select(selectSelectedConnectorContent).pipe(
           map(content => this.connectorEditorService.download(content.name, JSON.stringify(content))),
           take(1)
       );
    }
}
