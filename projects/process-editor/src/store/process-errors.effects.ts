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

import { ofType, Actions, Effect } from '@ngrx/effects';
import { switchMap, tap, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
    AmaState,
    SetAppDirtyStateAction,
    selectSelectedProcess
} from '@alfresco-dbp/modeling-shared/sdk';
import { DialogService } from '@alfresco-dbp/adf-candidates/core/dialog';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { OpenProcessErrorsDialogAction, OPEN_PROCESS_ERRORS_DIALOG } from './process-errors.actions';
import { ProcessErrorsDialogComponent } from '../components/process-modeler/process-errors/process-errors-dialog.component';

@Injectable()
export class ProcessErrorsEffects {

    constructor(
        private actions$: Actions,
        private dialogService: DialogService,
        private store: Store<AmaState>) {}

    @Effect({ dispatch: false })
    openProcessErrorsDialogEffect = this.actions$.pipe(
        ofType<OpenProcessErrorsDialogAction>(OPEN_PROCESS_ERRORS_DIALOG),
        switchMap(() => this.store.select(selectSelectedProcess).pipe(take(1))),
        tap(() => this.openProcessErrorsDialog())
    );

    private openProcessErrorsDialog() {
        const propertiesUpdate$ = new Subject<Bpmn.DiagramElement[]>();
        const columns = ['id', 'name', 'errorCode', 'delete'];

        this.dialogService.openDialog(ProcessErrorsDialogComponent, {
            disableClose: true,
            height: '530px',
            width: '1000px',
            data: { columns, propertiesUpdate$ },
        });

        propertiesUpdate$.subscribe(() => {
            this.store.dispatch(new SetAppDirtyStateAction(true));
        });
    }
}
