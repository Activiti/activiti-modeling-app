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
import { LogService } from '@alfresco/adf-core';
import { Observable, of } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { tap, switchMap, catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
    AmaState,
    CreateProjectAttemptAction,
    OverrideProjectNameDialogAction,
    CREATE_PROJECT_ATTEMPT,
    SnackbarErrorAction,
    SnackbarInfoAction,
    BaseEffects,
    Pagination,
    FetchQueries,
    ServerSideSorting,
    ErrorResponse,
    SearchQuery,
    EntityDialogForm,
    GetProjectsAttemptAction,
    GET_PROJECTS_ATTEMPT,
    selectPagination,
    selectProjectsLoaded,
    OverrideProjectAttemptAction,
    OVERRIDE_PROJECT_ATTEMPT,
    UploadProjectAttemptAction,
    UPLOAD_PROJECT_ATTEMPT,
    UpdateProjectAttemptAction,
    ShowProjectsAction,
    SHOW_PROJECTS,
    UPDATE_PROJECT_ATTEMPT,
    DeleteProjectAttemptAction,
    DELETE_PROJECT_ATTEMPT,
    CreateProjectSuccessAction,
    CREATE_PROJECT_SUCCESS,
    DeleteProjectSuccessAction,
    UpdateProjectSuccessAction,
    GetProjectsSuccessAction,
    UploadProjectSuccessAction,
} from '@alfresco-dbp/modeling-shared/sdk';

@Injectable()
export class ProjectsEffects extends BaseEffects {
    constructor(
        private actions$: Actions,
        private dashboardService: DashboardService,
        private store: Store<AmaState>,
        logService: LogService,
        router: Router,
    ) {
        super(router, logService);
    }

    @Effect()
    showProjectsEffect = this.actions$.pipe(
        ofType<ShowProjectsAction>(SHOW_PROJECTS),
        withLatestFrom(this.store.select(selectProjectsLoaded)),
        switchMap(([action, loaded]) => loaded ? of() : of(new GetProjectsAttemptAction(<FetchQueries> action.pagination)))
    );

    @Effect()
    uploadProjectAttemptEffect = this.actions$.pipe(
        ofType<UploadProjectAttemptAction>(UPLOAD_PROJECT_ATTEMPT),
        switchMap((action) => this.uploadProject(action.file, action.name))
    );

    @Effect()
    createProjectAttemptEffect = this.actions$.pipe(
        ofType<CreateProjectAttemptAction>(CREATE_PROJECT_ATTEMPT),
        map(action => action.payload),
        mergeMap(payload => this.createProject(payload))
    );

    @Effect()
    overrideProjectAttemptEffect = this.actions$.pipe(
        ofType<OverrideProjectAttemptAction>(OVERRIDE_PROJECT_ATTEMPT),
        switchMap(action => this.overrideProject(action.payload.submitData.file, action.payload.name))
    );

    @Effect()
    updateProjectAttemptEffect = this.actions$.pipe(
        ofType<UpdateProjectAttemptAction>(UPDATE_PROJECT_ATTEMPT),
        map(action => action.payload),
        mergeMap(payload => this.updateProject(payload.id, payload.form))
    );

    @Effect()
    deleteProjectAttemptEffect = this.actions$.pipe(
        ofType<DeleteProjectAttemptAction>(DELETE_PROJECT_ATTEMPT),
        map(action => action),
        withLatestFrom(this.store.select(selectPagination)),
        mergeMap(([action, pagination]) => this.deleteProject(action.projectId, action.sorting, action.search, pagination))
    );

    @Effect()
    getProjectsAttemptEffect = this.actions$.pipe(
        ofType<GetProjectsAttemptAction>(GET_PROJECTS_ATTEMPT),
        switchMap(action => this.getProjectsAttempt(<FetchQueries> action.pagination, action.sorting, action.search))
    );

    @Effect({ dispatch: false })
    createProjectSuccessEffect$ = this.actions$.pipe(
        ofType<CreateProjectSuccessAction>(CREATE_PROJECT_SUCCESS),
        tap((action) => this.router.navigate(['/projects', action.payload.id]))
    );

