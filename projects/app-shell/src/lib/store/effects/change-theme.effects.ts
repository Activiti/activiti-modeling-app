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

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { StorageService } from '@alfresco/adf-core';
import { ChangeThemeAction, ChangeThemePayload, CHANGE_THEME } from '@alfresco-dbp/modeling-shared/sdk';

@Injectable()
export class ChangeThemeEffects {
    constructor(private actions$: Actions, private storageService: StorageService) {}

    @Effect({ dispatch: false })
    changingThemeEffect = this.actions$.pipe(
        ofType<ChangeThemeAction>(CHANGE_THEME),
        map(action => this.saveToLocalStorage(action.payload))
    );

    private saveToLocalStorage(payload: ChangeThemePayload): void {
        this.storageService.setItem('selectedTheme', payload.theme);
    }
}
