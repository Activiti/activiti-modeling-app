import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { ShowApplicationsAction } from '../../store/actions/applications';
import { AmaState } from 'ama-sdk';

@Injectable()
export class ApplicationsLoaderGuard implements CanActivate {

    constructor(private store: Store<AmaState>) { }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        this.store.dispatch(new ShowApplicationsAction());
        return of(true);
    }
}
