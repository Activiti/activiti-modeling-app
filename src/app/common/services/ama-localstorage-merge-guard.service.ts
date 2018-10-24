import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { AmaState } from 'ama-sdk';
import { Store } from '@ngrx/store';
import { LoggedInAction } from '../../store/actions/app.actions';

@Injectable()
export class AmaLocalStorageMergeGuard implements CanActivate {
    constructor(
        protected router: Router,
        protected store: Store<AmaState>
    ) {}

    canActivate():  Observable<boolean> {
        this.store.dispatch(new LoggedInAction());
        return of(true);
    }
}
