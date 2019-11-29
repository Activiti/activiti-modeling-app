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
    LeaveProjectAction } from 'ama-sdk';
import { ProjectEditorService } from '../../services/project-editor.service';
import {
    GetProjectAttemptAction,
    GET_PROJECT_ATTEMPT,
    GetProjectSuccessAction,
    ExportProjectAction,
    EXPORT_PROJECT
} from '../project-editor.actions';
import { getProjectEditorLogInitiator } from '../../services/project-editor.constants';
 import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store';

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
                this.genericErrorHandler(this.handleError.bind(this, 'APP.PROJECT.ERROR.GET_PROJECT'), e)
            )
        );
    }

    private exportProject(projectId: string, name: string) {
        return this.projectEditorService.exportProject(projectId).pipe(
            switchMap(response => {
                this.downloadService.downloadResource(name, response, '.zip');
                return [
                    this.logFactory.logInfo(getProjectEditorLogInitiator(), 'APP.PROJECT.EXPORT_SUCCESS')
                ];
            }),
            catchError(response => this.genericErrorHandler(this.handleValidationError.bind(this, response), response)
            ));
    }

    private handleValidationError(response: any): Observable<OpenConfirmDialogAction | LogAction> {
        return this.blobService.convert2Json(response.error.response.body).pipe(
            switchMap(body => {
                const errors = body.errors.map(error => error.description);

                return [
                    new OpenConfirmDialogAction({
                        dialogData: {
                            title: body.message,
                            subtitle: 'APP.DIALOGS.ERROR.SUBTITLE',
                            errors: errors
                        }
                    }),
                    this.logFactory.logError(getProjectEditorLogInitiator(), errors)
                ];
            }
        ));
    }

    private handleError(userMessage: string) {
        return of(new SnackbarErrorAction(userMessage));
    }
}
