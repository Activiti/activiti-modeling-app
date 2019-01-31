 /*!
 * @license
 * Copyright 2019 Alfresco, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AmaState } from '../store/app.state';
import { DialogService } from '../confirmation-dialog/services/dialog.service';
import { AmaTitleService } from '../services/title.service';
import { selectAppDirtyState } from '../store/app.selectors';
import { ConfirmDialogData } from '../store/app.actions';

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

                    return this.dialogService.confirm(dialogData, <any>true).pipe(
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
