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
import { cold, hot } from 'jasmine-marbles';
import { DashboardService } from '../../services/dashboard.service';
import { Store } from '@ngrx/store';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { Router } from '@angular/router';
import { LogService, CoreModule, TranslationService, TranslationMock } from '@alfresco/adf-core';
import { selectProjectsLoaded } from '../selectors/dashboard.selectors';
import { provideMockActions } from '@ngrx/effects/testing';
import { mockProject, mockReleaseEntry } from './project.mock';
import {
    ShowProjectsAction,
    GET_PROJECTS_ATTEMPT,
    UploadProjectAttemptAction,
    UploadProjectSuccessAction,
    CreateProjectSuccessAction,
    UpdateProjectAttemptAction,
    EditProjectPayload,
    UpdateProjectSuccessAction,
    DeleteProjectAttemptAction,
    DeleteProjectSuccessAction,
    GetProjectsAttemptAction,
    GetProjectsSuccessAction,
    ReleaseProjectAttemptAction,
    ReleaseProjectSuccessAction
} from '../actions/projects';
import {
    DialogService,
    AmaApi,
    CreateProjectAttemptAction,
    ProjectApi,
    SnackbarErrorAction,
    SnackbarInfoAction,
    AmaAuthenticationService,
    EntityDialogForm,
    DownloadResourceService,
    logInfo
} from 'ama-sdk';
import { GetProjectReleasesAttemptAction, GetProjectReleasesSuccessAction } from '../actions/releases';
import { getProjectEditorLogInitiator } from 'src/app/project-editor/services/project-editor.constants';

