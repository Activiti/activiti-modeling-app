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
import { Observable } from 'rxjs';
import { cold, hot } from 'jasmine-marbles';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { StorageService, AppConfigServiceMock, AppConfigService } from '@alfresco/adf-core';
import { provideMockActions } from '@ngrx/effects/testing';
import { AsyncInitAction, LoggedInAction } from '../actions/app.actions';
import { appThemes } from '../../app/themes';
import { AuthEffects } from './auth.effects';
import { HttpClientModule } from '@angular/common/http';
import { AmaAuthenticationService } from '@alfresco-dbp/modeling-shared/sdk';

describe('AuthEffects', () => {
    let effects: AuthEffects;
    let metadata: EffectsMetadata<AuthEffects>;
    let actions$: Observable<any>;
    let storageService: StorageService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientModule ],
            providers: [
                AuthEffects,
                StorageService,
                { provide: AmaAuthenticationService, useValue: { logout: () => {} } },
                { provide: AppConfigService, useClass: AppConfigServiceMock },
                provideMockActions(() => actions$)
            ]
        });

        effects = TestBed.get(AuthEffects);
        metadata = getEffectsMetadata(effects);

        storageService = TestBed.get(StorageService);
    });

    describe('loggedInEffect$', () => {
        it('should dispatch an action', () => {
            expect(metadata.loggedInEffect$).toEqual({ dispatch: true });
        });

        it('should initialise with the default values for theme and menuOpened if nothing is set in the storageService', () => {
            const loggedInAction = new LoggedInAction();
            actions$ = hot('a', { a: loggedInAction });

            const expectedAction = new AsyncInitAction(<any>{
                selectedTheme: appThemes[0],
                menuOpened: null,
                showConnectorsWithTemplate: false
            });
            const expected = cold('(x)', { x: expectedAction });

            expect(effects.loggedInEffect$).toBeObservable(expected);
        });

        it('should initialise with the preserved values for theme and menuOpened(true) if something is set in the storageService', () => {
            storageService.setItem('selectedTheme', appThemes[1].className);
            storageService.setItem('menuOpened', 'true');

            const loggedInAction = new LoggedInAction();
            actions$ = hot('a', { a: loggedInAction });

            const expectedAction = new AsyncInitAction(<any>{
                selectedTheme: appThemes[1],
                menuOpened: true,
                showConnectorsWithTemplate: false
            });
            const expected = cold('(x)', { x: expectedAction });

            expect(effects.loggedInEffect$).toBeObservable(expected);
        });

        it('should initialise with the preserved value for menuOpened(false) if something is set in the storageService', () => {
            storageService.setItem('menuOpened', 'false');

            const loggedInAction = new LoggedInAction();
            actions$ = hot('a', { a: loggedInAction });

            const expectedAction = new AsyncInitAction(<any>{
                selectedTheme: jasmine.any(Object),
                menuOpened: false,
                showConnectorsWithTemplate: false
            });
            const expected = cold('(x)', { x: expectedAction });

            expect(effects.loggedInEffect$).toBeObservable(expected);
        });
    });
});
