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

import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { LogoutAction, AppActionTypes, AsyncInitAction, LoggedInAction } from '../actions/app.actions';
import { AuthenticationService, StorageService } from '@alfresco/adf-core';
import { appThemes } from '../../common/components/themes';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private storageService: StorageService,
        private authService: AuthenticationService
    ) {}


    logoutEffect$ = createEffect(() => this.actions$.pipe(
        ofType<LogoutAction>(AppActionTypes.Logout),
        map(() => this.authService.logout())
    ), { dispatch: false });


    loggedInEffect$ = createEffect(() => this.actions$.pipe(
        ofType<LoggedInAction>(AppActionTypes.LoggedIn),
        switchMap(this.setupFromStorage.bind(this))
    ));

    private setupFromStorage() {
        const menuOpened = JSON.parse(this.storageService.getItem('menuOpened')),
            preservedTheme = this.storageService.getItem('selectedTheme') || 'light-theme',
            selectedTheme = appThemes.find(appTheme => appTheme.className === preservedTheme),
            showConnectorsWithTemplate = JSON.parse(this.storageService.getItem('showConnectorsWithTemplate')) || false;

        return of(new AsyncInitAction({ selectedTheme, menuOpened, showConnectorsWithTemplate }));
    }
}
