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

import { TestBed } from '@angular/core/testing';
import { ProjectsEffects } from './projects.effects';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { DashboardService } from '../../services/dashboard.service';
import { Store } from '@ngrx/store';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { Router } from '@angular/router';
import { LogService, CoreModule, TranslationService, TranslationMock } from '@alfresco/adf-core';
import { provideMockActions } from '@ngrx/effects/testing';
import { mockProject, paginationMock, paginationCountMock } from './project.mock';
import {
    AmaApi,
    CreateProjectAttemptAction,
    ProjectApi,
    SnackbarErrorAction,
    SnackbarInfoAction,
    EntityDialogForm,
    Pagination,
    ServerSideSorting,
    SearchQuery,
    GET_PROJECTS_ATTEMPT,
    GetProjectsAttemptAction,
    selectProjectsLoaded,
    selectPagination,
    UploadProjectAttemptAction,
    ShowProjectsAction,
    UploadProjectSuccessAction,
    CreateProjectSuccessAction,
    EditProjectPayload,
    UpdateProjectAttemptAction,
    UpdateProjectSuccessAction,
    DeleteProjectAttemptAction,
    DeleteProjectSuccessAction,
    GetProjectsSuccessAction,
    SaveAsProjectDialogPayload,
    SaveAsProjectAttemptAction,
    OpenSaveAsProjectDialogAction,
    GetFavoriteProjectsAttemptAction,
    GetFavoriteProjectsSuccessAction
} from '@alfresco-dbp/modeling-shared/sdk';
import { DialogService } from '@alfresco-dbp/adf-candidates/core/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe('ProjectsEffects', () => {
    let effects: ProjectsEffects;
    let metadata: EffectsMetadata<ProjectsEffects>;
    let actions$: Observable<any>;
    let dashboardService: DashboardService;
    let dialogService: DialogService;
    const projectsLoaded$ = new BehaviorSubject<boolean>(false);
    const paginationLoaded$ = new BehaviorSubject<Pagination>(paginationMock);
    let router: Router;

    const updatedPagination = {
        maxItems: paginationMock.maxItems,
        skipCount: paginationMock.skipCount - paginationMock.maxItems
    };

    const search: SearchQuery = {
        key: 'name',
        value: ''
    };

    const sorting: ServerSideSorting = {
        key: 'name',
        direction: 'asc'
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forChild(),
                TranslateModule.forRoot()],
            providers: [
                ProjectsEffects,
                AmaApi,
                ProjectApi,
                DialogService,
                {
                    provide: TranslationService,
                    useClass: TranslationMock
                },
                provideMockActions(() => actions$),
                {
                    provide: Router,
                    useValue: { navigate: jest.fn() }
                },
                {
                    provide: LogService,
                    useValue: { error: jest.fn() }
                },
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation((selector) => {
                            if (selector === selectProjectsLoaded) {
                                return projectsLoaded$;
                            }
                            if (selector === selectPagination) {
                                return paginationLoaded$;
                            }

                            return of({});
                        }),
                        dispatch: jest.fn()
                    }
                },
                {
                    provide: DialogService,
                    useValue: { openDialog: jest.fn() }
                }
            ]
        });

        effects = TestBed.inject(ProjectsEffects);
        router = TestBed.inject(Router);
        metadata = getEffectsMetadata(effects);
        dashboardService = TestBed.inject(DashboardService);
        dialogService = TestBed.inject(DialogService);
    });

    describe('ShowProject', () => {
        it('should dispatch an action', () => {
            expect(metadata.showProjectsEffect.dispatch).toBeTruthy();
        });

        it('should dispatch a GetProjectAttemptAction if there are no projects loaded', () => {
            actions$ = hot('a', { a: new ShowProjectsAction() });
            const expected = cold('b', { b: { type: GET_PROJECTS_ATTEMPT } });
            expect(effects.showProjectsEffect).toBeObservable(expected);
        });

        it('should not dispatch a new GetProjectAttemptAction if there are apps loaded', () => {
            actions$ = hot('a', { a: new ShowProjectsAction() });
            const expected = cold('');
            projectsLoaded$.next(true);
            expect(effects.showProjectsEffect).toBeObservable(expected);
        });
    });

    describe('UploadProjectAttempt', () => {
        const mockFile = new File([''], 'filename');

        it('should dispatch an action', () => {
            expect(metadata.uploadProjectAttemptEffect.dispatch).toBeTruthy();
        });

        it('should trigger the right action on successful upload', () => {
            dashboardService.importProject = jest.fn().mockReturnValue(of(mockProject));
            actions$ = hot('a', { a: new UploadProjectAttemptAction(mockFile) });

            const expected = cold('(bc)', {
                b: new UploadProjectSuccessAction(mockProject),
                c: new SnackbarInfoAction('DASHBOARD.NEW_MENU.PROJECT_UPLOADED')
            });

            expect(effects.uploadProjectAttemptEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful update', () => {
            dashboardService.importProject = jest.fn().mockReturnValue(throwError(new Error()));
            actions$ = hot('a', { a: new UploadProjectAttemptAction(mockFile) });

            const expected = cold('b', {
                b: new SnackbarErrorAction('PROJECT_EDITOR.ERROR.UPLOAD_PROJECT.GENERAL')
            });

            expect(effects.uploadProjectAttemptEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful update with error 409', () => {
            const error: any = new Error();
            error.status = 409;
            dashboardService.importProject = jest.fn().mockReturnValue(throwError(error));
            actions$ = hot('a', { a: new UploadProjectAttemptAction(mockFile) });

            const expected = cold('b', {
                b: new SnackbarErrorAction('PROJECT_EDITOR.ERROR.UPLOAD_PROJECT.DUPLICATION')
            });

            expect(effects.uploadProjectAttemptEffect).toBeObservable(expected);
        });
    });

    describe('CreateProjectAttemptEffect', () => {
        const appForm: Partial<EntityDialogForm> = { name: 'testName' };

        it('should dispatch an action', () => {
            expect(metadata.createProjectAttemptEffect.dispatch).toBeTruthy();
        });

        it('should trigger the right action on successful upload', () => {
            dashboardService.createProject = jest.fn().mockReturnValue(of(mockProject));
            actions$ = hot('a', { a: new CreateProjectAttemptAction(appForm) });

            const expected = cold('(bc)', {
                b: new CreateProjectSuccessAction(mockProject),
                c: new SnackbarInfoAction('DASHBOARD.NEW_MENU.PROJECT_CREATED')
            });

            expect(effects.createProjectAttemptEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful update', () => {
            dashboardService.createProject = jest.fn().mockReturnValue(throwError(new Error()));
            actions$ = hot('a', { a: new CreateProjectAttemptAction(appForm) });

            const expected = cold('b', {
                b: new SnackbarErrorAction('PROJECT_EDITOR.ERROR.CREATE_PROJECT.GENERAL')
            });

            expect(effects.createProjectAttemptEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful update with error 409', () => {
            const error: any = new Error();
            error.status = 409;
            dashboardService.createProject = jest.fn().mockReturnValue(throwError(error));
            actions$ = hot('a', { a: new CreateProjectAttemptAction(appForm) });

            const expected = cold('b', {
                b: new SnackbarErrorAction('PROJECT_EDITOR.ERROR.CREATE_PROJECT.DUPLICATION')
            });

            expect(effects.createProjectAttemptEffect).toBeObservable(expected);
        });

        it('should navigate when project created successfully', () => {
            spyOn(router, 'navigate');
            actions$ = of(new CreateProjectSuccessAction(mockProject));
            // eslint-disable-next-line rxjs/no-ignored-subscribe
            effects.createProjectSuccessEffect$.subscribe();
            expect(router.navigate).toHaveBeenCalledTimes(1);
            expect(router.navigate).toHaveBeenCalledWith(['/projects', 'app-id']);
        });
    });

    describe('UpdateProjectAttemptEffect', () => {
        const payload: EditProjectPayload = { id: 'id', form: { name: 'testName' } };

        it('should dispatch an action', () => {
            expect(metadata.updateProjectAttemptEffect.dispatch).toBeTruthy();
        });

        it('should trigger the right action on successful upload', () => {
            dashboardService.updateProject = jest.fn().mockReturnValue(of(mockProject));
            actions$ = hot('a', { a: new UpdateProjectAttemptAction(payload) });

            const expected = cold('(bc)', {
                b: new UpdateProjectSuccessAction({ id: mockProject.id, changes: mockProject }),
                c: new SnackbarInfoAction('DASHBOARD.NEW_MENU.PROJECT_UPDATED')
            });

            expect(effects.updateProjectAttemptEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful update', () => {
            dashboardService.updateProject = jest.fn().mockReturnValue(throwError(new Error()));
            actions$ = hot('a', { a: new UpdateProjectAttemptAction(payload) });

            const expected = cold('b', {
                b: new SnackbarErrorAction('PROJECT_EDITOR.ERROR.UPDATE_PROJECT.GENERAL')
            });

            expect(effects.updateProjectAttemptEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful update with error 409', () => {
            const error: any = new Error();
            error.status = 409;
            dashboardService.updateProject = jest.fn().mockReturnValue(throwError(error));
            actions$ = hot('a', { a: new UpdateProjectAttemptAction(payload) });

            const expected = cold('b', {
                b: new SnackbarErrorAction('PROJECT_EDITOR.ERROR.UPDATE_PROJECT.DUPLICATION')
            });

            expect(effects.updateProjectAttemptEffect).toBeObservable(expected);
        });
    });

    describe('DeleteProjectAttemptEffect', () => {

        it('should dispatch an action', () => {
            expect(metadata.deleteProjectAttemptEffect.dispatch).toBeTruthy();
        });

        it('should trigger the right action on successful delete', () => {
            dashboardService.deleteProject = jest.fn().mockReturnValue(of(mockProject));
            actions$ = hot('a', { a: new DeleteProjectAttemptAction(mockProject.id, sorting, search) });

            const expected = cold('(bce)', {
                b: new DeleteProjectSuccessAction(mockProject.id),
                c: new SnackbarInfoAction('DASHBOARD.NEW_MENU.PROJECT_DELETED'),
                e: new GetProjectsAttemptAction(updatedPagination, sorting, search)
            });

            expect(effects.deleteProjectAttemptEffect).toBeObservable(expected);
        });

        it('should modify pagination when the skipCount is equal with totalItems', () => {
            dashboardService.deleteProject = jest.fn().mockReturnValue(of(mockProject));
            actions$ = hot('a', { a: new DeleteProjectAttemptAction(mockProject.id, sorting, search) });

            const expected = cold('(bce)', {
                b: new DeleteProjectSuccessAction(mockProject.id),
                c: new SnackbarInfoAction('DASHBOARD.NEW_MENU.PROJECT_DELETED'),
                e: new GetProjectsAttemptAction(updatedPagination, sorting, search)

            });

            expect(effects.deleteProjectAttemptEffect).toBeObservable(expected);
        });

        it('should modify pagination when the last project in the list is deleted', () => {
            paginationLoaded$.next(paginationCountMock);
            dashboardService.deleteProject = jest.fn().mockReturnValue(of(mockProject));
            actions$ = hot('a', { a: new DeleteProjectAttemptAction(mockProject.id, sorting, search) });

            const updatedCountPagination = {
                skipCount: 0,
                maxItems: 10
            };

            const expected = cold('(bce)', {
                b: new DeleteProjectSuccessAction(mockProject.id),
                c: new SnackbarInfoAction('DASHBOARD.NEW_MENU.PROJECT_DELETED'),
                e: new GetProjectsAttemptAction(updatedCountPagination, sorting, search)
            });

            expect(effects.deleteProjectAttemptEffect).toBeObservable(expected);
            paginationLoaded$.next(paginationMock);
        });

        it('should trigger the right action on unsuccessful delete', () => {
            dashboardService.deleteProject = jest.fn().mockReturnValue(throwError(new Error()));
            actions$ = hot('a', { a: new DeleteProjectAttemptAction(mockProject.id) });

            const expected = cold('b', {
                b: new SnackbarErrorAction('PROJECT_EDITOR.ERROR.DELETE_PROJECT')
            });

            expect(effects.deleteProjectAttemptEffect).toBeObservable(expected);
        });

        it('should refresh projects on successful delete', () => {
            dashboardService.deleteProject = jest.fn().mockReturnValue(of(mockProject));
            actions$ = hot('a', { a: new DeleteProjectAttemptAction(mockProject.id, sorting, search) });

            const expected = cold('(bce)', {
                b: new DeleteProjectSuccessAction(mockProject.id),
                c: new SnackbarInfoAction('DASHBOARD.NEW_MENU.PROJECT_DELETED'),
                e: new GetProjectsAttemptAction(updatedPagination, sorting, search)

            });

            expect(effects.deleteProjectAttemptEffect).toBeObservable(expected);
        });
    });

    describe('GetProjectsAttemptEffect', () => {

        it('should dispatch an action', () => {
            expect(metadata.getProjectsAttemptEffect.dispatch).toBeTruthy();
        });

        it('should trigger the right action on successful get', () => {
            dashboardService.fetchProjects = jest.fn().mockReturnValue(of({
                entries: [mockProject],
                pagination: null
            }));
            actions$ = hot('a', { a: new GetProjectsAttemptAction() });

            const expected = cold('b', {
                b: new GetProjectsSuccessAction([mockProject], null)
            });

            expect(effects.getProjectsAttemptEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful get', () => {
            dashboardService.fetchProjects = jest.fn().mockReturnValue(throwError(new Error()));
            actions$ = hot('a', { a: new GetProjectsAttemptAction() });

            const expected = cold('b', {
                b: new SnackbarErrorAction('DASHBOARD.ERROR.LOAD_PROJECTS')
            });

            expect(effects.getProjectsAttemptEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful get', () => {
            dashboardService.fetchProjects = jest.fn().mockReturnValue(throwError(new Error()));
            actions$ = hot('a', { a: new GetProjectsAttemptAction() });

            const expected = cold('b', {
                b: new SnackbarErrorAction('DASHBOARD.ERROR.LOAD_PROJECTS')
            });

            expect(effects.getProjectsAttemptEffect).toBeObservable(expected);
        });
    });

    describe('GetFavoriteProjectsAttemptEffect', () => {

        it('should dispatch an action', () => {
            expect(metadata.getFavoriteProjectsAttemptEffect.dispatch).toBeTruthy();
        });

        it('should trigger the right action on successful get', () => {
            dashboardService.fetchProjects = jest.fn().mockReturnValue(of({
                entries: [mockProject],
                pagination: null
            }));
            actions$ = hot('a', { a: new GetFavoriteProjectsAttemptAction() });

            const expected = cold('b', {
                b: new GetFavoriteProjectsSuccessAction([mockProject], null)
            });

            expect(effects.getFavoriteProjectsAttemptEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful get', () => {
            dashboardService.fetchProjects = jest.fn().mockReturnValue(throwError(new Error()));
            actions$ = hot('a', { a: new GetFavoriteProjectsAttemptAction() });

            const expected = cold('b', {
                b: new SnackbarErrorAction('NEW_STUDIO_DASHBOARD.ERROR.LOAD_FAVORITE_PROJECTS')
            });

            expect(effects.getFavoriteProjectsAttemptEffect).toBeObservable(expected);
        });
    });

    describe('SaveAsProjectsAttemptEffect', () => {
        const payload: SaveAsProjectDialogPayload = { id: 'id', name: 'test-name' };

        it('should dispatch an action', () => {
            expect(metadata.saveAsProjectAttemptAction.dispatch).toBeTruthy();
        });

        it('openSaveAsProjectDialog should open save as dialog', () => {
            spyOn(dialogService, 'openDialog');
            actions$ = hot('a', { a: new OpenSaveAsProjectDialogAction(payload) });
            effects.openSaveAsProjectDialogAction.subscribe(() => {});
            getTestScheduler().flush();
            expect(dialogService.openDialog).toHaveBeenCalled();
        });

        it('should trigger the right action on successful save as', () => {
            dashboardService.saveAsProject = jest.fn().mockReturnValue(of(mockProject));
            actions$ = hot('a', { a: new SaveAsProjectAttemptAction(payload) });

            const expected = cold('(bc)', {
                b: new CreateProjectSuccessAction(mockProject),
                c: new SnackbarInfoAction('DASHBOARD.NEW_MENU.PROJECT_CREATED')
            });

            expect(effects.saveAsProjectAttemptAction).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful save as', () => {
            dashboardService.saveAsProject = jest.fn().mockReturnValue(throwError(new Error()));
            actions$ = hot('a', { a: new SaveAsProjectAttemptAction(payload) });

            const expected = cold('b', {
                b: new SnackbarErrorAction('PROJECT_EDITOR.ERROR.CREATE_PROJECT.GENERAL')
            });

            expect(effects.saveAsProjectAttemptAction).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful save as with error 409', () => {
            const error: any = new Error();
            error.status = 409;
            dashboardService.saveAsProject = jest.fn().mockReturnValue(throwError(error));
            actions$ = hot('a', { a: new SaveAsProjectAttemptAction(payload) });

            const expected = cold('b', {
                b: new SnackbarErrorAction('PROJECT_EDITOR.ERROR.CREATE_PROJECT.DUPLICATION')
            });

            expect(effects.saveAsProjectAttemptAction).toBeObservable(expected);
        });
    });
});
