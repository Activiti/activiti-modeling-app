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

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable, Inject } from '@angular/core';
import { catchError, switchMap, map, filter, withLatestFrom, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { LogService, TranslationService } from '@alfresco/adf-core';
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
    GetProcessesSuccessAction,
    CREATE_PROCESS_SUCCESS,
    RemoveDiagramElementAction,
    REMOVE_DIAGRAM_ELEMENT,
    RemoveElementMappingAction,
    UpdateProcessFailedAction
} from './process-editor.actions';
import {
    BaseEffects,
    OpenConfirmDialogAction,
    ModelOpenedAction,
    UploadFileAttemptPayload,
    ModelClosedAction,
    PROCESS, EntityDialogForm,
    UPDATE_SERVICE_PARAMETERS,
    ProcessModelerServiceToken,
    ProcessModelerService,
    selectOpenedModel,
    BpmnElement,
} from 'ama-sdk';
import { ProcessEditorService } from '../services/process-editor.service';
import { SetAppDirtyStateAction } from 'ama-sdk';
import { forkJoin } from 'rxjs';
import { selectSelectedElement, selectProcessesLoaded } from './process-editor.selectors';
import { Store } from '@ngrx/store';
import { zip } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Process, SnackbarErrorAction, SnackbarInfoAction } from 'ama-sdk';
import { selectSelectedProjectId, AmaState, selectSelectedProcess, createProcessName } from 'ama-sdk';
import { getProcessLogInitiator } from '../services/process-editor.constants';
import { logError, logInfo } from 'ama-sdk';


@Injectable()
export class ProcessEditorEffects extends BaseEffects {
    constructor(
        private store: Store<AmaState>,
        private actions$: Actions,
        private processEditorService: ProcessEditorService,
        private translation: TranslationService,
        @Inject(ProcessModelerServiceToken) private processModelerService: ProcessModelerService,
        logService: LogService,
        router: Router
    ) {
        super(router, logService);
    }

    @Effect()
    showProcessesEffect = this.actions$.pipe(
        ofType<ShowProcessesAction>(SHOW_PROCESSES),
        map(action => action.projectId),
        switchMap(projectId => zip(of(projectId), this.store.select(selectProcessesLoaded))),
        switchMap(([projectId, loaded]) => loaded ? of() : of(new GetProcessesAttemptAction(projectId)))
    );

    @Effect()
    getProcessesEffect = this.actions$.pipe(
        ofType<GetProcessesAttemptAction>(GET_PROCESSES_ATTEMPT),
        switchMap(action => this.getProcesses(action.projectId))
    );

    @Effect()
    removeDiagramElementEffect = this.actions$.pipe(
        ofType<RemoveDiagramElementAction>(REMOVE_DIAGRAM_ELEMENT),
        filter(action => [BpmnElement.ServiceTask, BpmnElement.CallActivity].includes(<BpmnElement>action.element.type)),
        mergeMap(action => zip(of(action), this.store.select(selectOpenedModel))),
        mergeMap(([action, process]) => of(new RemoveElementMappingAction(action.element.id, process.id)))
    );

    @Effect()
    createProcessEffect = this.actions$.pipe(
        ofType<CreateProcessAttemptAction>(CREATE_PROCESS_ATTEMPT),
        mergeMap(action => zip(of(action), this.store.select(selectSelectedProjectId))),
        mergeMap(([action, projectId]) => this.createProcess(action.payload, action.navigateTo, projectId))
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
        withLatestFrom(this.store.select(selectSelectedProjectId)),
        map(([action, projectId]) => {
            this.router.navigate(['/projects', projectId]);
        })
    );

    @Effect({ dispatch: false })
    createProcessSuccessEffect = this.actions$.pipe(
        ofType<CreateProcessSuccessAction>(CREATE_PROCESS_SUCCESS),
        withLatestFrom(this.store.select(selectSelectedProjectId)),
        tap(([action, projectId]) => {
            if (action.navigateTo) {
                this.router.navigate(['/projects', projectId, 'process', action.process.id]);
            }
        })
    );

    @Effect()
    updateProcessEffect = this.actions$.pipe(
        ofType<UpdateProcessAttemptAction>(UPDATE_PROCESS_ATTEMPT),
        map(action => action.payload),
        mergeMap(payload => zip(of(payload), this.store.select(selectSelectedProcess), this.store.select(selectSelectedProjectId))),
        mergeMap(([payload, process, projectId]) => this.updateProcess(payload, process, projectId))
    );

    @Effect()
    validateProcessEffect = this.actions$.pipe(
        ofType<ValidateProcessAttemptAction>(VALIDATE_PROCESS_ATTEMPT),
        mergeMap(action => this.validateProcess(action.payload))
    );

