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
import { Observable } from 'rxjs';
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
    CreateConnectorAttemptAction,
    ShowConnectorsAction,
    GET_CONNECTORS_ATTEMPT,
    GetConnectorsAttemptAction,
    GetConnectorsSuccessAction,
    UploadConnectorAttemptAction,
    ValidateConnectorPayload,
    ValidateConnectorAttemptAction,
    OpenConnectorSettingsDialog,
    ChangedConnectorSettingsAction
} from './connector-editor.actions';
import { hot, cold, getTestScheduler } from 'jasmine-marbles';
import {
    EntityDialogForm,
    SetAppDirtyStateAction,
    selectSelectedProjectId,
    AmaTitleService,
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
    DialogService,
    logInfo,
    logError
} from 'ama-sdk';
import { of } from 'rxjs';
import { throwError } from 'rxjs';
import { Update } from '@ngrx/entity';
import { selectConnectorsLoaded, selectSelectedConnector } from './connector-editor.selectors';
import { MatDialogRef, MatDialogModule } from '@angular/material';
import { ConnectorSettingsDialogComponent } from '../components/connector-header/settings-dialog/connector-settings.dialog.component';
import { getConnectorLogInitiator } from '../services/connector-editor.constants';

describe('ConnectorEditorEffects', () => {
    let actions$: Observable<any>;
    let effects: ConnectorEditorEffects;
    let router: Router;
    let metadata: EffectsMetadata<ConnectorEditorEffects>;
    let connectorEditorService: ConnectorEditorService;
    let store: Store<AmaState>;
    let dialogService: DialogService;
    let storageService: StorageService;

    const connector: Connector = {
        type: CONNECTOR,
        id: 'mock-id',
        name: 'mock-name',
        creationDate: new Date(),
        createdBy:  '',
        lastModifiedDate:  new Date(),
        lastModifiedBy: '',
        description: 'mock-description',
        projectId: 'mock-app-id',
        version: '1.1.1'
    };

    const connectorContent: ConnectorContent = {
        id: 'mock-id',
        name: '',
        description: ''
    };

    const mockDialog = {
        close: jest.fn()
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                MatDialogModule,
                CoreModule.forRoot()
            ],
            providers: [
                ConnectorEditorEffects,
                AmaApi,
                AmaTitleService,
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
                            if (selector === selectSelectedConnector) {
                                return of(connector);
                            }

                            if (selector === selectConnectorsLoaded) {
                                return of(false);
                            }

                            if (selector === selectSelectedProjectId) {
                                return of(connector.projectId);
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
                }
            ]
        });

        effects = TestBed.get(ConnectorEditorEffects);
        connectorEditorService = TestBed.get(ConnectorEditorService);
        router = TestBed.get(Router);
        metadata = getEffectsMetadata(effects);
        store = TestBed.get(Store);
        actions$ = null;
        dialogService = TestBed.get(DialogService);
        storageService = TestBed.get(StorageService);
    });

    describe('uploadConnectorEffect', () => {
        it('uploadConnectorEffect should dispatch an action', () => {
            expect(metadata.uploadConnectorEffect).toEqual({ dispatch: true });
        });

        it('uploadConnectorEffect should dispatch the CreateConnectorSuccessAction', () => {
            actions$ = hot('a', { a: new UploadConnectorAttemptAction(<UploadFileAttemptPayload>{file: new File([''], 'filename')}) });
            const expected = cold('(bc)', {
                b: new CreateConnectorSuccessAction(connector, true),
                c: new SnackbarInfoAction('CONNECTOR_EDITOR.UPLOAD_SUCCESS'),
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
            expect(metadata.updateConnectorContentEffect).toEqual({ dispatch: true });
        });

        it('updateConnectorContentEffect should dispatch the UpdateConnectorSuccessAction and SnackbarInfoAction actions', () => {
            const mockPayload = <ConnectorContent>{ name: 'mock-name', description: 'mock-desc' };
            updateConnector.mockReturnValue(of(connector));

            actions$ = hot('a', { a: new UpdateConnectorContentAttemptAction(mockPayload) });
            const expectedLogAction = logInfo(getConnectorLogInitiator(), 'APP.PROJECT.CONNECTOR_DIALOG.CONNECTOR_UPDATED');
            expectedLogAction.log.datetime = (<any>expect).any(Date);
            const expected = cold('(bcd)', {
                b: new UpdateConnectorSuccessAction({ id: connector.id, changes: mockPayload }),
                c: expectedLogAction,
                d: new SnackbarInfoAction('APP.PROJECT.CONNECTOR_DIALOG.CONNECTOR_UPDATED')
            });

            expect(effects.updateConnectorContentEffect).toBeObservable(expected);
        });

        it('should dispatch the SnackbarErrorAction with duplication error on 409 status error', () => {
            const mockPayload = <ConnectorContent>{ name: 'mock-name', description: 'mock-desc' };
            const error: any = new Error();
            error.status = 409;
            updateConnector.mockReturnValue(throwError(error));

            actions$ = hot('a', { a: new UpdateConnectorContentAttemptAction(mockPayload) });
            const expected = cold('b', {
                b: new SnackbarErrorAction('APP.PROJECT.ERROR.UPDATE_CONNECTOR.DUPLICATION')
            });

            expect(effects.updateConnectorContentEffect).toBeObservable(expected);
        });

        it('should dispatch the SnackbarErrorAction with general error on every other error', () => {
            const mockPayload = <ConnectorContent>{ name: 'mock-name', description: 'mock-desc' };
            const error: any = new Error();
            updateConnector.mockReturnValue(throwError(error));

            actions$ = hot('a', { a: new UpdateConnectorContentAttemptAction(mockPayload) });
            const expected = cold('b', {
                b: new SnackbarErrorAction('APP.PROJECT.ERROR.UPDATE_CONNECTOR.GENERAL')
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
            expect(metadata.getConnectorEffect).toEqual({ dispatch: true });
        });

        it('should trigger the load of connector and connector content', () => {
            actions$ = hot('a', { a: new GetConnectorAttemptAction('connector-id') });

            effects.getConnectorEffect.subscribe(() => {});
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
                b: new SnackbarErrorAction('CONNECTOR_EDITOR.ERRORS.GET_CONNECTOR')
            });

            expect(effects.getConnectorEffect).toBeObservable(expected);
        });
    });

    describe('changeConnectorContentEffect', () => {
        it('changeConnectorContentEffect should dispatch an action', () => {
            expect(metadata.changeConnectorContentEffect).toEqual({ dispatch: true });
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
            expect(metadata.updateConnectorSuccessEffect).toEqual({ dispatch: true });
        });

        it('updateConnectorSuccessEffect should dispatch SetAppDirtyStateAction', () => {
            actions$ = hot('a', { a: new UpdateConnectorSuccessAction(<Update<Partial<Connector>>>{}) });
            const expected = cold('b', {
                b: new SetAppDirtyStateAction(false)
            });

            expect(effects.updateConnectorSuccessEffect).toBeObservable(expected);
        });
    });

    describe('deleteConnectorAttemptEffect', () => {

        let deleteConnector: jest.Mock;

        beforeEach(() => {
            deleteConnector = <jest.Mock>connectorEditorService.delete;
        });

        it('deleteConnectorAttemptEffect should dispatch an action', () => {
            expect(metadata.deleteConnectorAttemptEffect).toEqual({ dispatch: true });
        });

        it('deleteConnectorAttemptEffect should dispatch the DeleteConnectorSuccessAction and SnackbarInfoAction actions', () => {
            actions$ = hot('a', { a: new DeleteConnectorAttemptAction(connector.id) });

            const expected = cold('(bcde)', {
                b: new DeleteConnectorSuccessAction(connector.id),
                c: new ModelClosedAction({id: connector.id, type: CONNECTOR}),
                d: new SetAppDirtyStateAction(false),
                e: new SnackbarInfoAction('APP.PROJECT.CONNECTOR_DIALOG.CONNECTOR_DELETED')
            });

            expect(effects.deleteConnectorAttemptEffect).toBeObservable(expected);
        });

        it('should dispatch the SnackbarErrorAction with general error on every error', () => {
            const error: any = new Error();
            deleteConnector.mockReturnValue(throwError(error));

            actions$ = hot('a', { a: new DeleteConnectorAttemptAction(connector.id) });
            const expected = cold('b', {
                b: new SnackbarErrorAction('APP.PROJECT.ERROR.UPDATE_CONNECTOR.GENERAL')
            });

            expect(effects.deleteConnectorAttemptEffect).toBeObservable(expected);
        });
    });

    describe('deleteConnectorSuccessEffect', () => {
        it('deleteConnectorSuccessEffect should not dispatch an action', () => {
            expect(metadata.deleteConnectorSuccessEffect).toEqual({ dispatch: false });
        });

        it('should call the router.navigate method', () => {
            actions$ = cold('a', { a: { type: DELETE_CONNECTOR_SUCCESS } });
            effects.deleteConnectorSuccessEffect.subscribe( () => {
                expect(router.navigate).toHaveBeenCalledWith(['/projects', connector.projectId]);
            });
        });
    });

    describe('CreateConnector Effect', () => {
        it('createConnector should dispatch an action', () => {
            expect(metadata.createConnectorEffect).toEqual({ dispatch: true });
        });

        it('createConnector should dispatch the CreateConnectorSuccessAction and SnackbarInfoAction actions and update the connector content', () => {
            const mockPayload = <Partial<EntityDialogForm>>{ name: 'mock-name', projectId: 'mock-app-id' };
            actions$ = hot('a', { a: new CreateConnectorAttemptAction(mockPayload) });
            const expected = cold('(bc)', {
                b: new CreateConnectorSuccessAction(<Connector>connector),
                c: new SnackbarInfoAction('APP.PROJECT.CONNECTOR_DIALOG.CONNECTOR_CREATED')
            });
            expect(effects.createConnectorEffect).toBeObservable(expected);
        });
    });

    describe('createConnectorSuccessEffect Effect', () => {
        it('createConnectorSuccessEffect should  not dispatch an action', () => {
            expect(metadata.createConnectorSuccessEffect).toEqual({ dispatch: false});
        });

        it('should redirect to the new connector page if the payload received is true', () => {
            actions$ = hot('a', { a: new CreateConnectorSuccessAction(connector, true) });
            effects.createConnectorSuccessEffect.subscribe(() => {});
            getTestScheduler().flush();
            expect(router.navigate).toHaveBeenCalledWith(['/projects', connector.projectId, 'connector', connector.id]);
        });

        it('should not redirect to the new connector page if the payload received is false', () => {
            actions$ = hot('a', { a: new CreateConnectorSuccessAction(connector, false) });
            effects.createConnectorSuccessEffect.subscribe(() => {});
            getTestScheduler().flush();
            expect(router.navigate).not.toHaveBeenCalled();
        });
    });

    describe('ShowConnectors Effect', () => {
        it('showConnectorsEffect should dispatch an action', () => {
            expect(metadata.showConnectorsEffect).toEqual({ dispatch: true });
        });

        it('showConnectorsEffect should dispatch the GetConnectorsAttemptAction if there are no connectors loaded', () => {
            actions$ = hot('a', { a: new ShowConnectorsAction('test') });
            const expected = cold('b', { b: { projectId: 'test', type: GET_CONNECTORS_ATTEMPT } });
            expect(effects.showConnectorsEffect).toBeObservable(expected);
        });

        it('showConnectorsEffect should not dispatch the GetConnectorsAttemptAction if there are connectors loaded', () => {
            actions$ = hot('a', { a: new ShowConnectorsAction('test') });
            const expected = cold('');
            store.select = jest.fn(selectConnectorsLoaded).mockReturnValue(of(true));
            expect(effects.showConnectorsEffect).toBeObservable(expected);
        });
    });

    describe('getConnectorsEffect', () => {
        it('getProcessesEffect should dispatch an action', () => {
            expect(metadata.getConnectorsEffect).toEqual({ dispatch: true });
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
            connectorId: connector.id,
            connectorContent,
            action: new UpdateConnectorContentAttemptAction(connectorContent)
        };

        beforeEach(() => {
            validateConnector = <jest.Mock>connectorEditorService.validate;
        });

        it('validateConnectorEffect should dispatch an action', () => {
            expect(metadata.validateConnectorEffect).toEqual({ dispatch: true });
        });

        it('validateConnectorEffect should dispatch the action from payload if connector is valid', () => {
            actions$ = hot('a', { a: new ValidateConnectorAttemptAction(payload) });

            const expected = cold('b', {
                b: payload.action
            });

            expect(effects.validateConnectorEffect).toBeObservable(expected);
        });

        it('should dispatch the OpenConfirmDialogAction if connector is not valid', () => {
            const error: any = new Error();
            error.message = JSON.stringify({ errors: [ { description: 'test' } ]});
            validateConnector.mockReturnValue(throwError(error));

            actions$ = hot('a', { a: new ValidateConnectorAttemptAction(payload) });
            const expectedPayload = {
                dialogData: {
                    title: 'APP.DIALOGS.CONFIRM.TITLE',
                    subtitle: 'APP.DIALOGS.ERROR.SUBTITLE',
                    errors: ['test']
                },
                action: payload.action
            };
            const expectedLogAction = logError(getConnectorLogInitiator(), 'test');
            expectedLogAction.log.datetime = (<any>expect).any(Date);
            const expected = cold('(bc)', {
                b: new OpenConfirmDialogAction(expectedPayload),
                c: expectedLogAction
            });

            expect(effects.validateConnectorEffect).toBeObservable(expected);
        });
    });

    describe('openConnectorSettingsDialogEffect', () => {
        it('openConnectorSettingsDialogEffect should not dispatch an action', () => {
            expect(metadata.openConnectorSettingsDialogEffect).toEqual({ dispatch: false });
        });

        it('openConnectorSettingsDialogEffect should call the openDialog method of dialog service', () => {
            spyOn(dialogService, 'openDialog');
            actions$ = hot('a', { a: new OpenConnectorSettingsDialog() });
            effects.openConnectorSettingsDialogEffect.subscribe(() => {});
            getTestScheduler().flush();
            expect(dialogService.openDialog).toHaveBeenCalledWith(ConnectorSettingsDialogComponent, {
                disableClose: true,
                height: '200px',
                width: '500px'
            });
        });
    });

    describe('openConnectorSettingsDialogEffect', () => {
        it('openConnectorSettingsDialogEffect should not dispatch an action', () => {
            expect(metadata.openConnectorSettingsDialogEffect).toEqual({ dispatch: false });
        });

        it('openConnectorSettingsDialogEffect should call the openDialog method of dialog service', () => {
            spyOn(dialogService, 'openDialog');
            actions$ = hot('a', { a: new OpenConnectorSettingsDialog() });
            effects.openConnectorSettingsDialogEffect.subscribe(() => {});
            getTestScheduler().flush();
            expect(dialogService.openDialog).toHaveBeenCalledWith(ConnectorSettingsDialogComponent, {
                disableClose: true,
                height: '200px',
                width: '500px'
            });
        });
    });

    describe('changedConnectorSettingsEffect', () => {
        it('changedConnectorSettingsEffect should not dispatch an action', () => {
            expect(metadata.changedConnectorSettingsEffect).toEqual({ dispatch: false });
        });

        it('should call the setItem method of StorageService', () => {
            spyOn(storageService, 'setItem');
            actions$ = hot('a', { a: new ChangedConnectorSettingsAction(true) });
            effects.changedConnectorSettingsEffect.subscribe(() => {});
            getTestScheduler().flush();
            expect(storageService.setItem).toHaveBeenCalledWith('showConnectorsWithTemplate', 'true');
        });
    });
});
