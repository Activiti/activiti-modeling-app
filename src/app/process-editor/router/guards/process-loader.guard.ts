import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { ProcessEditorState } from '../../store/process-editor.state';
import { GetProcessAttemptAction } from '../../store/process-editor.actions';

@Injectable()
export class ProcessLoaderGuard implements CanActivate {

    constructor(private store: Store<ProcessEditorState>) { }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        const processId = route.params.processId;
        this.store.dispatch(new GetProcessAttemptAction(processId));
        return of(true);
    }
}
