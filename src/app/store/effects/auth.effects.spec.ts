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
import { Observable } from 'rxjs';
import { cold, hot } from 'jasmine-marbles';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { StorageService, AppConfigServiceMock, AppConfigService } from '@alfresco/adf-core';
import { provideMockActions } from '@ngrx/effects/testing';
import { AsyncInitAction, LoggedInAction } from '../actions/app.actions';
import { AuthEffects } from './auth.effects';
import { HttpClientModule } from '@angular/common/http';
import { AmaAuthenticationService } from '../../common/services/ama-authentication.service';

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
                AmaAuthenticationService,
                { provide: AppConfigService, useClass: AppConfigServiceMock },
                { provide: AmaAuthenticationService, useValue: { isBasicAuthType: () => true } },
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

        it('should initialise with the default values for menuOpened if nothing is set in the storageService', () => {
            const loggedInAction = new LoggedInAction();
            actions$ = hot('a', { a: loggedInAction });

            const expectedAction = new AsyncInitAction(<any>{
                menuOpened: null
            });
            const expected = cold('(x)', { x: expectedAction });

            expect(effects.loggedInEffect$).toBeObservable(expected);
        });

        it('should initialise with the preserved values for menuOpened(true) if something is set in the storageService', () => {
            storageService.setItem('menuOpened', 'true');

            const loggedInAction = new LoggedInAction();
            actions$ = hot('a', { a: loggedInAction });

            const expectedAction = new AsyncInitAction(<any>{
                menuOpened: true
            });
            const expected = cold('(x)', { x: expectedAction });

            expect(effects.loggedInEffect$).toBeObservable(expected);
        });

        it('should initialise with the preserved value for menuOpened(false) if something is set in the storageService', () => {
            storageService.setItem('menuOpened', 'false');

            const loggedInAction = new LoggedInAction();
            actions$ = hot('a', { a: loggedInAction });

            const expectedAction = new AsyncInitAction(<any>{
                menuOpened: false
            });
            const expected = cold('(x)', { x: expectedAction });

            expect(effects.loggedInEffect$).toBeObservable(expected);
        });
    });
});
