import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AmaState } from 'ama-sdk';
import { ShowProcessesAction } from '../../store/actions/processes';
import { OpenFilterAction } from '../../store/actions/application';
import { PROCESS } from 'ama-sdk';

@Injectable()
export class ProcessesLoaderGuard implements CanActivate {
    constructor(private store: Store<AmaState>) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        const applicationId = route.params.applicationId;
        this.store.dispatch(new ShowProcessesAction(applicationId));
        this.store.dispatch(new OpenFilterAction(PROCESS));

        return of(true);
    }
}
