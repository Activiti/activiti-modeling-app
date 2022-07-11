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

import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { ConnectorEditorEffects } from './connector-editor.effects';
import { Store } from '@ngrx/store';
import { ConnectorEditorService } from '../services/connector-editor.service';
import { LogService, StorageService, CoreModule, TranslationService, TranslationMock } from '@alfresco/adf-core';
import { Router } from '@angular/router';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import {
    UpdateConnectorContentAttemptAction,
    UpdateConnectorSuccessAction,
    GetConnectorSuccessAction,
    DeleteConnectorAttemptAction,
    DeleteConnectorSuccessAction,
    DELETE_CONNECTOR_SUCCESS,
    ChangeConnectorContent,
    GET_CONNECTORS_ATTEMPT,
    GetConnectorsAttemptAction,
    GetConnectorsSuccessAction,
    UploadConnectorAttemptAction,
    ValidateConnectorPayload,
    ValidateConnectorAttemptAction,
    UpdateConnectorFailedAction,
    SaveAsConnectorAttemptAction,
    OpenSaveAsConnectorAction,
    DraftDeleteConnectorAction} from './connector-editor.actions';
import { hot, cold, getTestScheduler } from 'jasmine-marbles';
import {
    EntityDialogForm,
    SetAppDirtyStateAction,
    selectSelectedProjectId,
    AmaApi,
    SnackbarErrorAction,
    SnackbarInfoAction,
    AmaState,
    UploadFileAttemptPayload,
    ConnectorContent,
    CONNECTOR,
    Connector,
    ModelClosedAction,
    OpenConfirmDialogAction,
    GetConnectorAttemptAction,
    CreateConnectorSuccessAction,
    LogFactoryService,
    CreateConnectorAttemptAction,
    SetApplicationLoadingStateAction,
    ModelScope,
    SaveAsDialogPayload,
    ShowConnectorsAction,
    CONNECTOR_MODEL_ENTITY_SELECTORS,
    UpdateTabTitle,
    TabManagerService,
    TabManagerEntityService
} from '@alfresco-dbp/modeling-shared/sdk';
import { DialogService } from '@alfresco-dbp/adf-candidates/core/dialog';
import { Update } from '@ngrx/entity';
import { selectConnectorsLoaded } from './connector-editor.selectors';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { getConnectorLogInitiator } from '../services/connector-editor.constants';

