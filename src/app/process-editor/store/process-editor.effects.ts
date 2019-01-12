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
import { catchError, switchMap, map, filter } from 'rxjs/operators';
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
    ValidateProcessPayload
} from './process-editor.actions';
import { BaseEffects, OpenConfirmDialogAction, ModelOpenedAction } from 'ama-sdk';
import { ProcessEditorService } from '../services/process-editor.service';
import { SetAppDirtyStateAction } from 'ama-sdk';
import { forkJoin } from 'rxjs';
import { ProcessModelerService } from '../services/process-modeler.service';
import { selectSelectedElement, selectProcess } from './process-editor.selectors';
import { Store } from '@ngrx/store';
import { zip } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Process, SnackbarErrorAction, SnackbarInfoAction } from 'ama-sdk';
import { createProcessName } from 'ama-sdk';
import { selectSelectedAppId, AmaState } from 'ama-sdk';

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
    updateProcessEffect = this.actions$.pipe(
        ofType<UpdateProcessAttemptAction>(UPDATE_PROCESS_ATTEMPT),
        map(action => action.payload),
        mergeMap(payload => zip(of(payload), this.store.select(selectProcess), this.store.select(selectSelectedAppId))),
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
        return this.processEditorService.validateProcess(payload.processId, payload.content).pipe(
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
        return this.processEditorService.updateProcess(
            payload.processId,
            { ...process, ...payload.metadata },
            payload.content,
            appId
        ).pipe(
            switchMap(() => [
                new UpdateProcessSuccessAction(payload),
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
            .then(data => this.processEditorService.downloadProcessDiagram(name, data))
            .catch(err => {
                this.genericErrorHandler(this.handleError.bind(this, 'APP.PROCESSES.ERRORS.DOWNLOAD_DIAGRAM'), err);
            });
    }

    private getProcess(processId: string, appId: string): Observable<GetProcessSuccessAction | SnackbarErrorAction> {
        const processDetails$ = this.processEditorService.getProcessDetails(processId, appId),
            processDiagram$ = this.processEditorService.getProcessDiagram(processId);

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
}