    @Effect()
    getProcessEffect = this.actions$.pipe(
        ofType<GetProcessAttemptAction>(GET_PROCESS_ATTEMPT),
        mergeMap(action => zip(of(action.payload), this.store.select(selectSelectedProjectId))),
        mergeMap(([processId, projectId]) =>  this.getProcess(processId, projectId))
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
     updateServiceParameterSEffect = this.actions$.pipe(
        ofType(UPDATE_SERVICE_PARAMETERS),
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
        return this.processEditorService.validate(payload.processId, payload.content, payload.extensions).pipe(
            switchMap(() => [ payload.action ]),
            catchError(response => {
                const errors = JSON.parse(response.message).errors.map(error => error.description);
                return [
                    new OpenConfirmDialogAction({
                        dialogData: {
                            title: payload.title || 'APP.DIALOGS.CONFIRM.TITLE',
                            subtitle: 'APP.DIALOGS.ERROR.SUBTITLE',
                            errors
                        },
                        action: payload.action
                    }),
                    logError(getProcessLogInitiator(), errors)
                ];
            })
        );
    }

    private updateProcess(payload: UpdateProcessPayload, process: Process, projectId: string): Observable<SnackbarErrorAction | {}> {
        return this.processEditorService.update(
            payload.processId,
            { ...process, ...payload.metadata },
            payload.content,
            projectId
        ).pipe(
            switchMap(() => [
                new UpdateProcessSuccessAction({ id: payload.processId, changes: payload.metadata }, payload.content),
                new SetAppDirtyStateAction(false),
                logInfo(getProcessLogInitiator(), this.translation.instant('PROCESS_EDITOR.PROCESS_UPDATED')),
                new SnackbarInfoAction('PROCESS_EDITOR.PROCESS_UPDATED')
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

    private getProcess(processId: string, projectId: string) {
        const processDetails$ = this.processEditorService.getDetails(processId, projectId),
            processDiagram$ = this.processEditorService.getDiagram(processId);

        return forkJoin(processDetails$, processDiagram$).pipe(
            switchMap(([process, diagram]) => [
                new GetProcessSuccessAction({process, diagram}),
                new ModelOpenedAction({ id: process.id, type: process.type }),
                new SetAppDirtyStateAction(false)
            ]),
            catchError(e =>
                this.genericErrorHandler(this.handleError.bind(this, 'PROCESS_EDITOR.ERRORS.LOAD_DIAGRAM'), e)
            )
        );
    }

    private uploadProcess(payload: UploadFileAttemptPayload): Observable<void | {} | SnackbarInfoAction | CreateProcessSuccessAction> {
        return this.processEditorService.upload(payload).pipe(
            switchMap(process => [
                new CreateProcessSuccessAction(process, true),
                new SnackbarInfoAction('PROCESS_EDITOR.UPLOAD_SUCCESS')
            ]),
            catchError(e =>
                this.genericErrorHandler(this.handleError.bind(this, 'APP.PROJECT.ERROR.UPLOAD_FILE'), e)
            )
        );
    }

    private getProcesses(projectId: string): Observable<{} | GetProcessesSuccessAction> {
        return this.processEditorService.getAll(projectId).pipe(
            switchMap(processes => of(new GetProcessesSuccessAction(processes))),
            catchError(e =>
                this.genericErrorHandler(this.handleError.bind(this, 'APP.PROJECT.ERROR.LOAD_MODELS'), e)
            )
        );
    }

    private deleteProcess(processId: string): Observable<{} | SnackbarInfoAction | DeleteProcessSuccessAction> {
        return this.processEditorService.delete(processId).pipe(
            switchMap(() => [
                new DeleteProcessSuccessAction(processId),
                new SetAppDirtyStateAction(false),
                new ModelClosedAction({ id: processId, type: PROCESS }),
                new SnackbarInfoAction('APP.PROJECT.PROCESS_DIALOG.PROCESS_DELETED')
            ]),
            catchError(e =>
                this.genericErrorHandler(this.handleError.bind(this, 'APP.PROJECT.ERROR.DELETE_PROCESS'), e)
            )
        );
    }

    private createProcess(form: Partial<EntityDialogForm>, navigateTo: boolean, projectId: string): Observable<{} | SnackbarInfoAction | CreateProcessSuccessAction> {
        return this.processEditorService.create(form, projectId).pipe(
            switchMap((process) => [
                new CreateProcessSuccessAction(process, navigateTo),
                new SnackbarInfoAction('APP.PROJECT.PROCESS_DIALOG.PROCESS_CREATED')
            ]),
            catchError(e => this.genericErrorHandler(this.handleProcessCreationError.bind(this), e))
        );
    }

    private handleError(userMessage): Observable<SnackbarErrorAction> {
        return of(new SnackbarErrorAction(userMessage));
    }

    private handleProcessUpdatingError(error): Observable<SnackbarErrorAction | {}> {
        let errorMessage;
        const message = error.message ? JSON.parse(error.message) : {};

        if (error.status === 409) {
            errorMessage = 'APP.PROJECT.ERROR.UPDATE_PROCESS.DUPLICATION';
        } else if ( message.errors && (message.errors[0].code === 'model.invalid.name.empty')) {
            errorMessage = 'APP.PROJECT.ERROR.UPDATE_PROCESS.EMPTY_NAME';
        } else {
            errorMessage = 'APP.PROJECT.ERROR.UPDATE_PROCESS.GENERAL';
        }
        return of(new SnackbarErrorAction(errorMessage), new UpdateProcessFailedAction());
    }

    private handleProcessCreationError(error): Observable<SnackbarErrorAction> {
        let errorMessage;

        if (error.status === 409) {
            errorMessage = 'APP.PROJECT.ERROR.CREATE_PROCESS.DUPLICATION';
        } else {
            errorMessage = 'APP.PROJECT.ERROR.CREATE_PROCESS.GENERAL';
        }

        return of(new SnackbarErrorAction(errorMessage));
    }
}
