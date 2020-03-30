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

import { Action } from '@ngrx/store';
import { Project, SearchQuery, EntityDialogForm } from '@alfresco-dbp/modeling-shared/sdk';
import { Pagination } from '@alfresco/js-api';
import { Update } from '@ngrx/entity';

export interface EditProjectPayload {
    id: string;
    form: Partial<EntityDialogForm>;
}

export const CREATE_PROJECT_SUCCESS = 'CREATE_PROJECT_SUCCESS';
export class CreateProjectSuccessAction implements Action {
    readonly type = CREATE_PROJECT_SUCCESS;
    constructor(public payload: Partial<Project>) {}
}

export const UPDATE_PROJECT_ATTEMPT = 'UPDATE_PROJECT_ATTEMPT';
export class UpdateProjectAttemptAction implements Action {
    readonly type = UPDATE_PROJECT_ATTEMPT;
    constructor(public payload: EditProjectPayload) {}
}

export const UPLOAD_PROJECT_SUCCESS = 'UPLOAD_PROJECT_SUCCESS';
export class UploadProjectSuccessAction implements Action {
    readonly type = UPLOAD_PROJECT_SUCCESS;
    constructor(public payload: Partial<Project>) {}
}

export const UPDATE_PROJECT_SUCCESS = 'UPDATE_PROJECT_SUCCESS';
export class UpdateProjectSuccessAction implements Action {
    readonly type = UPDATE_PROJECT_SUCCESS;
    constructor(public payload: Update<Partial<Project>>) {}
}

export const DELETE_PROJECT_ATTEMPT = 'DELETE_PROJECT_ATTEMPT';
export class DeleteProjectAttemptAction implements Action {
    readonly type = DELETE_PROJECT_ATTEMPT;
    constructor(public projectId: string, public sorting?, public search?: SearchQuery) {}
}

export const DELETE_PROJECT_SUCCESS = 'DELETE_PROJECT_SUCCESS';
export class DeleteProjectSuccessAction implements Action {
    readonly type = DELETE_PROJECT_SUCCESS;
    constructor(public payload: string) {}
}

export const GET_PROJECTS_SUCCESS = 'GET_PROJECTS_SUCCESS';
export class GetProjectsSuccessAction implements Action {
    readonly type = GET_PROJECTS_SUCCESS;
    constructor(public payload: Project[], public pagination: Pagination) {}
}

export const SHOW_PROJECTS = 'SHOW_PROJECTS';
export class ShowProjectsAction implements Action {
    readonly type = SHOW_PROJECTS;
    constructor(public pagination?: Partial<Pagination>) {}
}
