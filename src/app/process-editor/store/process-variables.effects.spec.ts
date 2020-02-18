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

import { ProcessVariablesEffects } from './process-variables.effects';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule, MatMenuModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { LogService } from '@alfresco/adf-core';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { SetAppDirtyStateAction, DialogService, BpmnFactoryToken, ProcessModelerServiceToken } from '@alfresco-dbp/modeling-shared/sdk';
import { UpdateProcessVariablesAction } from './process-variables.actions';
import { hot, cold } from 'jasmine-marbles';
import { mockProcessModel, mockProcessId } from './process.mock';

describe('Process variables effects', () => {
    let effects: ProcessVariablesEffects;
    let metadata: EffectsMetadata<ProcessVariablesEffects>;
    let actions$: Observable<any> = of();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatDialogModule, NoopAnimationsModule, MatMenuModule],
            providers: [
                ProcessVariablesEffects,
                DialogService,
                provideMockActions(() => actions$),
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
                    useValue: { select: jest.fn() }
                },
                {
                    provide:  BpmnFactoryToken,
                    useValue: {}
                },
                {
                    provide:  ProcessModelerServiceToken,
                    useValue: {
                        updateElementProperty: jest.fn(),
                        getRootProcessElement: jest.fn().mockReturnValue({ id: '' })
                    }
                }
            ]
        });

        effects = TestBed.get(ProcessVariablesEffects);
        metadata = getEffectsMetadata(effects);
    });

    it('openVariablesDialog effect should not dispatch an action', () => {
        expect(metadata.openProcessVariablesDialogEffect).toEqual({ dispatch: false });
    });

    describe('updateProcessVariablesEffect', () => {
        it('updateProcessVariablesEffect effect should dispatch an action', () => {
            expect(metadata.updateProcessVariablesEffect).toEqual({ dispatch: true });
        });

        it('updateProcessVariablesEffect should dispatch SetAppDirtyStateAction', () => {
            actions$ = hot('a', { a: new UpdateProcessVariablesAction({
                modelId: mockProcessModel.id,
                processId: mockProcessId,
                properties: {
                    'id': { id: 'dsd', name: 'name', value: 'test', type: 'string', required: true}
                }
            })});
            const expected = cold('b', {
                b: new SetAppDirtyStateAction(true)
            });

            expect(effects.updateProcessVariablesEffect).toBeObservable(expected);
        });
    });

});
