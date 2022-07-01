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
import { TranslationService } from '@alfresco/adf-core';
import { CanDeactivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, Observable, zip } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { AmaState } from '../../../store/app.state';
import { DialogService, MultipleChoiceDialogData } from '@alfresco-dbp/adf-candidates/core/dialog';
import { AmaTitleService } from '../../../services/title.service';
import { selectAppDirtyState, selectSelectedModel } from '../../../store/app.selectors';

export interface CanComponentDeactivate {
    disableCheck?: boolean;
    canDeactivate: () => Observable<boolean>;
}

export enum UNSAVED_MODEL_REDIRECTION_CHOICE {
    WITH_SAVE = 'WITH_SAVE',
    WITHOUT_SAVE = 'WITHOUT_SAVE',
    ABORT = 'ABORT'
}

@Injectable()
export class UnsavedPageGuard
    implements CanDeactivate<CanComponentDeactivate> {

    disableCheck = false;

    constructor(
        private store: Store<AmaState>,
        private dialogService: DialogService,
        private titleService: AmaTitleService,
        private translationService: TranslationService
    ) { }

    canDeactivate(
        component: CanComponentDeactivate,
    ): Observable<boolean> {
        if (this.disableCheck) {
            return of(true);
        } else {
            return this.store.select(selectAppDirtyState).pipe(
                switchMap(dirty => zip(of(dirty), this.store.select(selectSelectedModel))),
                switchMap(([dirty, model]) => {
                    if (dirty && model) {
                        const subtitle = this.translationService.instant('APP.DIALOGS.UNSAVED_PAGE_TITLE');

                        const dialogData: MultipleChoiceDialogData<UNSAVED_MODEL_REDIRECTION_CHOICE> = {
                            subtitle: `${subtitle}: "${model.name || ''}" ?`,
                            choices: [
                                { title: 'APP.DIALOGS.DONT_SAVE', choice: UNSAVED_MODEL_REDIRECTION_CHOICE.WITHOUT_SAVE, color: 'default', spinnable: false },
                                { title: 'APP.DIALOGS.CANCEL', choice: UNSAVED_MODEL_REDIRECTION_CHOICE.ABORT, color: 'default', spinnable: false },
                                { title: 'APP.DIALOGS.SAVE', choice: UNSAVED_MODEL_REDIRECTION_CHOICE.WITH_SAVE, color: 'primary', spinnable: true }
                            ]
                        };

                        return this.dialogService.openMultipleChoiceDialog<UNSAVED_MODEL_REDIRECTION_CHOICE>(dialogData).pipe(
                            switchMap(({ dialogRef, choice }) => this.selectedChoiceActions(component, dialogRef, choice))
                        );
                    } else {
                        return of(true);
                    }
                })
            );
        }
    }

    private selectedChoiceActions(component, dialogRef, choice): Observable<boolean> {
        if (choice === UNSAVED_MODEL_REDIRECTION_CHOICE.ABORT) {
            dialogRef.close();
            return of(false);
        } else if (choice === UNSAVED_MODEL_REDIRECTION_CHOICE.WITHOUT_SAVE) {
            this.titleService.setSavedTitle();
            dialogRef.close();
            return of(true);
        } else {
            if (typeof component.canDeactivate === 'function') {
                return component.canDeactivate().pipe(
                    tap(() => {
                        this.titleService.setSavedTitle();
                        dialogRef.close();
                    }),
                    catchError(() => {
                        dialogRef.close();
                        return of(false);
                    })
                );
            } else {
                this.titleService.setSavedTitle();
                dialogRef.close();
                return of(true);
            }
        }
    }
}
