import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { tap, switchMap } from 'rxjs/operators';
import { LogoutAction, AppActionTypes, AsyncInitAction, LoggedInAction } from '../actions/app.actions';
import { AmaAuthenticationService } from 'ama-sdk';
import { StorageService } from '@alfresco/adf-core';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private storageService: StorageService,
        private amaAuthenticationService: AmaAuthenticationService
    ) {}

    @Effect({ dispatch: false })
    logoutEffect$ = this.actions$.pipe(
        ofType<LogoutAction>(AppActionTypes.Logout),
        tap(() => {
            this.amaAuthenticationService.logout();
        })
    );

    @Effect()
    loggedInEffect$ = this.actions$.pipe(
        ofType<LoggedInAction>(AppActionTypes.LoggedIn),
        switchMap(this.setupFromStorage.bind(this))
    );


    private setupFromStorage() {
        const menuOpened = JSON.parse(this.storageService.getItem('menuOpened'));

        if (this.amaAuthenticationService.isBasicAuthType()) {
            return of(new AsyncInitAction({ menuOpened }));
        } else {
            return of();
        }
    }
}
