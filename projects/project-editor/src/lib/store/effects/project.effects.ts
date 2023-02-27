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

import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map, switchMap, catchError, filter, mergeMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import {
    BlobService, SnackbarErrorAction, DownloadResourceService, LogFactoryService,
    LeaveProjectAction,
    SnackbarInfoAction,
    getProjectEditorLogInitiator,
    GetProjectAttemptAction,
    GET_PROJECT_ATTEMPT,
    GetProjectSuccessAction,
    ExportProjectAction,
    EXPORT_PROJECT,
    ModelingJSONSchemaService,
    AddToFavoritesProjectAttemptAction,
    ADD_TO_FAVORITES_PROJECT_ATTEMPT,
    RemoveFromFavoritesProjectAttemptAction,
    REMOVE_FROM_FAVORITES_PROJECT_ATTEMPT,
    UpdateProjectSuccessAction,
    ValidateProjectAttemptAction,
    VALIDATE_PROJECT_ATTEMPT,
    ExportProjectAttemptAction,
    EXPORT_PROJECT_ATTEMPT,
    ExportProjectAttemptPayload,
    TabManagerService,
    ValidationService,
    PROJECT,
} from '@alfresco-dbp/modeling-shared/sdk';
import { ProjectEditorService } from '../../services/project-editor.service';
import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store';

@Injectable()
export class ProjectEffects {
    constructor(
        private actions$: Actions,
        private projectEditorService: ProjectEditorService,
        protected router: Router,
        protected downloadService: DownloadResourceService,
        private logFactory: LogFactoryService,
        protected blobService: BlobService,
        private modelingJSONSchemaService: ModelingJSONSchemaService,
        private tabManagerService: TabManagerService,
        private readonly validationService: ValidationService
    ) { }


    getProjectEffect = createEffect(() => this.actions$.pipe(
        ofType<GetProjectAttemptAction>(GET_PROJECT_ATTEMPT),
        map((action: GetProjectAttemptAction) => action.payload),
        switchMap(projectId => this.getProject(projectId))
    ));


    validateProjectAttemptEffect$ = createEffect(() => this.actions$.pipe(
        ofType<ValidateProjectAttemptAction>(VALIDATE_PROJECT_ATTEMPT),
        switchMap(action => this.validateProject(action.projectId))
    ));


    exportApplicationAttemptEffect = createEffect(() => this.actions$.pipe(
        ofType<ExportProjectAttemptAction>(EXPORT_PROJECT_ATTEMPT),
        map((action: ExportProjectAttemptAction) => action.payload),
        switchMap(payload => this.exportProjectAttempt(payload))
    ));


    exportApplicationEffect = createEffect(() => this.actions$.pipe(
        ofType<ExportProjectAction>(EXPORT_PROJECT),
        map((action: ExportProjectAction) => action.payload),
        switchMap(payload => this.exportProject(payload.projectId, payload.projectName))
    ));


    leaveProjectEffect = createEffect(() => this.actions$.pipe(
        ofType<RouterNavigatedAction>(ROUTER_NAVIGATED),
        filter(() => !this.router.url.startsWith('/projects')),
        mergeMap(() => this.leftProjectAction())
    ));


    addToFavoritesProjectAttemptEffect = createEffect(() => this.actions$.pipe(
        ofType<AddToFavoritesProjectAttemptAction>(ADD_TO_FAVORITES_PROJECT_ATTEMPT),
        mergeMap((action) => this.addToFavoritesProject(action.projectId))
    ));


    removeFromFavoritesProjectAttemptEffect = createEffect(() => this.actions$.pipe(
        ofType<RemoveFromFavoritesProjectAttemptAction>(REMOVE_FROM_FAVORITES_PROJECT_ATTEMPT),
        mergeMap((action) => this.removeFromFavoritesProject(action.projectId))
    ));

    private getProject(projectId: string) {
        return this.projectEditorService.fetchProject(projectId).pipe(
            switchMap(project => {
                this.modelingJSONSchemaService.initializeProjectSchema(projectId);
                return of(new GetProjectSuccessAction(project));
            }),
            catchError(() => this.handleError('PROJECT_EDITOR.ERROR.GET_PROJECT')));
    }

    private exportProject(projectId: string, name: string) {
        return this.projectEditorService.exportProject(projectId).pipe(
            switchMap(response => {
                this.downloadService.downloadResource(name, response, '.zip');
                return [
                    this.logFactory.logInfo(getProjectEditorLogInitiator(), 'PROJECT_EDITOR.EXPORT_SUCCESS')
                ];
            }),
            catchError(() => this.handleError('PROJECT_EDITOR.ERROR.EXPORT_PROJECT')));
    }

    private exportProjectAttempt(payload: ExportProjectAttemptPayload) {
        return this.projectEditorService.validateProject(payload.projectId).pipe(
            switchMap(() => this.exportProject(payload.projectId, payload.projectName)),
            catchError(response => this.blobService.convert2Json(response.error.response.body).pipe(
                switchMap((validationError) => this.validationService.handleErrors({
                    title: validationError.message,
                    error: validationError,
                    successAction: payload.action
                }))
            ))
        );
    }

    private validateProject(projectId: string) {
        return this.projectEditorService.validateProject(projectId).pipe(
            switchMap(() => [
                new SnackbarInfoAction('PROJECT_EDITOR.PROJECT_VALID'),
                this.logFactory.logInfo(getProjectEditorLogInitiator(), 'PROJECT_EDITOR.PROJECT_VALID')
            ]),
            catchError(response => this.blobService.convert2Json(response.error.response.body).pipe(
                switchMap((errorResponse) => this.validationService.handleErrors({
                    title: errorResponse.message,
                    error: errorResponse,
                    modelType: PROJECT
                }))
            ))
        );
    }

    private handleError(userMessage: string): Observable<SnackbarErrorAction> {
        return of(new SnackbarErrorAction(userMessage));
    }

    private addToFavoritesProject(projectId: string) {
        return this.projectEditorService.addToFavoritesProject(projectId).pipe(
            switchMap(() => this.projectEditorService.fetchProject(projectId)),
            switchMap((project) => [
                new UpdateProjectSuccessAction({ id: project.id, changes: project }),
                new SnackbarInfoAction('NEW_STUDIO_DASHBOARD.ADD_TO_FAVORITES')
            ]),
            catchError(() => this.handleError('PROJECT_EDITOR.ERROR.ADD_TO_FAVORITES'))
        );
    }

    private removeFromFavoritesProject(projectId: string) {
        return this.projectEditorService.removeFromFavoritesProject(projectId).pipe(
            switchMap(() => this.projectEditorService.fetchProject(projectId)),
            switchMap((project) => [
                new UpdateProjectSuccessAction({ id: project.id, changes: project }),
                new SnackbarInfoAction('NEW_STUDIO_DASHBOARD.REMOVE_FROM_FAVORITES')
            ]),
            catchError(() => this.handleError('PROJECT_EDITOR.ERROR.REMOVE_FROM_FAVORITES'))
        );
    }

    private leftProjectAction(){
        this.tabManagerService.reset();
        return of(new LeaveProjectAction());
    }
 }
