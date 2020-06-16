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
import { ProcessEditorEffects } from './process-editor.effects';
import { cold, hot, getTestScheduler } from 'jasmine-marbles';
import { Store } from '@ngrx/store';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { Router } from '@angular/router';
import { LogService, CoreModule, TranslationService, TranslationMock } from '@alfresco/adf-core';
import { provideMockActions } from '@ngrx/effects/testing';
import { ProcessModelerServiceImplementation } from '../services/process-modeler.service';
import { ProcessEditorService } from '../services/process-editor.service';
import { selectSelectedElement, selectProcessesLoaded } from './process-editor.selectors';
import { BpmnFactoryMock } from '../services/bpmn-js/bpmn-js.mock';
import {
    ChangedProcessAction,
    SelectModelerElementAction,
    UpdateProcessAttemptAction,
    UpdateProcessSuccessAction,
    ShowProcessesAction,
    GET_PROCESSES_ATTEMPT,
    CreateProcessSuccessAction,
    UploadProcessAttemptAction,
    UpdateProcessFailedAction,
    ValidateProcessAttemptAction,
    RemoveDiagramElementAction,
    RemoveElementMappingAction,
    DeleteProcessExtensionAction
} from './process-editor.actions';
import { throwError, of, Observable } from 'rxjs';
import { mockProcessModel, validateError } from './process.mock';
import {
    AmaApi,
    AmaAuthenticationService,
    DownloadResourceService,
    Process,
    SnackbarErrorAction,
    SnackbarInfoAction,
    SetAppDirtyStateAction,
    AmaTitleService,
    selectSelectedProcess,
    UploadFileAttemptPayload,
    BpmnFactoryToken,
    ProcessModelerServiceToken,
    selectSelectedProjectId,
    LogFactoryService,
    SetApplicationLoadingStateAction,
    ProcessExtensionsContent,
    OpenConfirmDialogAction,
    selectOpenedModel,
    BpmnElement,
    ProcessModelerService
} from '@alfresco-dbp/modeling-shared/sdk';
import { ProcessEntitiesState } from './process-entities.state';
import { getProcessLogInitiator } from '../services/process-editor.constants';
import { TranslateModule } from '@ngx-translate/core';

