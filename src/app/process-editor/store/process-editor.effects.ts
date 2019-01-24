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
import { catchError, switchMap, map, filter, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { LogService } from '@alfresco/adf-core';
import { Observable } from 'rxjs';

import {
    GetProcessSuccessAction,
    UPDATE_PROCESS_ATTEMPT,
    UpdateProcessAttemptAction,
    UpdateProcessSuccessAction,
    GET_PROCESS_ATTEMPT,
    GetProcessAttemptAction,
    DownloadProcessAction,
    DOWNLOAD_PROCESS_DIAGRAM,
    CHANGED_PROCESS_DIAGRAM,
    SelectModelerElementAction,
    ChangedProcessAction,
    UpdateProcessPayload,
    ValidateProcessAttemptAction,
    VALIDATE_PROCESS_ATTEMPT,
    ValidateProcessPayload,
    ShowProcessesAction,
    SHOW_PROCESSES,
    GetProcessesAttemptAction,
    GET_PROCESSES_ATTEMPT,
    CREATE_PROCESS_ATTEMPT,
    CreateProcessAttemptAction,
    UploadProcessAttemptAction,
    UPLOAD_PROCESS_ATTEMPT,
    DELETE_PROCESS_ATTEMPT,
    DeleteProcessAttemptAction,
    DELETE_PROCESS_SUCCESS,
    DeleteProcessSuccessAction,
    CreateProcessSuccessAction,
    GetProcessesSuccessAction
} from './process-editor.actions';
import { BaseEffects, OpenConfirmDialogAction, ModelOpenedAction, UploadFileAttemptPayload, ModelClosedAction, PROCESS, EntityDialogForm } from 'ama-sdk';
import { ProcessEditorService } from '../services/process-editor.service';
import { SetAppDirtyStateAction } from 'ama-sdk';
import { forkJoin } from 'rxjs';
import { ProcessModelerService } from '../services/process-modeler.service';
import { selectSelectedElement, selectProcessesLoaded } from './process-editor.selectors';
import { Store } from '@ngrx/store';
import { zip } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Process, SnackbarErrorAction, SnackbarInfoAction } from 'ama-sdk';
import { selectSelectedAppId, AmaState, selectSelectedProcess, createProcessName } from 'ama-sdk';

