 /*!
 * @license
 * Copyright 2018 Alfresco, Inc. and/or its affiliates.
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

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { catchError, switchMap, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { of, Observable, zip } from 'rxjs';
import { ApplicationEditorService } from '../../services/application-editor.service';
import {
    GetProcessesAttemptAction,
    GET_PROCESSES_ATTEMPT,
    CreateProcessAttemptAction,
    CREATE_PROCESS_ATTEMPT,
    GetProcessesSuccessAction,
    CreateProcessSuccessAction,
    SHOW_PROCESSES,
    ShowProcessesAction,
    DeleteProcessAttemptAction,
    DELETE_PROCESS_ATTEMPT,
    DeleteProcessSuccessAction,
    DELETE_PROCESS_SUCCESS,
    UploadProcessAttemptAction,
    UPLOAD_PROCESS_ATTEMPT
} from '../actions/processes';
import {
    EntityDialogForm,
    UploadFileAttemptPayload,
    SetAppDirtyStateAction,
    BaseEffects,
    selectSelectedAppId,
    AmaState,
    SnackbarErrorAction,
    SnackbarInfoAction,
    ModelClosedAction,
    PROCESS
 } from 'ama-sdk';
import { selectProcessesLoaded } from '../../../process-editor/store/process-editor.selectors';


@Injectable()
export class ProcessesEffects extends BaseEffects {
    constructor(
        private store: Store<AmaState>,
        private actions$: Actions,
        private applicationEditorService: ApplicationEditorService,
        protected logService: LogService,
        protected router: Router
    ) {
        super(router, logService);
    }

    @Effect()
    showProcessesEffect = this.actions$.pipe(
        ofType<ShowProcessesAction>(SHOW_PROCESSES),
        map(action => action.applicationId),
        switchMap(applicationId => zip(of(applicationId), this.store.select(selectProcessesLoaded))),
        switchMap(([applicationId, loaded]) => {
            if (!loaded) {
                return of(new GetProcessesAttemptAction(applicationId));
            } else {
                return of();
            }
        })
    );

    @Effect()
    getProcessesEffect = this.actions$.pipe(
        ofType<GetProcessesAttemptAction>(GET_PROCESSES_ATTEMPT),
        switchMap(action => this.getProcesses(action.applicationId))
    );

    @Effect()
    createProcessEffect = this.actions$.pipe(
        ofType<CreateProcessAttemptAction>(CREATE_PROCESS_ATTEMPT),
        mergeMap(action => zip(of(action.payload), this.store.select(selectSelectedAppId))),
        mergeMap(([form, appId]) => this.createProcess(form, appId))
    );

    @Effect()
    uploadProcessEffect = this.actions$.pipe(
        ofType<UploadProcessAttemptAction>(UPLOAD_PROCESS_ATTEMPT),
        switchMap(action => this.uploadProcess(action.payload))
    );

    @Effect()
    deleteProcessEffect = this.actions$.pipe(
        ofType<DeleteProcessAttemptAction>(DELETE_PROCESS_ATTEMPT),
        map(action => action.processId),
        mergeMap(processId => this.deleteProcess(processId))
    );

    @Effect({ dispatch: false })
    deleteProcessSuccessEffect = this.actions$.pipe(
        ofType<DeleteProcessSuccessAction>(DELETE_PROCESS_SUCCESS),
        withLatestFrom(this.store.select(selectSelectedAppId)),
        map(([action, applicationId]) => {
            this.router.navigate(['/applications', applicationId]);
        })
    );

    private uploadProcess(payload: UploadFileAttemptPayload): Observable<void | {} | SnackbarInfoAction | CreateProcessSuccessAction> {
        return this.applicationEditorService.uploadProcess(payload).pipe(
            switchMap(process => [
                new CreateProcessSuccessAction(process),
                new SnackbarInfoAction('APP.APPLICATION.UPLOAD_FILE_SUCCESS')
            ]),
            catchError(e =>
                this.genericErrorHandler(this.handleError.bind(this, 'APP.APPLICATION.ERROR.UPLOAD_FILE'), e)
            )
        );
    }

    private getProcesses(applicationId: string): Observable<{} | GetProcessesSuccessAction> {
        return this.applicationEditorService.fetchProcesses(applicationId).pipe(
            switchMap(processes => of(new GetProcessesSuccessAction(processes))),
            catchError(e =>
                this.genericErrorHandler(this.handleError.bind(this, 'APP.APPLICATION.ERROR.LOAD_MODELS'), e)
            )
        );
    }

    private deleteProcess(processId: string): Observable<{} | SnackbarInfoAction | DeleteProcessSuccessAction> {
        return this.applicationEditorService.deleteProcess(processId).pipe(
            switchMap(() => [
                new DeleteProcessSuccessAction(processId),
                new SetAppDirtyStateAction(false),
                new ModelClosedAction({ id: processId, type: PROCESS }),
                new SnackbarInfoAction('APP.APPLICATION.PROCESS_DIALOG.PROCESS_DELETED')
            ]),
            catchError(e =>
                this.genericErrorHandler(this.handleError.bind(this, 'APP.APPLICATION.ERROR.DELETE_PROCESS'), e)
            )
        );
    }

    private createProcess(form: Partial<EntityDialogForm>, appId: string): Observable<{} | SnackbarInfoAction | CreateProcessSuccessAction> {
        return this.applicationEditorService.createProcess(form, appId).pipe(
            switchMap((process) => [
                new CreateProcessSuccessAction(process),
                new SnackbarInfoAction('APP.APPLICATION.PROCESS_DIALOG.PROCESS_CREATED')
            ]),
            catchError(e => this.genericErrorHandler(this.handleProcessCreationError.bind(this), e))
        );
    }

    private handleError(userMessage): Observable<SnackbarErrorAction> {
        return of(new SnackbarErrorAction(userMessage));
    }

    private handleProcessCreationError(error): Observable<SnackbarErrorAction> {
        let errorMessage;

        if (error.status === 409) {
            errorMessage = 'APP.APPLICATION.ERROR.CREATE_PROCESS.DUPLICATION';
        } else {
            errorMessage = 'APP.APPLICATION.ERROR.CREATE_PROCESS.GENERAL';
        }

        return of(new SnackbarErrorAction(errorMessage));
    }
}