describe('ProjectsEffects', () => {
    let effects: ProjectsEffects;
    let metadata: EffectsMetadata<ProjectsEffects>;
    let actions$: Observable<any>;
    let dashboardService: DashboardService;
    let translationService: TranslationService;
    const projectsLoaded$ = new BehaviorSubject<boolean>(false);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreModule.forRoot()],
            providers: [
                ProjectsEffects,
                AmaAuthenticationService,
                AmaApi,
                ProjectApi,
                DashboardService,
                DownloadResourceService,
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

        effects = TestBed.get(ProjectsEffects);
        metadata = getEffectsMetadata(effects);
        dashboardService = TestBed.get(DashboardService);
        translationService = TestBed.get(TranslationService);
    });

    describe('ShowProject', () => {
        it('should dispatch an action', () => {
            expect(metadata.showProjectsEffect).toEqual({ dispatch: true });
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
            expect(metadata.uploadProjectAttemptEffect).toEqual({ dispatch: true });
        });

        it('should trigger the right action on successful upload', () => {
            dashboardService.importProject = jest.fn().mockReturnValue(of(mockProject));
            actions$ = hot('a', { a: new UploadProjectAttemptAction(mockFile) });

            const expected = cold('(bc)', {
                b: new UploadProjectSuccessAction(mockProject),
                c: new SnackbarInfoAction('APP.HOME.NEW_MENU.PROJECT_UPLOADED')
            });

            expect(effects.uploadProjectAttemptEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful update', () => {
            dashboardService.importProject = jest.fn().mockReturnValue(throwError(new Error()));
            actions$ = hot('a', { a: new UploadProjectAttemptAction(mockFile) });

            const expected = cold('b', {
                b: new SnackbarErrorAction('APP.PROJECT.ERROR.UPLOAD_PROJECT.GENERAL')
            });

            expect(effects.uploadProjectAttemptEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful update with error 409', () => {
            const error: any = new Error();
            error.status = 409;
            dashboardService.importProject = jest.fn().mockReturnValue(throwError(error));
            actions$ = hot('a', { a: new UploadProjectAttemptAction(mockFile) });

            const expected = cold('b', {
                b: new SnackbarErrorAction('APP.PROJECT.ERROR.UPLOAD_PROJECT.DUPLICATION')
            });

            expect(effects.uploadProjectAttemptEffect).toBeObservable(expected);
        });
    });

    describe('CreateProjectAttemptEffect', () => {
        const appForm: Partial<EntityDialogForm> = { name: 'testName' };

        it('should dispatch an action', () => {
            expect(metadata.createProjectAttemptEffect).toEqual({ dispatch: true });
        });

        it('should trigger the right action on successful upload', () => {
            dashboardService.createProject = jest.fn().mockReturnValue(of(mockProject));
            actions$ = hot('a', { a: new CreateProjectAttemptAction(appForm) });

            const expected = cold('(bc)', {
                b: new CreateProjectSuccessAction(mockProject),
                c: new SnackbarInfoAction('APP.HOME.NEW_MENU.PROJECT_CREATED')
            });

            expect(effects.createProjectAttemptEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful update', () => {
            dashboardService.createProject = jest.fn().mockReturnValue(throwError(new Error()));
            actions$ = hot('a', { a: new CreateProjectAttemptAction(appForm) });

            const expected = cold('b', {
                b: new SnackbarErrorAction('APP.PROJECT.ERROR.CREATE_PROJECT.GENERAL')
            });

            expect(effects.createProjectAttemptEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful update with error 409', () => {
            const error: any = new Error();
            error.status = 409;
            dashboardService.createProject = jest.fn().mockReturnValue(throwError(error));
            actions$ = hot('a', { a: new CreateProjectAttemptAction(appForm) });

            const expected = cold('b', {
                b: new SnackbarErrorAction('APP.PROJECT.ERROR.CREATE_PROJECT.DUPLICATION')
            });

            expect(effects.createProjectAttemptEffect).toBeObservable(expected);
        });
    });

    describe('UpdateProjectAttemptEffect', () => {
        const payload: EditProjectPayload = { id: 'id', form: { name: 'testName' } };

        it('should dispatch an action', () => {
            expect(metadata.updateProjectAttemptEffect).toEqual({ dispatch: true });
        });

        it('should trigger the right action on successful upload', () => {
            dashboardService.updateProject = jest.fn().mockReturnValue(of(mockProject));
            actions$ = hot('a', { a: new UpdateProjectAttemptAction(payload) });

            const expected = cold('(bc)', {
                b: new UpdateProjectSuccessAction(mockProject),
                c: new SnackbarInfoAction('APP.HOME.NEW_MENU.PROJECT_UPDATED')
            });

            expect(effects.updateProjectAttemptEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful update', () => {
            dashboardService.updateProject = jest.fn().mockReturnValue(throwError(new Error()));
            actions$ = hot('a', { a: new UpdateProjectAttemptAction(payload) });

            const expected = cold('b', {
                b: new SnackbarErrorAction('APP.PROJECT.ERROR.UPDATE_PROJECT.GENERAL')
            });

            expect(effects.updateProjectAttemptEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful update with error 409', () => {
            const error: any = new Error();
            error.status = 409;
            dashboardService.updateProject = jest.fn().mockReturnValue(throwError(error));
            actions$ = hot('a', { a: new UpdateProjectAttemptAction(payload) });

            const expected = cold('b', {
                b: new SnackbarErrorAction('APP.PROJECT.ERROR.UPDATE_PROJECT.DUPLICATION')
            });

            expect(effects.updateProjectAttemptEffect).toBeObservable(expected);
        });
    });

    describe('DeleteProjectAttemptEffect', () => {

        it('should dispatch an action', () => {
            expect(metadata.deleteProjectAttemptEffect).toEqual({ dispatch: true });
        });

        it('should trigger the right action on successful delete', () => {
            dashboardService.deleteProject = jest.fn().mockReturnValue(of(mockProject));
            actions$ = hot('a', { a: new DeleteProjectAttemptAction(mockProject.id) });

            const expected = cold('(bc)', {
                b: new DeleteProjectSuccessAction(mockProject.id),
                c: new SnackbarInfoAction('APP.HOME.NEW_MENU.PROJECT_DELETED')
            });

            expect(effects.deleteProjectAttemptEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful delete', () => {
            dashboardService.deleteProject = jest.fn().mockReturnValue(throwError(new Error()));
            actions$ = hot('a', { a: new DeleteProjectAttemptAction(mockProject.id) });

            const expected = cold('b', {
                b: new SnackbarErrorAction('APP.PROJECT.ERROR.DELETE_PROJECT')
            });

            expect(effects.deleteProjectAttemptEffect).toBeObservable(expected);
        });
    });

    describe('GetProjectsAttemptEffect', () => {

        it('should dispatch an action', () => {
            expect(metadata.getProjectsAttemptEffect).toEqual({ dispatch: true });
        });

        it('should trigger the right action on successful get', () => {
            dashboardService.fetchProjects = jest.fn().mockReturnValue(of([ mockProject ]));
            actions$ = hot('a', { a: new GetProjectsAttemptAction() });

            const expected = cold('b', {
                b: new GetProjectsSuccessAction([ mockProject ])
            });

            expect(effects.getProjectsAttemptEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful get', () => {
            dashboardService.fetchProjects = jest.fn().mockReturnValue(throwError(new Error()));
            actions$ = hot('a', { a: new GetProjectsAttemptAction() });

            const expected = cold('b', {
                b: new SnackbarErrorAction('APP.HOME.ERROR.LOAD_PROJECTS')
            });

            expect(effects.getProjectsAttemptEffect).toBeObservable(expected);
        });
    });

    describe('GetProjectReleasesAttemptEffect', () => {

        it('should dispatch an action', () => {
            expect(metadata.getProjectReleasesAttemptEffect).toEqual({ dispatch: true });
        });

        it('should trigger the right action on successful get', () => {
            dashboardService.fetchProjectReleases = jest.fn().mockReturnValue(of({ entries: [ mockReleaseEntry] , pagination: null }));
            actions$ = hot('a', { a: new GetProjectReleasesAttemptAction('app-id', null) });

            const expected = cold('b', {
                b: new GetProjectReleasesSuccessAction({entries: [ mockReleaseEntry ], pagination: null})
            });

            expect(effects.getProjectReleasesAttemptEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful get', () => {
            dashboardService.fetchProjects = jest.fn().mockReturnValue(throwError(new Error()));
            actions$ = hot('a', { a: new GetProjectsAttemptAction() });

            const expected = cold('b', {
                b: new SnackbarErrorAction('APP.HOME.ERROR.LOAD_PROJECTS')
            });

            expect(effects.getProjectsAttemptEffect).toBeObservable(expected);
        });
    });


    describe('ReleaseProjectAttemptEffect', () => {

        it('should dispatch an action', () => {
            expect(metadata.releaseProjectAttemptEffect).toEqual({ dispatch: true });
        });

        it('should trigger the right action on successful release', () => {
            dashboardService.releaseProject = jest.fn().mockReturnValue(of(mockProject));
            actions$ = hot('a', { a: new ReleaseProjectAttemptAction(mockProject.id) });
            const expectedLogAction = logInfo(getProjectEditorLogInitiator(), 'APP.HOME.NEW_MENU.PROJECT_RELEASED');
            expectedLogAction.log.datetime = (<any>expect).any(Date);
            const expected = cold('(bcd)', {
                b: new ReleaseProjectSuccessAction(mockProject, mockProject.id),
                c: expectedLogAction,
                d: new SnackbarInfoAction('APP.HOME.NEW_MENU.PROJECT_RELEASED')
            });

            expect(effects.releaseProjectAttemptEffect).toBeObservable(expected);
        });
    });
});