    private deleteProject(projectId: string, sorting: ServerSideSorting, search: SearchQuery, pagination: Pagination) {
        let skipCount;
        if (pagination.count === 1) {
            skipCount = 0;
        } else {
            skipCount = pagination.skipCount < (pagination.totalItems - 1) ? pagination.skipCount : pagination.skipCount - pagination.maxItems;
        }
        return this.dashboardService.deleteProject(projectId).pipe(
            switchMap(() => [
                new DeleteProjectSuccessAction(projectId),
                new SnackbarInfoAction('DASHBOARD.NEW_MENU.PROJECT_DELETED'),
                new GetProjectsAttemptAction({
                    skipCount,
                    maxItems: pagination.maxItems
                }, {
                    key: sorting.key,
                    direction: sorting.direction
                }, search)
            ]),
            catchError(e =>
                this.genericErrorHandler(
                    () => of(new SnackbarErrorAction('PROJECT_EDITOR.ERROR.DELETE_PROJECT')),
                    e
                )
            )
        );
    }

    private updateProject(projectId: string, form: Partial<EntityDialogForm>) {
        return this.dashboardService.updateProject(projectId, form).pipe(
            switchMap(project => [
                new UpdateProjectSuccessAction({ id: project.id, changes: project }),
                new SnackbarInfoAction('DASHBOARD.NEW_MENU.PROJECT_UPDATED')
            ]),
            catchError(e =>
                this.genericErrorHandler(this.handleProjectUpdateError.bind(this, e), e)
            )
        );
    }

    private createProject(form: Partial<EntityDialogForm>) {
        return this.dashboardService.createProject(form).pipe(
            switchMap(project => [
                new CreateProjectSuccessAction(project),
                new SnackbarInfoAction('DASHBOARD.NEW_MENU.PROJECT_CREATED')
            ]),
            catchError(e =>
                this.genericErrorHandler(this.handleProjectCreateError.bind(this, e), e)
            )
        );
    }

    private overrideProject(file: File, name?: string) {
        return this.dashboardService.importProject(file, name).pipe(
            switchMap(project => [
                new CreateProjectSuccessAction(project),
                new SnackbarInfoAction('DASHBOARD.NEW_MENU.PROJECT_CREATED')
            ]),
            catchError(e =>
                this.genericErrorHandler(this.handleProjectUploadError.bind(this, e, file, name), e)
            )
        );
    }

    private getProjectsAttempt(pagination: FetchQueries, sorting: ServerSideSorting, search: SearchQuery) {
        return this.dashboardService.fetchProjects(pagination, sorting, search).pipe(
            switchMap(data => [new GetProjectsSuccessAction(data.entries, data.pagination)]),
            catchError(e => this.genericErrorHandler(this.handleError.bind(this, 'DASHBOARD.ERROR.LOAD_PROJECTS'), e))
        );
    }

    private uploadProject(file: File, name?: string) {
        return this.dashboardService.importProject(file, name).pipe(
            switchMap(project => [
                new UploadProjectSuccessAction(project),
                new SnackbarInfoAction('DASHBOARD.NEW_MENU.PROJECT_UPLOADED')
            ]),
            catchError(e => this.genericErrorHandler(this.handleProjectUploadError.bind(this, e, file, name), e))
        );
    }

    private handleProjectCreateError(error: ErrorResponse): Observable<SnackbarErrorAction> {
        let errorMessage: string;

        if (error.status === 409) {
            errorMessage = 'PROJECT_EDITOR.ERROR.CREATE_PROJECT.DUPLICATION';
        } else {
            errorMessage = 'PROJECT_EDITOR.ERROR.CREATE_PROJECT.GENERAL';
        }

        return of(new SnackbarErrorAction(errorMessage));
    }

    private handleProjectUpdateError(error: ErrorResponse): Observable<SnackbarErrorAction> {
        let errorMessage: string;

        if (error.status === 409) {
            errorMessage = 'PROJECT_EDITOR.ERROR.UPDATE_PROJECT.DUPLICATION';
        } else {
            errorMessage = 'PROJECT_EDITOR.ERROR.UPDATE_PROJECT.GENERAL';
        }

        return of(new SnackbarErrorAction(errorMessage));
    }

    private handleProjectUploadError(error: ErrorResponse, file: File, name: string): Observable<SnackbarErrorAction> {
        let errorMessage: string;

        if (error.status === 409) {
            errorMessage = 'PROJECT_EDITOR.ERROR.UPLOAD_PROJECT.DUPLICATION';
            this.store.dispatch(new OverrideProjectNameDialogAction(file, name));

        } else {
            errorMessage = 'PROJECT_EDITOR.ERROR.UPLOAD_PROJECT.GENERAL';
        }

        return of(new SnackbarErrorAction(errorMessage));
    }

    private handleError(userMessage: string) {
        return of(new SnackbarErrorAction(userMessage));
    }
}
