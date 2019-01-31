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
import {
    SnackbarErrorAction,
    SNACKBAR_ERROR,
    SNACKBAR_INFO,
    SnackbarInfoAction,
    SnackbarWarningAction,
    SNACKBAR_WARNING } from 'ama-sdk';
import { MatSnackBar } from '@angular/material';
import { TranslationService } from '@alfresco/adf-core';
import { map } from 'rxjs/operators';

@Injectable()
export class SnackbarEffects {

    constructor(private actions$: Actions, private snackBar: MatSnackBar, private translationService: TranslationService) {}

    @Effect({dispatch: false}) infoEffect = this.actions$.pipe(
        ofType<SnackbarInfoAction>(SNACKBAR_INFO),
        map((action: SnackbarInfoAction) => {
            this.snackBar.open(this.translate(action.payload), null, { duration: 2000, panelClass: 'info-snackbar' });
        })
    );

    @Effect({dispatch: false}) warningEffect = this.actions$.pipe(
        ofType<SnackbarWarningAction>(SNACKBAR_WARNING),
        map((action: SnackbarWarningAction) => {
            this.snackBar.open(this.translate(action.payload), null, { duration: 2000, panelClass: 'warning-snackbar' });
        })
    );

    @Effect({dispatch: false}) errorEffect = this.actions$.pipe(
        ofType<SnackbarErrorAction>(SNACKBAR_ERROR),
        map((action: SnackbarErrorAction) => {
            this.snackBar.open(this.translate(action.payload), null, { duration: 2000, panelClass: 'warning-snackbar' });
        })
    );

    private translate(message: string): string {
        return this.translationService.instant(message);
    }
}