@Injectable()
export class ProcessEditorEffects extends BaseEffects {
    constructor(
        private store: Store<AmaState>,
        private actions$: Actions,
        private processEditorService: ProcessEditorService,
        private processModelerService: ProcessModelerService,
        logService: LogService,
        router: Router
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

    @Effect()
    updateProcessEffect = this.actions$.pipe(
        ofType<UpdateProcessAttemptAction>(UPDATE_PROCESS_ATTEMPT),
        map(action => action.payload),
        mergeMap(payload => zip(of(payload), this.store.select(selectSelectedProcess), this.store.select(selectSelectedAppId))),
        mergeMap(([payload, process, appId]) => this.updateProcess(payload, process, appId))
    );

    @Effect()
    validateProcessEffect = this.actions$.pipe(
        ofType<ValidateProcessAttemptAction>(VALIDATE_PROCESS_ATTEMPT),
        mergeMap(action => this.validateProcess(action.payload))
    );

    @Effect()
    getProcessEffect = this.actions$.pipe(
        ofType<GetProcessAttemptAction>(GET_PROCESS_ATTEMPT),
        mergeMap(action => zip(of(action.payload), this.store.select(selectSelectedAppId))),
        mergeMap(([processId, appId]) =>  this.getProcess(processId, appId))
    );

    @Effect({ dispatch: false })
    downloadProcessEffect = this.actions$.pipe(
        ofType<DownloadProcessAction>(DOWNLOAD_PROCESS_DIAGRAM),
        map(({ process }) => this.downloadProcessDiagram(process.id, process.name))
    );

    @Effect()
    changedProcessDiagramEffect = this.actions$.pipe(
        ofType(CHANGED_PROCESS_DIAGRAM),
        mergeMap(() => of(new SetAppDirtyStateAction(true)))
    );

    @Effect()
    changedElementEffect = this.actions$.pipe(
        ofType<ChangedProcessAction>(CHANGED_PROCESS_DIAGRAM),
        map(action => action.element),
        mergeMap(element => zip(of(element), this.store.select(selectSelectedElement))),
        filter(([element, selected]) => {
            return (
                selected !== null &&
                selected.id === element.id &&
                (selected.name !== element.name || selected.type !== element.type)
            );
        }),
        mergeMap(([element, selected]) => of(new SelectModelerElementAction(element)))
    );

    private validateProcess(payload: ValidateProcessPayload) {
        return this.processEditorService.validate(payload.processId, payload.content).pipe(
            switchMap(() => [ payload.action ]),
            catchError(response => [ new OpenConfirmDialogAction({
                dialogData: {
                    title: 'APP.DIALOGS.CONFIRM.TITLE',
                    subtitle: 'APP.DIALOGS.ERROR.SUBTITLE',
                    errors: JSON.parse(response.message).errors.map(error => error.description)
                },
                action: payload.action
            })])
        );
    }

    private updateProcess(payload: UpdateProcessPayload, process: Process, appId: string): Observable<SnackbarErrorAction | {}> {
        return this.processEditorService.update(
            payload.processId,
            { ...process, ...payload.metadata },
            payload.content,
            appId
        ).pipe(
            switchMap(() => [
                new UpdateProcessSuccessAction({ id: payload.processId, changes: payload.metadata }, payload.content),
                new SetAppDirtyStateAction(false),
                new SnackbarInfoAction('APP.PROCESS_EDITOR.PROCESS_UPDATED')
            ]),
            catchError(e => this.genericErrorHandler(this.handleProcessUpdatingError.bind(this), e))
        );
    }

    private downloadProcessDiagram(processId: string, processName: string) {
        const name = createProcessName(processName);
        return this.processModelerService
            .export()
            .then(data => this.processEditorService.downloadDiagram(name, data))
            .catch(err => {
                this.genericErrorHandler(this.handleError.bind(this, 'APP.PROCESSES.ERRORS.DOWNLOAD_DIAGRAM'), err);
            });
    }

    private getProcess(processId: string, appId: string): Observable<GetProcessSuccessAction | SnackbarErrorAction> {
        const processDetails$ = this.processEditorService.getDetails(processId, appId),
            processDiagram$ = this.processEditorService.getDiagram(processId);

        return forkJoin(processDetails$, processDiagram$).pipe(
            switchMap(([process, diagram]) => [
                new GetProcessSuccessAction({process, diagram}),
                new ModelOpenedAction({ id: process.id, type: process.type }),
                new SetAppDirtyStateAction(false)
            ]),
            catchError<any, SnackbarErrorAction>(e =>
                this.genericErrorHandler(this.handleError.bind(this, 'APP.PROCESS_EDITOR.ERRORS.LOAD_DIAGRAM'), e)
            )
        );
    }

    private uploadProcess(payload: UploadFileAttemptPayload): Observable<void | {} | SnackbarInfoAction | CreateProcessSuccessAction> {
        return this.processEditorService.upload(payload).pipe(
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
        return this.processEditorService.getAll(applicationId).pipe(
            switchMap(processes => of(new GetProcessesSuccessAction(processes))),
            catchError(e =>
                this.genericErrorHandler(this.handleError.bind(this, 'APP.APPLICATION.ERROR.LOAD_MODELS'), e)
            )
        );
    }

    private deleteProcess(processId: string): Observable<{} | SnackbarInfoAction | DeleteProcessSuccessAction> {
        return this.processEditorService.delete(processId).pipe(
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
        return this.processEditorService.create(form, appId).pipe(
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

    private handleProcessUpdatingError(error): Observable<SnackbarErrorAction> {
        let errorMessage;

        if (error.status === 409) {
            errorMessage = 'APP.APPLICATION.ERROR.UPDATE_PROCESS.DUPLICATION';
        } else {
            errorMessage = 'APP.APPLICATION.ERROR.UPDATE_PROCESS.GENERAL';
        }

        return of(new SnackbarErrorAction(errorMessage));
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