describe('ProcessEditorEffects', () => {
    let effects: ProcessEditorEffects;
    let metadata: EffectsMetadata<ProcessEditorEffects>;
    let actions$: Observable<any>;
    let store: Store<ProcessEntitiesState>;
    let process: Process;
    let processEditorService: ProcessEditorService;
    let router: Router;
    let logFactory: LogFactoryService;
    let processModelerService: ProcessModelerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                TranslateModule.forRoot()],
            providers: [
                ProcessEditorEffects,
                { provide: ProcessModelerServiceToken, useClass: ProcessModelerServiceImplementation },
                AmaTitleService,
                DownloadResourceService,
                AmaAuthenticationService,
                AmaApi,
                provideMockActions(() => actions$),
                {
                    provide: BpmnFactoryToken,
                    useClass: BpmnFactoryMock
                },
                {
                    provide: TranslationService,
                    useClass: TranslationMock
                },
                {
                    provide: Router,
                    useValue: { navigate: jest.fn() }
                },
                {
                    provide: LogService,
                    useValue: { error: jest.fn() }
                },
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation(selector => {
                            if (selector === selectSelectedElement) {
                                return of(false);
                            } else if (selector === selectSelectedProcess) {
                                return of(process);
                            } else if (selector === selectSelectedProjectId) {
                                return of('test1');
                            }

                            return of({});
                        }),
                        dispatch: jest.fn()
                    }
                },
                {
                    provide: ProcessEditorService,
                    useValue: {
                        update: jest.fn().mockReturnValue(of(mockProcessModel)),
                        delete: jest.fn().mockReturnValue(of(mockProcessModel.id)),
                        getDetails: jest.fn(),
                        getContent: jest.fn(),
                        create: jest.fn().mockReturnValue(of(mockProcessModel)),
                        upload: jest.fn().mockReturnValue(of(mockProcessModel)),
                        fetchAll: jest.fn().mockReturnValue(of([mockProcessModel])),
                        validate: jest.fn().mockReturnValue(of([mockProcessModel]))
                    }
                }
            ]
        });

        logFactory = TestBed.get(LogFactoryService);
        effects = TestBed.get(ProcessEditorEffects);
        metadata = getEffectsMetadata(effects);
        store = TestBed.get(Store);
        router = TestBed.get(Router);
        processEditorService = TestBed.get(ProcessEditorService);
        processModelerService = TestBed.get(ProcessModelerServiceToken);
    });

    describe('updateProcessEffect', () => {
        beforeEach(() => {
            process = <Process>mockProcessModel;
        });

        it('ShowProcesses effect should dispatch an action', () => {
            expect(metadata.showProcessesEffect).toEqual({ dispatch: true });
        });

        it('ShowProcesses effect should dispatch a GetProcessesAttemptAction if there are no processes loaded', () => {
            actions$ = hot('a', { a: new ShowProcessesAction('test') });
            store.select = jest.fn(selectProcessesLoaded).mockReturnValue(of(false));
            const expected = cold('b', { b: { projectId: 'test', type: GET_PROCESSES_ATTEMPT } });
            expect(effects.showProcessesEffect).toBeObservable(expected);
        });

        it('ShowProcesses effect should not dispatch a new GetProjectAttemptAction if there are apps loaded', () => {
            actions$ = hot('a', { a: new ShowProcessesAction('test') });
            const expected = cold('');
            store.select = jest.fn(selectProcessesLoaded).mockReturnValue(of(true));
            expect(effects.showProcessesEffect).toBeObservable(expected);
        });
    });

    describe('uploadProcessEffect', () => {
        beforeEach(() => {
            process = <Process>mockProcessModel;
        });

        it('uploadProcessEffect should dispatch an action', () => {
            expect(metadata.uploadProcessEffect).toEqual({ dispatch: true });
        });

        it('uploadProcessEffect should dispatch the CreateConnectorSuccessAction', () => {
            actions$ = hot('a', { a: new UploadProcessAttemptAction(<UploadFileAttemptPayload>{ file: new File([''], 'filename') }) });
            const expected = cold('(bc)', {
                b: new CreateProcessSuccessAction(process, true),
                c: new SnackbarInfoAction('PROCESS_EDITOR.UPLOAD_SUCCESS'),
            });

            expect(effects.uploadProcessEffect).toBeObservable(expected);
        });
    });

    describe('updateProcessEffect', () => {

        const mockActionPayload = {
            processId: mockProcessModel.id,
            content: 'diagramData',
            metadata: { name: mockProcessModel.name, description: mockProcessModel.description }
        };

        const mockValidatePayload = {
            projectId: 'test',
            title: 'mock title',
            processId: mockProcessModel.id,
            content: 'diagramData',
            extensions: <ProcessExtensionsContent>{},
            action: new UpdateProcessAttemptAction(mockActionPayload)
        };

        beforeEach(() => {
            process = <Process>mockProcessModel;
        });

        it('updateProcessEffect should dispatch an action', () => {
            expect(metadata.updateProcessEffect).toEqual({ dispatch: true });
        });

        it('should call the update process endpoint with the proper parameters', () => {
            processEditorService.update = jest.fn().mockReturnValue(of(process));
            actions$ = hot('a', { a: new UpdateProcessAttemptAction(mockActionPayload) });

            effects.updateProcessEffect.subscribe(() => {
            });
            getTestScheduler().flush();

            expect(processEditorService.update).toHaveBeenCalledWith(
                mockActionPayload.processId,
                { ...mockProcessModel, ...mockActionPayload.metadata },
                mockActionPayload.content,
                'test1'
            );
        });

        it('should trigger the right action on successful update', () => {
            processEditorService.update = jest.fn().mockReturnValue(of(process));
            actions$ = hot('a', { a: new UpdateProcessAttemptAction(mockActionPayload) });
            const expectedLogAction = logFactory.logInfo(getProcessLogInitiator(), 'PROCESS_EDITOR.PROCESS_SAVED');
            expectedLogAction.log.datetime = (<any>expect).any(Date);

            const expected = cold('(bcdef)', {
                b: new SetApplicationLoadingStateAction(true),
                c: new UpdateProcessSuccessAction({
                    id: mockProcessModel.id,
                    changes: mockActionPayload.metadata
                }, mockActionPayload.content),
                d: new SetAppDirtyStateAction(false),
                e: expectedLogAction,
                f: new SnackbarInfoAction('PROCESS_EDITOR.PROCESS_SAVED')
            });

            expect(effects.updateProcessEffect).toBeObservable(expected);
        });

        it('should handle general general string error message', () => {
            processEditorService.validate = jest.fn().mockReturnValue(throwError(new Error(validateError)));
            actions$ = hot('a', { a: new ValidateProcessAttemptAction(mockValidatePayload) });
            const expectedLogAction = logFactory.logError(getProcessLogInitiator(), ['Parse Error']);
            expectedLogAction.log.datetime = (<any>expect).any(Date);

            const expected = cold('(bc)', {
                b: new OpenConfirmDialogAction({
                    dialogData: {
                        title: mockValidatePayload.title,
                        subtitle: 'APP.DIALOGS.ERROR.SUBTITLE',
                        errors: ['Parse Error']
                    },
                    action: mockValidatePayload.action
                }),
                c: expectedLogAction
            });

            expect(effects.validateProcessEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful update', () => {
            processEditorService.update = jest.fn().mockReturnValue(throwError(new Error()));
            actions$ = hot('a', { a: new UpdateProcessAttemptAction(mockActionPayload) });

            const expected = cold('(bc)', {
                b: new SnackbarErrorAction('PROJECT_EDITOR.ERROR.UPDATE_PROCESS.GENERAL'),
                c: new UpdateProcessFailedAction()
            });

            expect(effects.updateProcessEffect).toBeObservable(expected);
        });
    });

    describe('changedElementEffect', () => {
        const mockElement = {
            id: 'mock-element-id',
            type: 'mock-element-type',
            name: 'mock-element-name'
        };

        beforeEach(() => {
            process = <Process>mockProcessModel;
        });

        it('should dispatch an action', () => {
            expect(metadata.changedElementEffect).toEqual({ dispatch: true });
        });

        it('should dispatch an action if element is different', () => {
            actions$ = hot('a', { a: new ChangedProcessAction(mockElement) });

            const mockElement2 = {
                id: 'mock-element-id',
                type: 'mock-element-type2',
                name: 'mock-element-name'
            };

            store.select = jest.fn(selectSelectedElement).mockReturnValue(of(mockElement2));

            const expected = cold('b', { b: new SelectModelerElementAction(mockElement) });
            expect(effects.changedElementEffect).toBeObservable(expected);
        });

        it('should not dispatch an action if element is the same', () => {
            actions$ = hot('a', { a: new ChangedProcessAction(mockElement) });

            store.select = jest.fn(selectSelectedElement).mockReturnValue(of(mockElement));

            const expected = cold('');
            expect(effects.changedElementEffect).toBeObservable(expected);
        });

        it('should not dispatch an action if selected element is null', () => {
            actions$ = hot('a', { a: new ChangedProcessAction(mockElement) });

            store.select = jest.fn(selectSelectedElement).mockReturnValue(of(null));

            const expected = cold('');
            expect(effects.changedElementEffect).toBeObservable(expected);
        });
    });

    describe('removeDiagramElementEffect', () => {

        beforeEach(() => {
            process = <Process>mockProcessModel;
        });

        it('should dispatch an action if serviceTask element is removed', () => {
            const mockElement = {
                id: 'mock-element-id',
                type: BpmnElement.ServiceTask,
                name: 'mock-element-name',
                processId: 'Process_fake_name'
            };

            actions$ = hot('a', { a: new RemoveDiagramElementAction(mockElement) });
            store.select = jest.fn(selectOpenedModel).mockReturnValue(of(process));

            const expected = cold('b', { b: new RemoveElementMappingAction(mockElement.id, process.id, mockElement.processId) });
            expect(effects.removeDiagramElementEffect).toBeObservable(expected);
        });

        it('should dispatch an action if CallActivity element is removed', () => {
            const mockElement = {
                id: 'mock-element-id',
                type: BpmnElement.CallActivity,
                name: 'mock-element-name',
                processId: 'Process_fake_name'
            };

            actions$ = hot('a', { a: new RemoveDiagramElementAction(mockElement) });
            store.select = jest.fn(selectOpenedModel).mockReturnValue(of(process));

            const expected = cold('b', { b: new RemoveElementMappingAction(mockElement.id, process.id, mockElement.processId) });
            expect(effects.removeDiagramElementEffect).toBeObservable(expected);
        });

        it('should dispatch an action if UserTask element is removed', () => {
            const mockElement = {
                id: 'mock-element-id',
                type: BpmnElement.UserTask,
                name: 'mock-element-name',
                processId: 'Process_fake_name'
            };

            actions$ = hot('a', { a: new RemoveDiagramElementAction(mockElement) });
            store.select = jest.fn(selectOpenedModel).mockReturnValue(of(process));

            const expected = cold('b', { b: new RemoveElementMappingAction(mockElement.id, process.id, mockElement.processId) });
            expect(effects.removeDiagramElementEffect).toBeObservable(expected);
        });

        it('should dispatch an action if Participant element is removed', () => {
            const mockElement = {
                id: 'mock-element-id',
                type: BpmnElement.Participant,
                name: 'mock-element-name',
                processId: 'Process_fake_name'
            };

            actions$ = hot('a', { a: new RemoveDiagramElementAction(mockElement) });
            store.select = jest.fn(selectOpenedModel).mockReturnValue(of(process));

            const expected = cold('b', { b: new DeleteProcessExtensionAction(process.id, 'Process_fake_name') });
            expect(effects.removeDiagramElementEffect).toBeObservable(expected);
        });

        it('should not dispatch an action if Task element is removed', () => {
            const mockElement = {
                id: 'mock-element-id',
                type: BpmnElement.Task,
                name: 'mock-element-name'
            };

            actions$ = hot('a', { a: new RemoveDiagramElementAction(mockElement) });
            store.select = jest.fn(selectOpenedModel).mockReturnValue(of(process));

            const expected = cold('');
            expect(effects.removeDiagramElementEffect).toBeObservable(expected);
        });
    });

    describe('createProcessSuccessEffect Effect', () => {
        it('createProcessSuccessEffect should  not dispatch an action', () => {
            expect(metadata.createProcessSuccessEffect).toEqual({ dispatch: false });
        });

        it('should redirect to the new process page if the payload received is true', () => {
            actions$ = hot('a', { a: new CreateProcessSuccessAction(process, true) });
            effects.createProcessSuccessEffect.subscribe(() => {
            });
            getTestScheduler().flush();
            expect(router.navigate).toHaveBeenCalledWith(['/projects', 'test1', 'process', process.id]);
        });

        it('should not redirect to the new process page if the payload received is false', () => {
            actions$ = hot('a', { a: new CreateProcessSuccessAction(process, false) });
            effects.createProcessSuccessEffect.subscribe(() => {
            });
            getTestScheduler().flush();
            expect(router.navigate).not.toHaveBeenCalled();
        });
    });

});
