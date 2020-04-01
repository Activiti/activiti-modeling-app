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

import { EntityDialogForm } from '../helpers/common';
import { Action } from '@ngrx/store';
import { Release, ServerSideSorting, SearchQuery, Project } from '../api/types';
import { FetchQueries } from '../api/project-api.interface';
import { Update } from '@ngrx/entity';
import { Pagination } from '@alfresco/js-api';

export const CREATE_PROJECT_ATTEMPT = 'CREATE_PROJECT_ATTEMPT';
export class CreateProjectAttemptAction implements Action {
    readonly type = CREATE_PROJECT_ATTEMPT;
    constructor(public payload: Partial<EntityDialogForm>) {}
}

export const OVERRIDE_PROJECT_ATTEMPT = 'OVERRIDE_PROJECT_ATTEMPT';
export class OverrideProjectAttemptAction implements Action {
    readonly type = OVERRIDE_PROJECT_ATTEMPT;
    constructor(public payload: any) {}
}

export interface ModelIdentifier {
    type: string;
    id: string;
}

export const MODEL_OPENED = 'MODEL_OPENED';
export class ModelOpenedAction implements Action {
    readonly type = MODEL_OPENED;
    constructor(public model: ModelIdentifier) {}
}

export const MODEL_CLOSED = 'MODEL_CLOSED';
export class ModelClosedAction implements Action {
    readonly type = MODEL_CLOSED;
    constructor(public model: ModelIdentifier) {}
}

export const GET_PROJECTS_ATTEMPT = 'GET_PROJECTS_ATTEMPT';
export class GetProjectsAttemptAction implements Action {
    readonly type = GET_PROJECTS_ATTEMPT;
    constructor(public pagination?: FetchQueries, public sorting?: ServerSideSorting, public search?: SearchQuery) {}
}

export const GET_PROJECT_ATTEMPT = 'GET_PROJECT_ATTEMPT';
export class GetProjectAttemptAction implements Action {
    readonly type = GET_PROJECT_ATTEMPT;
    constructor(public payload: string) {}
}

export const RELEASE_PROJECT_ATTEMPT = 'RELEASE_PROJECT_ATTEMPT';
export class ReleaseProjectAttemptAction implements Action {
    readonly type = RELEASE_PROJECT_ATTEMPT;
    constructor(public projectId: string) {}
}

export const RELEASE_PROJECT_SUCCESS = 'RELEASE_PROJECT_SUCCESS';
export class ReleaseProjectSuccessAction implements Action {
    readonly type = RELEASE_PROJECT_SUCCESS;
    constructor(public release: Partial<Release>, public projectId: string) {}
}

export const GET_PROJECT_SUCCESS = 'GET_PROJECT_SUCCESS';
export class GetProjectSuccessAction implements Action {
    readonly type = GET_PROJECT_SUCCESS;
    constructor(public payload: Partial<Project>) {}
}

export const UPLOAD_PROJECT_ATTEMPT = 'UPLOAD_PROJECT_ATTEMPT';
export class UploadProjectAttemptAction implements Action {
    readonly type = UPLOAD_PROJECT_ATTEMPT;
    constructor(public file: File, public name?: string) {}
}

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
