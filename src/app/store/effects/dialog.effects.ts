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
import { map, switchMap } from 'rxjs/operators';
import {
    OPEN_DIALOG,
    OpenDialogAction,
    CLOSE_ALL_DIALOGS,
    CloseAllDialogsAction,
} from '../actions';
import { OPEN_CONFIRM_DIALOG, OpenConfirmDialogAction, DialogService, ConfirmDialogData, EntityDialogComponent, LoadApplicationAction } from 'ama-sdk';
import { Action } from '@ngrx/store';
import { OpenEntityDialogAction, OPEN_ENTITY_DIALOG } from '../actions/dialog';

@Injectable()
export class DialogEffects {
    constructor(private actions$: Actions, private dialogService: DialogService) {}

    @Effect({ dispatch: false })
    openDialog = this.actions$.pipe(
        ofType<OpenDialogAction<any>>(OPEN_DIALOG),
        map(action => this.dialogService.openDialog(action.dialogContent, action.dialogConfig))
    );

    @Effect({ dispatch: false })
    closeDialog = this.actions$.pipe(
        ofType<CloseAllDialogsAction>(CLOSE_ALL_DIALOGS),
        map(() => this.dialogService.closeAll())
    );

    @Effect()
    confirmDialogEffect = this.actions$.pipe(
        ofType<OpenConfirmDialogAction>(OPEN_CONFIRM_DIALOG),
        switchMap(action => this.openConfirmDialog(action.payload.action, action.payload.dialogData))
    );

    @Effect({ dispatch: false })
    openEntityDialogEffect = this.actions$.pipe(
        ofType<OpenEntityDialogAction>(OPEN_ENTITY_DIALOG),
        map(action => action.payload),
        map(data => this.dialogService.openDialog(EntityDialogComponent, { data }))
    );

    private openConfirmDialog(action: Action, dialogData: ConfirmDialogData) {
        return this.dialogService.confirm(dialogData, action).pipe(
            switchMap(confirmation =>  confirmation ? [new LoadApplicationAction(false), action] : [new LoadApplicationAction(false) ])
        );
    }
}
