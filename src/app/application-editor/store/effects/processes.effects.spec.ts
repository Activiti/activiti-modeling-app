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
import { AmaState } from 'ama-sdk';
import { of } from 'rxjs';
import { ApplicationEditorService } from '../../services/application-editor.service';
import { MatDialogModule, MatMenuModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AmaApi } from 'ama-sdk';
import { ProcessEditorService } from '../../../process-editor/services/process-editor.service';
import { DownloadResourceService } from '../../../common/services/download-resource';
import { AmaAuthenticationService } from '../../../common/services/ama-authentication.service';

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
