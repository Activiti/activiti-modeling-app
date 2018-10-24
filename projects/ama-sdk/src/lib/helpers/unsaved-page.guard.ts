import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AmaState } from '../store/app.state';
import { DialogService } from '../confirmation-dialog/public_api';
import { AmaTitleService } from '../services/public_api';
import { selectAppDirtyState, ConfirmDialogData } from '../store/public_api';

export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class UnsavedPageGuard
    implements CanDeactivate<CanComponentDeactivate> {

    constructor(
        private store: Store<AmaState>,
        private dialogService: DialogService,
        private titleService: AmaTitleService
    ) {}

    canDeactivate(component: CanComponentDeactivate): Observable<boolean> {
        return this.store.select(selectAppDirtyState).pipe(
            switchMap(dirty => {
                if (dirty) {
                    const dialogData: ConfirmDialogData = {
                        subtitle: 'APP.DIALOGS.CONFIRM.CUSTOM.UNSAVED_PAGE'
                    };

                    return this.dialogService.confirm(dialogData).pipe(
                        tap(response => {
                            if (response) {
                                this.titleService.setSavedTitle();
                            }
                        })
                    );
                } else {
                    return of(true);
                }
            })
        );
    }
}
