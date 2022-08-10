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
import { StorageService } from '@alfresco/adf-core';
import { SetAppDirtyStateAction, SET_APP_DIRTY_STATE, AmaTitleService, SET_MENU, SetMenuAction } from '@alfresco-dbp/modeling-shared/sdk';
import { tap } from 'rxjs/operators';

@Injectable()
export class UiEffects {
    constructor(
        private actions$: Actions,
        private storageService: StorageService,
        private titleService: AmaTitleService
    ) {}


    setMenu = createEffect(() => this.actions$.pipe(
        ofType<SetMenuAction>(SET_MENU),
        tap(action => {
            this.storageService.setItem('menuOpened', action.payload.toString());
        })
    ), { dispatch: false });


    SetAppDirtyStateEffect = createEffect(() => this.actions$.pipe(
        ofType<SetAppDirtyStateAction>(SET_APP_DIRTY_STATE),
        tap(action => {
            if (action.payload) {
                this.titleService.setUnsavedTitle();
            } else {
                this.titleService.setSavedTitle();
            }
        })
    ), { dispatch: false });

}
