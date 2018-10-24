import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { catchError, switchMap, map, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { LogService } from '@alfresco/adf-core';
import { Observable } from 'rxjs';

import {
    GotProcessSuccessAction,
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
    VALIDATE_PROCESS_ATTEMPT
} from './process-editor.actions';
import { BaseEffects, OpenConfirmDialogAction } from 'ama-sdk';
import { ProcessEditorService } from '../services/process-editor.service';
import { SetAppDirtyStateAction } from 'ama-sdk';
import { forkJoin } from 'rxjs';
import { ProcessModelerService } from '../services/process-modeler.service';
import { selectSelectedElement, selectProcess } from './process-editor.selectors';
import { ProcessEditorState } from './process-editor.state';
import { Store } from '@ngrx/store';
import { zip } from 'rxjs';
import { concatMap, mergeMap } from 'rxjs/operators';
import { Process, SnackbarErrorAction, SnackbarInfoAction } from 'ama-sdk';
import { createProcessName } from 'ama-sdk';

@Injectable()
export class ProcessEditorEffects extends BaseEffects {
    constructor(
        private store: Store<ProcessEditorState>,
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
        mergeMap(payload => zip(of(payload), this.store.select(selectProcess))),
        mergeMap(([payload, process]) => this.updateProcess(payload, process))
    );

    @Effect()
    validateProcessEffect = this.actions$.pipe(
        ofType<ValidateProcessAttemptAction>(VALIDATE_PROCESS_ATTEMPT),
        mergeMap(action => this.validateProcess(action.payload))
    );

    @Effect()
    getProcessEffect = this.actions$.pipe(
        ofType<GetProcessAttemptAction>(GET_PROCESS_ATTEMPT),
        map(action => action.payload),
        mergeMap(processId => this.getProcess(processId))
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

    private validateProcess(payload: UpdateProcessPayload) {
        return this.processEditorService.validateProcess(payload.processId, payload.content).pipe(
            switchMap(() => [ new UpdateProcessAttemptAction(payload) ]),
            catchError(response => [ new OpenConfirmDialogAction({
                dialogData: {
                    title: 'APP.DIALOGS.ERROR.TITLE',
                    subtitle: 'APP.DIALOGS.ERROR.SUBTITLE',
                    errors: JSON.parse(response.message).errors.map(error => error.description)
                },
                action: new UpdateProcessAttemptAction(payload)
            })])
        );
    }

    private updateProcess(payload: UpdateProcessPayload, process: Process): Observable<SnackbarErrorAction | {}> {
        return this.processEditorService.updateProcess(
            payload.processId,
            <Process>{ ...process, ...payload.metadata }
        ).pipe(
            concatMap(() => this.processEditorService.saveProcessDiagram(payload.processId, payload.content)),
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

    private getProcess(processId: string): Observable<GotProcessSuccessAction | SnackbarErrorAction> {
        const processDetails$ = this.processEditorService.getProcessDetails(processId),
            processDiagram$ = this.processEditorService.getProcessDiagram(processId);

        return forkJoin(processDetails$, processDiagram$).pipe(
            switchMap(([process, diagram]) => [
                new GotProcessSuccessAction({ process, diagram }),
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
