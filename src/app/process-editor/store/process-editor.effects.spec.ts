/*!
 * @license
 * Alfresco Example Modeling Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Modeling Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Modeling Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Modeling Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { TestBed } from '@angular/core/testing';
import { ProcessEditorEffects } from './process-editor.effects';
import { Observable } from 'rxjs';
import { cold, hot, getTestScheduler } from 'jasmine-marbles';
import { Store } from '@ngrx/store';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { Router } from '@angular/router';
import { LogService, CoreModule } from '@alfresco/adf-core';
import { provideMockActions } from '@ngrx/effects/testing';
import { of } from 'rxjs';
import { ProcessModelerService } from '../services/process-modeler.service';
import { ProcessEditorService } from '../services/process-editor.service';
import { AmaTitleService } from '../../common/services/title.service';
import { ProcessEditorState } from './process-editor.state';
import { selectSelectedElement, selectProcess } from './process-editor.selectors';
import { BpmnFactoryToken } from '../services/bpmn-factory.token';
import { BpmnFactoryMock } from '../services/bpmn-js/bpmn-js.mock';
import {
    ChangedProcessAction,
    SelectModelerElementAction,
    UpdateProcessAttemptAction,
    UpdateProcessSuccessAction
} from './process-editor.actions';
import { Process } from 'ama-sdk';
import { SnackbarInfoAction, SnackbarErrorAction, SetAppDirtyStateAction } from '../../store/actions';
import { throwError } from 'rxjs';
import { DownloadResourceService } from '../../common/services/download-resource';
import { mockProcess } from './process.mock';
import { AmaApi } from 'ama-sdk';
import { AmaAuthenticationService } from '../../common/services/ama-authentication.service';

describe('ProcessEditorEffects', () => {
    let effects: ProcessEditorEffects;
    let metadata: EffectsMetadata<ProcessEditorEffects>;
    let actions$: Observable<any>;
    let store: Store<ProcessEditorState>;
    let process: Process;
    let processEditorService: ProcessEditorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreModule],
            providers: [
                ProcessEditorEffects,
                ProcessEditorService,
                ProcessModelerService,
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
                            } else if (selector === selectProcess) {
                                return of(process);
                            }

                            return of({});
                        })
                    }
                }
            ]
        });

        effects = TestBed.get(ProcessEditorEffects);
        metadata = getEffectsMetadata(effects);
        store = TestBed.get(Store);
        processEditorService = TestBed.get(ProcessEditorService);
    });

    describe('updateProcessEffect', () => {

        const mockActionPayload = {
            processId: mockProcess.id,
            content: 'diagramData',
            metadata: { name: mockProcess.name, description: mockProcess.description }
        };

        beforeEach(() => {
            process = <Process>mockProcess;
        });

        it('updateProcessEffect should dispatch an action', () => {
            expect(metadata.updateProcessEffect).toEqual({ dispatch: true });
        });

        it('should call the update process endpoint with the proper parameters', () => {
            processEditorService.updateProcess = jest.fn().mockReturnValue(of(process));
            actions$ = hot('a', { a: new UpdateProcessAttemptAction(mockActionPayload) });

            effects.updateProcessEffect.subscribe(() => {});
            getTestScheduler().flush();

            expect(processEditorService.updateProcess).toHaveBeenCalledWith(
                mockActionPayload.processId,
                { ...mockProcess, ...mockActionPayload.metadata }
            );
        });

        it('should call the update process diagram endpoint with the proper parameters', () => {
            processEditorService.updateProcess = jest.fn().mockReturnValue(of(process));
            processEditorService.saveProcessDiagram = jest.fn();
            actions$ = hot('a', { a: new UpdateProcessAttemptAction(mockActionPayload) });

            effects.updateProcessEffect.subscribe(() => {});
            getTestScheduler().flush();

            expect(processEditorService.saveProcessDiagram).toHaveBeenCalledWith(mockActionPayload.processId, mockActionPayload.content);
        });

        it('should trigger the right action on successful update', () => {
            processEditorService.updateProcess = jest.fn().mockReturnValue(of(process));
            processEditorService.saveProcessDiagram = jest.fn().mockReturnValue(of(true));
            actions$ = hot('a', { a: new UpdateProcessAttemptAction(mockActionPayload) });

            const expected = cold('(bcd)', {
                b: new UpdateProcessSuccessAction(mockActionPayload),
                c: new SetAppDirtyStateAction(false),
                d: new SnackbarInfoAction('APP.PROCESS_EDITOR.PROCESS_UPDATED')
            });

            expect(effects.updateProcessEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful update', () => {
            processEditorService.updateProcess = jest.fn().mockReturnValue(of(process));
            processEditorService.saveProcessDiagram = jest.fn().mockReturnValue(throwError(new Error()));
            actions$ = hot('a', { a: new UpdateProcessAttemptAction(mockActionPayload) });

            const expected = cold('b', {
                b: new SnackbarErrorAction('APP.APPLICATION.ERROR.UPDATE_PROCESS.GENERAL')
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
});
