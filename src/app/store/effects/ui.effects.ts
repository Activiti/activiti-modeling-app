import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { StorageService } from '@alfresco/adf-core';
import { SetMenuAction, SET_MENU, SetAppDirtyStateAction, SET_APP_DIRTY_STATE } from '../actions/ui';
import { tap } from 'rxjs/operators';
import { AmaTitleService } from '../../common/services/title.service';

@Injectable()
export class UiEffects {
    constructor(
        private actions$: Actions,
        private storageService: StorageService,
        private titleService: AmaTitleService
    ) {}

    @Effect({ dispatch: false })
    setMenu = this.actions$.pipe(
        ofType<SetMenuAction>(SET_MENU),
        tap(action => {
            this.storageService.setItem('menuOpened', action.payload.toString());
        })
    );

    @Effect({ dispatch: false })
    SetAppDirtyStateEffect = this.actions$.pipe(
        ofType<SetAppDirtyStateAction>(SET_APP_DIRTY_STATE),
        tap(action => {
            if (action.payload) {
                this.titleService.setUnsavedTitle();
            } else {
                this.titleService.setSavedTitle();
            }
        })
    );


}
