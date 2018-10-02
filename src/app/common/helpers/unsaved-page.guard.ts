import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AmaState } from 'ama-sdk';
import { DialogService, ConfirmDialogData } from '../services/dialog.service';
import { AmaTitleService } from '../services/title.service';
import { selectAppDirtyState } from '../../store/selectors/app.selectors';

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
