import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { GetApplicationAttemptAction } from '../../store/actions/application';
import { ApplicationEditorState } from 'ama-sdk';
import { ShowProcessesAction } from '../../store/actions/processes';

@Injectable()
export class ApplicationLoaderGuard implements CanActivate {
    constructor(private store: Store<ApplicationEditorState>) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        const applicationId = route.params.applicationId;
        this.store.dispatch(new GetApplicationAttemptAction(applicationId));
        this.store.dispatch(new ShowProcessesAction(applicationId));
        return of(true);
    }
}
