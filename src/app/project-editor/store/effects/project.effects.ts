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
import { Injectable } from '@angular/core';
import { map, switchMap, catchError, filter, mergeMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LogService } from '@alfresco/adf-core';
import { BaseEffects, OpenConfirmDialogAction, BlobService, SnackbarErrorAction, DownloadResourceService, LogFactoryService, LogAction,
    LeaveProjectAction,
    SnackbarInfoAction,
    ConfirmDialogData,
    getProjectEditorLogInitiator,
    GetProjectAttemptAction,
    GET_PROJECT_ATTEMPT,
    GetProjectSuccessAction} from '@alfresco-dbp/modeling-shared/sdk';
import { ProjectEditorService } from '../../services/project-editor.service';
import {
    ExportProjectAction,
    EXPORT_PROJECT,
    ValidateProjectAttemptAction,
    VALIDATE_PROJECT_ATTEMPT,
    ExportProjectAttemptAction,
    EXPORT_PROJECT_ATTEMPT,
    ExportProjectAttemptPayload
} from '../project-editor.actions';
 import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store';
import { Action } from '@ngrx/store';

@Injectable()
export class ProjectEffects extends BaseEffects {
    constructor(
        private actions$: Actions,
        private projectEditorService: ProjectEditorService,
        protected logService: LogService,
        protected router: Router,
        protected downloadService: DownloadResourceService,
        private logFactory: LogFactoryService,
        protected blobService: BlobService
    ) {
        super(router, logService);
    }

    @Effect()
    getProjectEffect = this.actions$.pipe(
        ofType<GetProjectAttemptAction>(GET_PROJECT_ATTEMPT),
        map((action: GetProjectAttemptAction) => action.payload),
        switchMap(projectId => this.getProject(projectId))
    );

    @Effect()
       validateProjectAttemptEffect$ = this.actions$.pipe(
        ofType<ValidateProjectAttemptAction>(VALIDATE_PROJECT_ATTEMPT),
        switchMap(action => this.validateProject(action.projectId))
    );

    @Effect()
    exportApplicationAttemptEffect = this.actions$.pipe(
        ofType<ExportProjectAttemptAction>(EXPORT_PROJECT_ATTEMPT),
        map((action: ExportProjectAttemptAction) => action.payload),
        switchMap(payload => this.exportProjectAttempt(payload))
    );

    @Effect()
    exportApplicationEffect = this.actions$.pipe(
        ofType<ExportProjectAction>(EXPORT_PROJECT),
        map((action: ExportProjectAction) => action.payload),
        switchMap(payload => this.exportProject(payload.projectId, payload.projectName))
    );

    @Effect()
    leaveProjectEffect = this.actions$.pipe(
        ofType<RouterNavigatedAction>(ROUTER_NAVIGATED),
        filter(() => !this.router.url.startsWith('/projects')),
        mergeMap(() => of(new LeaveProjectAction()))
    );

    private getProject(projectId: string) {
        return this.projectEditorService.fetchProject(projectId).pipe(
            switchMap(project => of(new GetProjectSuccessAction(project))),
            catchError(e =>
                this.genericErrorHandler(this.handleError.bind(this, 'PROJECT_EDITOR.ERROR.GET_PROJECT'), e)
            )
        );
    }

    private exportProject(projectId: string, name: string) {
        return this.projectEditorService.exportProject(projectId).pipe(
            switchMap(response => {
                this.downloadService.downloadResource(name, response, '.zip');
                return [
                    this.logFactory.logInfo(getProjectEditorLogInitiator(), 'PROJECT_EDITOR.EXPORT_SUCCESS')
                ];
            }),
            catchError(e => this.genericErrorHandler(this.handleError.bind(this, 'PROJECT_EDITOR.ERROR.EXPORT_PROJECT'), e)));
    }

    private exportProjectAttempt(payload: ExportProjectAttemptPayload) {
        return this.projectEditorService.validateProject(payload.projectId).pipe(
            switchMap(() => this.exportProject(payload.projectId, payload.projectName)),
            catchError(response => this.genericErrorHandler(this.handleValidationError
                .bind(this, response, payload.action), response)));
    }

    private validateProject(projectId: string) {
        return this.projectEditorService.validateProject(projectId).pipe(
            switchMap(() => [
                new SnackbarInfoAction('PROJECT_EDITOR.PROJECT_VALID'),
                this.logFactory.logInfo(getProjectEditorLogInitiator(), 'PROJECT_EDITOR.PROJECT_VALID')
            ]),
            catchError(response => this.genericErrorHandler(this.handleValidationError.bind(this, response, null), response)));
    }

    private openConfirmDialog(data: ConfirmDialogData, action: Action) {
        return [
            new OpenConfirmDialogAction({
                dialogData: data,
                action: action || null
            }),
            this.logFactory.logError(getProjectEditorLogInitiator(), data.errors)
        ];
    }

    private handleValidationError(response: any, action: Action | null): Observable<OpenConfirmDialogAction | LogAction> {
        return this.blobService.convert2Json(response.error.response.body).pipe(
            switchMap(body => {
                const errors = body.errors.map(error => error.description);
                this.logFactory.logError(getProjectEditorLogInitiator(), errors);
                return this.openConfirmDialog({
                    title: body.message,
                    subtitle: 'APP.DIALOGS.ERROR.SUBTITLE',
                    errors: errors
                }, action );
            }
        ));
    }

    private handleError(userMessage: string) {
        return of(new SnackbarErrorAction(userMessage));
    }
}
