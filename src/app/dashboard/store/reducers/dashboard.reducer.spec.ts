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

import { dashboardReducer } from './dashboard.reducer';
import {
    DeleteProjectSuccessAction,
    UploadProjectSuccessAction,
    GetProjectsSuccessAction,
    CreateProjectSuccessAction,
    UpdateProjectSuccessAction,
} from '../actions/projects';
import {
    Project, Release,
    ReleaseProjectSuccessAction, INITIAL_DASHBOARD_STATE,
    DashboardState, GetProjectsAttemptAction, GetProjectSuccessAction
} from '@alfresco-dbp/modeling-shared/sdk';
import { mockProject } from '../effects/project.mock';

describe('dashboardReducer', () => {

    let initialState: DashboardState;

    beforeEach(() => {
        initialState = { ...INITIAL_DASHBOARD_STATE };
        initialState.projects = {
            '1': { id: '1' },
            '2': { id: '2' },
            '3': { id: '3' }
        };
    });

    describe('GET_PROJECTS_ATTEMPT', () => {
        const action = new GetProjectsAttemptAction();

        it('loading should be true', () => {
            const newState = dashboardReducer(initialState, action);
            expect(newState.loading).toBe(true);
        });
    });

    describe('GET_PROJECTS_SUCCESS', () => {
        const mockPagination = {
            count: 1,
            hasMoreItems: false,
            maxItems: 10,
            skipCount: 0,
            totalItems: 1
        };
        const action = new GetProjectsSuccessAction(<any>{entries: [mockProject], pagination: mockPagination });

        it('should load the projects', () => {
            const newState = dashboardReducer(initialState, action);

            expect(newState.projectsLoaded).toBe(true);
            expect(newState.loading).toBe(false);
            expect(newState.projects).toEqual({ [mockProject.id]: mockProject });
            expect(newState.pagination).toEqual(mockPagination);
        });

        it ('should handle GET_PROJECT_SUCCESS', () => {
            const project: Partial<Project> = {
                type: 'project',
                /* cspell: disable-next-line */
                id: 'appid',
                /* cspell: disable-next-line */
                name: 'appname'
            };
            const initState = {...initialState};
            const newState = dashboardReducer(initState, new GetProjectSuccessAction(project));

            expect(newState.projects[project.id]).toEqual(project);
        });
    });

    describe('CREATE_PROJECT_SUCCESS', () => {
        const action = new CreateProjectSuccessAction(<Partial<Project>>mockProject);

        it('should append the project to the list', () => {
            const newState = dashboardReducer(initialState, action);

            expect(newState.projects).toEqual({ ...newState.projects, [mockProject.id]: mockProject });
        });
    });

    describe('UPDATE_PROJECT_SUCCESS', () => {
        const newProject = { ...mockProject, name: 'new-name', description: 'new-description' };
        const action = new UpdateProjectSuccessAction(<Partial<Project>>newProject);

        it('should update the project in the list', () => {
            const newState = dashboardReducer(initialState, action);

            expect(newState.projects).toEqual({ ...newState.projects, [newProject.id]: newProject });
        });
    });

    describe('DELETE_PROJECT_SUCCESS', () => {
        const action = new DeleteProjectSuccessAction('2');

        it('should delete the project', () => {
            const newState = dashboardReducer(initialState, action);

            expect(newState.projects['1']).not.toBe(undefined);
            expect(newState.projects['2']).toBe(undefined);
            expect(newState.projects['3']).not.toBe(undefined);
        });
    });

    describe('UPLOAD_PROJECT_SUCCESS', () => {
        const project = {
            id: '4',
            name: 'test'
        };

        const action = new UploadProjectSuccessAction(project);

        it('should add a new project to the state', () => {
            const newState = dashboardReducer(initialState, action);
            expect(newState.projects['4']).not.toBe(undefined);
        });
    });

    describe('RELEASE_PROJECT_SUCCESS', () => {
        const newRelease = { ...mockProject, name: 'new-name', description: 'new-description', version: '2' };
        const action = new ReleaseProjectSuccessAction(<Release>newRelease, mockProject.id);

        it('should update the version of the project', () => {
            const newState = dashboardReducer(initialState, action);

            expect(newState.projects[mockProject.id].version).toEqual('2');
        });
    });
});
