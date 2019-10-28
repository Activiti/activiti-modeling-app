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
import { UPDATE_SETTINGS, UpdateSettingsAction, UpdateSettingsPayload } from '../actions/settings';

@Injectable()
export class SettingsEffects {
    constructor(private actions$: Actions, private storageService: StorageService) {}

    @Effect({ dispatch: false })
    updateSettingsEffect = this.actions$.pipe(
        ofType<UpdateSettingsAction>(UPDATE_SETTINGS),
        map(action => this.saveToLocalStorage(action.payload))
    );

    private saveToLocalStorage(payload: UpdateSettingsPayload): void {
        this.storageService.setItem('selectedTheme', payload.theme);
    }
}
