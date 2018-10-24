import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { SelectApplicationAction } from '../../store/actions/application';
import { AmaState } from 'ama-sdk';


@Injectable()
export class SelectedApplicationSetterGuard implements CanActivate {

    constructor(private store: Store<AmaState>) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        const applicationId = route.params.applicationId;
        this.store.dispatch(new SelectApplicationAction(applicationId));
        return of(true);
    }
}