describe('ConnectorEditorEffects', () => {
    let actions$: Observable<any>;
    let effects: ConnectorEditorEffects;
    let router: Router;
    let metadata: EffectsMetadata<ConnectorEditorEffects>;
    let connectorEditorService: ConnectorEditorService;
    let store: Store<AmaState>;
    let logFactory: LogFactoryService;
    let dialogService: DialogService;
    const mockSelector = {};

    const connector: Connector = {
        type: CONNECTOR,
        id: 'mock-id',
        name: 'mock-name',
        creationDate: new Date(),
        createdBy: '',
        lastModifiedDate: new Date(),
        lastModifiedBy: '',
        description: 'mock-description',
        projectIds: ['mock-app-id'],
        version: '1.1.1',
        scope: ModelScope.GLOBAL
    };

    const connectorContent: ConnectorContent = {
        name: 'mock-name',
        description: ''
    };

    const mockDialog = {
        close: jest.fn()
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                MatDialogModule,
                CoreModule.forChild(),
                TranslateModule.forRoot()],
            providers: [
                ConnectorEditorEffects,
                AmaApi,
                DialogService,
                StorageService,
                {
                    provide: TranslationService,
                    useClass: TranslationMock
                },
                { provide: MatDialogRef, useValue: mockDialog },
                provideMockActions(() => actions$),
                {
                    provide: LogService,
                    useValue: { error: jest.fn() }
                },
                {
                    provide: Router,
                    useValue: { navigate: jest.fn() }
                },
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation(selector => {
                            if (selector === selectConnectorsLoaded) {
                                return of(false);
                            }

                            if (selector === selectSelectedProjectId) {
                                return of(connector.projectIds[0]);
                            }

                            if (selector === mockSelector) {
                                return of(connector);
                            }

                            return of({});
                        })
                    }
                },
                {
                    provide: ConnectorEditorService,
                    useValue: {
                        update: jest.fn().mockReturnValue(of(connector)),
                        delete: jest.fn().mockReturnValue(of(connector.id)),
                        getDetails: jest.fn(),
                        getContent: jest.fn(),
                        create: jest.fn().mockReturnValue(of(connector)),
                        upload: jest.fn().mockReturnValue(of(connector)),
                        fetchAll: jest.fn().mockReturnValue(of([connector])),
                        validate: jest.fn().mockReturnValue(of([connector]))
                    }
                },
                {
                    provide: CONNECTOR_MODEL_ENTITY_SELECTORS,
                    useValue: {
                        selectModelMetadataById: jest.fn().mockReturnValue(mockSelector)
                    }
                },
                {
                    provide: TabManagerEntityService, useValue: {
                        entities$: of([])
                    }
                },
                TabManagerService
            ]
        });

        logFactory = TestBed.inject(LogFactoryService);
        effects = TestBed.inject(ConnectorEditorEffects);
        connectorEditorService = TestBed.inject(ConnectorEditorService);
        router = TestBed.inject(Router);
        metadata = getEffectsMetadata(effects);
        store = TestBed.inject(Store);
        actions$ = null;
        dialogService = TestBed.inject(DialogService);
    });

    describe('uploadConnectorEffect', () => {
        it('uploadConnectorEffect should dispatch an action', () => {
            expect(metadata.uploadConnectorEffect.dispatch).toBeTruthy();
        });

        it('uploadConnectorEffect should dispatch the CreateConnectorSuccessAction', () => {
            actions$ = hot('a', { a: new UploadConnectorAttemptAction(<UploadFileAttemptPayload>{ file: new File([''], 'filename') }) });
            const expected = cold('(bc)', {
                b: new CreateConnectorSuccessAction(connector, true),
                c: new SnackbarInfoAction('ADV_CONNECTOR_EDITOR.UPLOAD_SUCCESS'),
            });

            expect(effects.uploadConnectorEffect).toBeObservable(expected);
        });
    });

    describe('UpdateConnectorContent Effect', () => {
        let updateConnector: jest.Mock;

        beforeEach(() => {
            updateConnector = <jest.Mock>connectorEditorService.update;
        });

        it('updateConnectorContentEffect should dispatch an action', () => {
            expect(metadata.updateConnectorContentEffect.dispatch).toBeTruthy();
        });

        it('updateConnectorContentEffect should dispatch the UpdateConnectorSuccessAction and SnackbarInfoAction actions', () => {
            const mockPayload = {modelId: 'mock-id', modelContent: <ConnectorContent>{ name: 'mock-name', description: 'mock-desc' }};
            updateConnector.mockReturnValue(of(connector));

            actions$ = hot('a', { a: new UpdateConnectorContentAttemptAction(mockPayload) });
            const expectedLogAction = logFactory.logInfo(getConnectorLogInitiator(), 'PROJECT_EDITOR.CONNECTOR_DIALOG.CONNECTOR_UPDATED');
            expectedLogAction.log.datetime = (<any>expect).any(Date);
            const expected = cold('(bcdef)', {
                b: new SetApplicationLoadingStateAction(true),
                c: new DraftDeleteConnectorAction(connector.id),
                d: new UpdateConnectorSuccessAction({ id: connector.id, changes: mockPayload.modelContent }),
                e: expectedLogAction,
                f: new SnackbarInfoAction('PROJECT_EDITOR.CONNECTOR_DIALOG.CONNECTOR_UPDATED')
            });

            expect(effects.updateConnectorContentEffect).toBeObservable(expected);
        });

        it('should dispatch the SnackbarErrorAction with duplication error on 409 status error', () => {
            const mockPayload = {modelId: 'mock-id', modelContent: <ConnectorContent>{ name: 'mock-name', description: 'mock-desc' }};
            const error: any = new Error();
            error.status = 409;
            updateConnector.mockReturnValue(throwError(error));

            actions$ = hot('a', { a: new UpdateConnectorContentAttemptAction(mockPayload) });
            const expected = cold('(bc)', {
                b: new SnackbarErrorAction('PROJECT_EDITOR.ERROR.UPDATE_CONNECTOR.DUPLICATION'),
                c: new UpdateConnectorFailedAction()
            });

            expect(effects.updateConnectorContentEffect).toBeObservable(expected);
        });

        it('should dispatch the SnackbarErrorAction with general error on every other error', () => {
            const mockPayload = {modelId: 'mock-id', modelContent: <ConnectorContent>{ name: 'mock-name', description: 'mock-desc' }};
            const error: any = new Error();
            updateConnector.mockReturnValue(throwError(error));

            actions$ = hot('a', { a: new UpdateConnectorContentAttemptAction(mockPayload)});
            const expected = cold('(bc)', {
                b: new SnackbarErrorAction('PROJECT_EDITOR.ERROR.UPDATE_CONNECTOR.GENERAL'),
                c: new UpdateConnectorFailedAction()
            });

            expect(effects.updateConnectorContentEffect).toBeObservable(expected);
        });
    });

    describe('getConnectorEffect', () => {
        let getConnectorDetails: jest.Mock, getConnectorContent: jest.Mock;

        beforeEach(() => {
            getConnectorDetails = <jest.Mock>connectorEditorService.getDetails;
            getConnectorContent = <jest.Mock>connectorEditorService.getContent;
        });

        it('updateConnectorContentEffect should dispatch an action', () => {
            expect(metadata.getConnectorEffect.dispatch).toBeTruthy();
        });

        it('should trigger the load of connector and connector content', () => {
            actions$ = hot('a', { a: new GetConnectorAttemptAction('connector-id') });

            effects.getConnectorEffect.subscribe(() => {
            });
            getTestScheduler().flush();

            expect(getConnectorDetails).toHaveBeenCalledWith('connector-id', 'mock-app-id');
            expect(getConnectorContent).toHaveBeenCalledWith('connector-id');
        });

        it('should dispatch the GetConnectorSuccessAction with the loaded resources', () => {
            getConnectorDetails.mockReturnValue(of(connector));
            getConnectorContent.mockReturnValue(of(connectorContent));

            actions$ = hot('a', { a: new GetConnectorAttemptAction('connector-id') });
            const expected = cold('b', {
                b: new GetConnectorSuccessAction(connector, connectorContent)
            });

            expect(effects.getConnectorEffect).toBeObservable(expected);
        });

        it('should dispatch the SnackbarErrorAction on any error', () => {
            getConnectorDetails.mockReturnValue(of(connector));
            getConnectorContent.mockReturnValue(throwError(new Error()));

            actions$ = hot('a', { a: new GetConnectorAttemptAction('connector-id') });
            const expected = cold('b', {
                b: new SnackbarErrorAction('ADV_CONNECTOR_EDITOR.ERRORS.GET_CONNECTOR')
            });

            expect(effects.getConnectorEffect).toBeObservable(expected);
        });
    });

    describe('changeConnectorContentEffect', () => {
        it('changeConnectorContentEffect should dispatch an action', () => {
            expect(metadata.changeConnectorContentEffect.dispatch).toBeTruthy();
        });

        it('changeConnectorContentEffect should dispatch the SetAppDirtyStateAction', () => {
            actions$ = hot('a', { a: new ChangeConnectorContent() });
            const expected = cold('b', {
                b: new SetAppDirtyStateAction(true)
            });

            expect(effects.changeConnectorContentEffect).toBeObservable(expected);
        });
    });

    describe('updateConnectorSuccessEffect', () => {
        it('updateConnectorSuccessEffect should dispatch an action', () => {
            expect(metadata.updateConnectorSuccessEffect.dispatch).toBeTruthy();
        });

        it('updateConnectorSuccessEffect should dispatch SetAppDirtyStateAction', () => {
            actions$ = hot('a', { a: new UpdateConnectorSuccessAction(<Update<Partial<Connector>>>{changes: {name: ''}, id: ''}) });
            const expected = cold('(bcd)', {
                b: new UpdateTabTitle('', ''),
                c: new SetApplicationLoadingStateAction(false),
                d: new SetAppDirtyStateAction(false)
            });

            expect(effects.updateConnectorSuccessEffect).toBeObservable(expected);
        });
    });

    describe('updateConnectorFailedEffect', () => {
        it('updateConnectorFailedEffect should dispatch an action', () => {
            expect(metadata.updateConnectorFailedEffect.dispatch).toBeTruthy();
        });

        it('updateConnectorFailedEffect should dispatch SetAppDirtyStateAction', () => {
            actions$ = hot('a', { a: new UpdateConnectorFailedAction() });
            const expected = cold('b', {
                b: new SetApplicationLoadingStateAction(false),
            });

            expect(effects.updateConnectorFailedEffect).toBeObservable(expected);
        });
    });

    describe('deleteConnectorAttemptEffect', () => {

        let deleteConnector: jest.Mock;

        beforeEach(() => {
            deleteConnector = <jest.Mock>connectorEditorService.delete;
        });

        it('deleteConnectorAttemptEffect should dispatch an action', () => {
            expect(metadata.deleteConnectorAttemptEffect.dispatch).toBeTruthy();
        });

        it('deleteConnectorAttemptEffect should dispatch the DeleteConnectorSuccessAction and SnackbarInfoAction actions', () => {
            actions$ = hot('a', { a: new DeleteConnectorAttemptAction(connector.id) });

            const expected = cold('(bcde)', {
                b: new DeleteConnectorSuccessAction(connector.id),
                c: new ModelClosedAction({ id: connector.id, type: CONNECTOR }),
                d: new SetAppDirtyStateAction(false),
                e: new SnackbarInfoAction('PROJECT_EDITOR.CONNECTOR_DIALOG.CONNECTOR_DELETED')
            });

            expect(effects.deleteConnectorAttemptEffect).toBeObservable(expected);
        });

        it('should dispatch the SnackbarErrorAction with general error on every error', () => {
            const error: any = new Error();
            deleteConnector.mockReturnValue(throwError(error));

            actions$ = hot('a', { a: new DeleteConnectorAttemptAction(connector.id) });
            const expected = cold('(bc)', {
                b: new SnackbarErrorAction('PROJECT_EDITOR.ERROR.UPDATE_CONNECTOR.GENERAL'),
                c: new UpdateConnectorFailedAction()
            });

            expect(effects.deleteConnectorAttemptEffect).toBeObservable(expected);
        });
    });

    describe('deleteConnectorSuccessEffect', () => {
        it('deleteConnectorSuccessEffect should not dispatch an action', () => {
            expect(metadata.deleteConnectorSuccessEffect.dispatch).toBeFalsy();
        });

        it('should call the router.navigate method', () => {
            actions$ = cold('a', { a: { type: DELETE_CONNECTOR_SUCCESS } });
            effects.deleteConnectorSuccessEffect.subscribe(() => {
                expect(router.navigate).toHaveBeenCalledWith(['/projects', connector.projectIds[0]]);
            });
        });
    });

    describe('CreateConnector Effect', () => {
        it('createConnector should dispatch an action', () => {
            expect(metadata.createConnectorEffect.dispatch).toBeTruthy();
        });

        it('createConnector should dispatch the CreateConnectorSuccessAction and SnackbarInfoAction actions and update the connector content', () => {
            const mockPayload = <Partial<EntityDialogForm>>{ name: 'mock-name', projectId: 'mock-app-id' };
            actions$ = hot('a', { a: new CreateConnectorAttemptAction(mockPayload) });
            const expected = cold('(bc)', {
                b: new CreateConnectorSuccessAction(<Connector>connector),
                c: new SnackbarInfoAction('PROJECT_EDITOR.CONNECTOR_DIALOG.CONNECTOR_CREATED')
            });
            expect(effects.createConnectorEffect).toBeObservable(expected);
        });
    });

    describe('createConnectorSuccessEffect Effect', () => {
        it('createConnectorSuccessEffect should  not dispatch an action', () => {
            expect(metadata.createConnectorSuccessEffect.dispatch).toBeFalsy();
        });

        it('should redirect to the new connector page if the payload received is true', () => {
            actions$ = hot('a', { a: new CreateConnectorSuccessAction(connector, true) });
            effects.createConnectorSuccessEffect.subscribe(() => {
            });
            getTestScheduler().flush();
            expect(router.navigate).toHaveBeenCalledWith(['/projects', connector.projectIds[0], 'connector', connector.id]);
        });

        it('should not redirect to the new connector page if the payload received is false', () => {
            actions$ = hot('a', { a: new CreateConnectorSuccessAction(connector, false) });
            effects.createConnectorSuccessEffect.subscribe(() => {
            });
            getTestScheduler().flush();
            expect(router.navigate).not.toHaveBeenCalled();
        });
    });

    describe('ShowConnectors Effect', () => {
        it('showConnectorsEffect should dispatch an action', () => {
            expect(metadata.showConnectorsEffect.dispatch).toBeTruthy();
        });

        it('showConnectorsEffect should dispatch the GetConnectorsAttemptAction if there are no connectors loaded', () => {
            actions$ = hot('a', { a: new ShowConnectorsAction('test') });
            const expected = cold('b', { b: { projectId: 'test', type: GET_CONNECTORS_ATTEMPT } });
            expect(effects.showConnectorsEffect).toBeObservable(expected);
        });

        it('showConnectorsEffect should not dispatch the GetConnectorsAttemptAction if there are connectors loaded', () => {
            actions$ = hot('a', { a: new ShowConnectorsAction('test') });
            const expected = cold('');
            spyOn(store, 'select').and.returnValue(of(true));
            expect(effects.showConnectorsEffect).toBeObservable(expected);
        });
    });

    describe('getConnectorsEffect', () => {
        it('getProcessesEffect should dispatch an action', () => {
            expect(metadata.getConnectorsEffect.dispatch).toBeTruthy();
        });

        it('getProcessesEffect should dispatch the GetConnectorsSuccessAction', () => {
            actions$ = hot('a', { a: new GetConnectorsAttemptAction('id') });
            const expected = cold('b', { b: new GetConnectorsSuccessAction(<Connector[]>[connector]) });
            expect(effects.getConnectorsEffect).toBeObservable(expected);
        });
    });

    describe('validateConnectorEffect', () => {

        let validateConnector: jest.Mock;
        const payload: ValidateConnectorPayload = {
            title: 'APP.DIALOGS.CONFIRM.TITLE',
            modelId: connector.id,
            modelContent: connectorContent,
            action: new UpdateConnectorContentAttemptAction({modelId: 'mock-id', modelContent: connectorContent})
        };

        beforeEach(() => {
            validateConnector = <jest.Mock>connectorEditorService.validate;
        });

        it('validateConnectorEffect should dispatch an action', () => {
            expect(metadata.validateConnectorEffect.dispatch).toBeTruthy();
        });

        it('validateConnectorEffect should dispatch the action from payload if connector is valid', () => {
            actions$ = hot('a', { a: new ValidateConnectorAttemptAction(payload) });

            const expected = cold('(bcd)', {
                b: new SetApplicationLoadingStateAction(true),
                c: payload.action,
                d: new SetApplicationLoadingStateAction(false)
            });

            expect(effects.validateConnectorEffect).toBeObservable(expected);
        });

        it('should dispatch the OpenConfirmDialogAction if connector is not valid', () => {
            const error: any = new Error();
            error.message = JSON.stringify({ errors: [{ description: 'test' }] });
            validateConnector.mockReturnValue(throwError(error));

            actions$ = hot('a', { a: new ValidateConnectorAttemptAction(payload) });
            const expectedPayload = {
                dialogData: {
                    title: 'APP.DIALOGS.CONFIRM.TITLE',
                    subtitle: 'APP.DIALOGS.ERROR.SUBTITLE',
                    messages: ['test']
                },
                action: payload.action
            };
            const expectedLogAction = logFactory.logError(getConnectorLogInitiator(), 'test');
            expectedLogAction.log.datetime = (<any>expect).any(Date);
            const expected = cold('(bc)', {
                b: new OpenConfirmDialogAction(expectedPayload),
                c: expectedLogAction
            });

            expect(effects.validateConnectorEffect).toBeObservable(expected);
        });
    });

    describe('saveAsConnectorEffect', () => {

        let createConnector: jest.Mock, updateConnector: jest.Mock;

        beforeEach(() => {
            createConnector = <jest.Mock>connectorEditorService.create;
            updateConnector = <jest.Mock>connectorEditorService.update;
        });

        const mockOpenSaveAsDialog: SaveAsDialogPayload = {
            id: 'connector-old-id',
            name: 'test-name',
            description: 'test-description',
            sourceModelContent: {
                'name': 'old-name',
                'description': ''
            }
        };

        it('openSaveAsConnectorEffect should not dispatch an action', () => {
            expect(metadata.openSaveAsConnectorEffect.dispatch).toBeFalsy();
        });

        it('openSaveAsConnectorEffect should open save as dialog', () => {
            spyOn(dialogService, 'openDialog');
            actions$ = hot('a', { a: new OpenSaveAsConnectorAction(mockOpenSaveAsDialog) });
            effects.openSaveAsConnectorEffect.subscribe(() => { });
            getTestScheduler().flush();
            expect(dialogService.openDialog).toHaveBeenCalled();
        });

        it('saveAsConnectorEffect should dispatch an action', () => {
            expect(metadata.saveAsConnectorEffect.dispatch).toBeTruthy();
        });

        it('should call the save as connector with the proper parameters', () => {
            createConnector.mockReturnValue(of(connector));
            updateConnector.mockReturnValue(of(connector));

            actions$ = hot('a', { a: new SaveAsConnectorAttemptAction(mockOpenSaveAsDialog) });

            effects.saveAsConnectorEffect.subscribe(() => { });
            getTestScheduler().flush();

            expect(createConnector).toHaveBeenCalledWith(mockOpenSaveAsDialog, connector.projectIds[0]);
            expect(updateConnector).toHaveBeenCalledWith(connector.id, connector, mockOpenSaveAsDialog.sourceModelContent, connector.projectIds[0]);
        });

        it('should trigger the right action on unsuccessful save as', () => {
            connectorEditorService.update = jest.fn().mockReturnValue(throwError(new Error()));
            actions$ = hot('a', { a: new SaveAsConnectorAttemptAction(mockOpenSaveAsDialog) });

            const expected = cold('(b)', {
                b: new SnackbarErrorAction('PROJECT_EDITOR.ERROR.CREATE_CONNECTOR.GENERAL')
            });

            expect(effects.saveAsConnectorEffect).toBeObservable(expected);
        });
    });

});
