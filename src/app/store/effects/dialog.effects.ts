import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import {
    OPEN_DIALOG,
    OpenDialogAction,
    CLOSE_ALL_DIALOGS,
    CloseAllDialogsAction,
} from '../actions';
import { OPEN_CONFIRM_DIALOG, OpenConfirmDialogAction, DialogService } from 'ama-sdk';
import { Action } from '@ngrx/store';
import { OpenEntityDialogAction, OPEN_ENTITY_DIALOG } from '../actions/dialog';
import { EntityDialogComponent } from 'ama-sdk';

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
        switchMap(action => this.openConfirmDialog(action.payload))
    );

    @Effect({ dispatch: false })
    openEntityDialogEffect = this.actions$.pipe(
        ofType<OpenEntityDialogAction>(OPEN_ENTITY_DIALOG),
        map(action => action.payload),
        map(data => this.dialogService.openDialog(EntityDialogComponent, { data }))
    );

    private openConfirmDialog({ action, dialogData }): Observable<Action> {
        return this.dialogService.confirm(dialogData).pipe(
            switchMap(confirmation => {
                if (confirmation) {
                    return of(action);
                } else {
                    return of();
                }
            })
        );
    }
}
