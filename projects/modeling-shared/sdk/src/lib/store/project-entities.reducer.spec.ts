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

import { projectEntitiesReducer } from './project-entities.reducer';
import {
    GetProjectsSuccessAction,
    GetProjectsAttemptAction,
    GetProjectSuccessAction,
    CreateProjectSuccessAction,
    UpdateProjectSuccessAction,
    DeleteProjectSuccessAction,
    UploadProjectSuccessAction,
    GetFavoriteProjectsAttemptAction,
    GetFavoriteProjectsSuccessAction
} from './project.actions';
import { Project, PROJECT } from '../api/types';
import { ProjectEntitiesState, initialProjectEntitiesState } from './public-api';

describe('projectEntitiesReducer', () => {

    const mockProject: Project = {
        id: 'app-id',
        name: 'app-name',
        description: 'description',
        version: '0.0.1',
        type: PROJECT,
        createdBy: 'user',
        creationDate: new Date(),
        lastModifiedBy: 'user',
        lastModifiedDate: new Date(),
        favorite: false
    };

    const mockProject1: Project = {
        id: 'app-id-1',
        name: 'app-name',
        description: 'description',
        version: '0.0.1',
        type: PROJECT,
        createdBy: 'user',
        creationDate: new Date(),
        lastModifiedBy: 'user',
        lastModifiedDate: new Date(),
        favorite: true
    };

    let initialState: ProjectEntitiesState;

    beforeEach(() => {
        initialState = initialProjectEntitiesState;
        initialState.entities = {
            '1': { id: '1' },
            '2': { id: '2' },
            '3': { id: '3' }
        };
    });

    describe('GET_PROJECTS_ATTEMPT', () => {
        const action = new GetProjectsAttemptAction();

        it('loading should be true', () => {
            const newState = projectEntitiesReducer(initialState, action);
            expect(newState.loading).toBe(true);
        });
    });

    describe('GET_FAVORITE_PROJECTS_ATTEMPT', () => {
        const action = new GetFavoriteProjectsAttemptAction();

        it('loading should be true', () => {
            const newState = projectEntitiesReducer(initialState, action);
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
        const action = new GetProjectsSuccessAction([mockProject], mockPagination);

        it('should load the projects', () => {
            const newState = projectEntitiesReducer(initialState, action);

            expect(newState.loaded).toBe(true);
            expect(newState.loading).toBe(false);
            expect(newState.entities).toEqual({ [mockProject.id]: mockProject });
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
            const newState = projectEntitiesReducer(initState, new GetProjectSuccessAction(project));

            expect(newState.entities[project.id]).toEqual(project);
        });
    });

    describe('GET_FAVORITE_PROJECTS_SUCCESS', () => {
        const mockPagination = {
            count: 1,
            hasMoreItems: false,
            maxItems: 10,
            skipCount: 0,
            totalItems: 1
        };
        const action = new GetFavoriteProjectsSuccessAction([mockProject1], mockPagination);

        it('should load the projects', () => {
            const newState = projectEntitiesReducer(initialState, action);

            expect(newState.loaded).toBe(true);
            expect(newState.loading).toBe(false);
            expect(newState.entities).toEqual({ [mockProject1.id]: mockProject1 });
            expect(newState.pagination).toEqual(mockPagination);
        });

        it ('should handle GET_FAVORITE_PROJECT_SUCCESS', () => {
            const project: Partial<Project> = {
                type: 'project',
                /* cspell: disable-next-line */
                id: 'appid',
                /* cspell: disable-next-line */
                name: 'appname'
            };
            const initState = {...initialState};
            const newState = projectEntitiesReducer(initState, new GetProjectSuccessAction(project));

            expect(newState.entities[project.id]).toEqual(project);
        });
    });

    describe('CREATE_PROJECT_SUCCESS', () => {
        const action = new CreateProjectSuccessAction(<Partial<Project>>mockProject);

        it('should append the project to the list', () => {
            const newState = projectEntitiesReducer(initialState, action);

            expect(newState.entities).toEqual({ ...newState.entities, [mockProject.id]: mockProject });
        });
    });

    describe('UPDATE_PROJECT_SUCCESS', () => {
        const newProject = {
            id: '1',
            changes: {
                name: mockProject.name
            }
        };
        const action = new UpdateProjectSuccessAction(newProject);
        it('should update the project in the list', () => {
            const newState = projectEntitiesReducer(initialState, action);

            expect(newState.entities).toEqual({ ...newState.entities, [newProject.id] : { id: newProject.id, name: mockProject.name }});
        });
    });

    describe('DELETE_PROJECT_SUCCESS', () => {
        const action = new DeleteProjectSuccessAction('2');

        it('should delete the project', () => {
            const newState = projectEntitiesReducer(initialState, action);

            expect(newState.entities['1']).not.toBe(undefined);
            expect(newState.entities['2']).toBe(undefined);
            expect(newState.entities['3']).not.toBe(undefined);
        });
    });

    describe('UPLOAD_PROJECT_SUCCESS', () => {
        const project = {
            id: '4',
            name: 'test'
        };

        const action = new UploadProjectSuccessAction(project);

        it('should add a new project to the state', () => {
            const newState = projectEntitiesReducer(initialState, action);
            expect(newState.entities['4']).not.toBe(undefined);
        });
    });
});
