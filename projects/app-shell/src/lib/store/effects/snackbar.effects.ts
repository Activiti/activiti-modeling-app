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

import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import {
    SnackbarErrorAction,
    SNACKBAR_ERROR,
    SNACKBAR_INFO,
    SnackbarInfoAction,
    SnackbarWarningAction,
    SNACKBAR_WARNING
} from '@alfresco-dbp/modeling-shared/sdk';
import { NotificationService } from '@alfresco/adf-core';
import { of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable()
export class SnackbarEffects {

    constructor(private actions$: Actions, private notificationService: NotificationService) {
    }

     infoEffect = createEffect(() => this.actions$.pipe(
        ofType<SnackbarInfoAction>(SNACKBAR_INFO),
        mergeMap(({ message, params, action }) => zip(of(action), this.notificationService.showInfo(message, action?.name, params).onAction())),
        mergeMap(([action]) => of(...action.actions))
    ), { dispatch: true });

     warningEffect = createEffect(() => this.actions$.pipe(
        ofType<SnackbarWarningAction>(SNACKBAR_WARNING),
        map(({ message, params }) => {
            this.notificationService.showWarning(message, null, params);
        })
    ), { dispatch: false });

     errorEffect = createEffect(() => this.actions$.pipe(
        ofType<SnackbarErrorAction>(SNACKBAR_ERROR),
        map(({ message, params }) => {
            this.notificationService.showError(message, null, params);
        })
    ), { dispatch: false });
}
