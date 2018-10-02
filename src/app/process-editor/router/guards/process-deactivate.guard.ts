import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AmaState } from 'ama-sdk';
import { SelectModelerElementAction } from '../../store/process-editor.actions';

export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class ProcessDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
    constructor(private store: Store<AmaState>) {}

    canDeactivate(component: CanComponentDeactivate): boolean | Observable<boolean> | Promise<boolean> {
        this.store.dispatch(new SelectModelerElementAction(null));
        return true;
    }
}
