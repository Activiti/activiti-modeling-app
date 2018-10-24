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

import { TestBed } from '@angular/core/testing';
import { ProcessesEffects } from './processes.effects';
import { Observable } from 'rxjs';
import { cold, hot } from 'jasmine-marbles';
import { Store } from '@ngrx/store';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { Router } from '@angular/router';
import { LogService, CoreModule } from '@alfresco/adf-core';
import { selectProcessesLoaded } from '../selectors/application-tree.selectors';
import { provideMockActions } from '@ngrx/effects/testing';
import { ShowProcessesAction, GET_PROCESSES_ATTEMPT } from '../actions/processes';
import { of } from 'rxjs';
import { ApplicationEditorService } from '../../services/application-editor.service';
import { MatDialogModule, MatMenuModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProcessEditorService } from '../../../process-editor/services/process-editor.service';
import { AmaState, AmaApi, DownloadResourceService, AmaAuthenticationService } from 'ama-sdk';

describe('ProcessesEffects', () => {
    let effects: ProcessesEffects;
    let metadata: EffectsMetadata<ProcessesEffects>;
    let actions$: Observable<any>;
    let store: Store<AmaState>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatDialogModule, NoopAnimationsModule, MatMenuModule, CoreModule],
            providers: [
                ProcessesEffects,
                ApplicationEditorService,
                ProcessEditorService,
                AmaAuthenticationService,
                AmaApi,
                DownloadResourceService,
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
                    useValue: { select: jest.fn(selectProcessesLoaded).mockReturnValue(of(false)) }
                }
            ]
        });

        effects = TestBed.get(ProcessesEffects);
        metadata = getEffectsMetadata(effects);
        store = TestBed.get(Store);
    });

    it('ShowProcesses effect should dispatch an action', () => {
        expect(metadata.showProcessesEffect).toEqual({ dispatch: true });
    });

    it('ShowProcesses effect should dispatch a GetProcessesAtteptAction if there are no processes loaded', () => {
        actions$ = hot('a', { a: new ShowProcessesAction('test') });
        const expected = cold('b', { b: { applicationId: 'test', type: GET_PROCESSES_ATTEMPT } });
        expect(effects.showProcessesEffect).toBeObservable(expected);
    });

    it('ShowProcesses effect should not dispatch a new GetApplicationAtteptAction if there are apps loaded', () => {
        actions$ = hot('a', { a: new ShowProcessesAction('test') });
        const expected = cold('');
        store.select = jest.fn(selectProcessesLoaded).mockReturnValue(of(true));
        expect(effects.showProcessesEffect).toBeObservable(expected);
    });
});
