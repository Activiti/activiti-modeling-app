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
import { Effect, Actions, ofType } from '@ngrx/effects';
import { TabManagerService, UpdateTabDirtyState, UpdateTabTitle, UPDATE_TAB_DIRTY_STATE, UPDATE_TAB_TITLE } from '@alfresco-dbp/modeling-shared/sdk';
import { tap } from 'rxjs/operators';

@Injectable()
export class TabEffects {
    constructor(
        private actions$: Actions,
        private tabManagerService: TabManagerService
    ) {}

    @Effect({ dispatch: false })
    updateTabTitle = this.actions$.pipe(
        ofType<UpdateTabTitle>(UPDATE_TAB_TITLE),
        tap(action => {
            this.tabManagerService.updateTabTitle(action.title, action.modelId);
        })
    );

    @Effect({ dispatch: false })
    updateTabDirtyState = this.actions$.pipe(
        ofType<UpdateTabDirtyState>(UPDATE_TAB_DIRTY_STATE),
        tap(action => {
            this.tabManagerService.updateTabDirtyState(action.dirtyState, action.modelId);
        })
    );
}
