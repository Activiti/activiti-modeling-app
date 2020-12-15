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
import { Process, ProcessContent, UpdateServiceParametersAction, ModelExtensions, EntityDialogForm, UploadFileAttemptPayload } from '@alfresco-dbp/modeling-shared/sdk';
import { SelectedProcessElement, ProcessModelContext } from './process-editor.state';
import { Update } from '@ngrx/entity';

export interface UpdateProcessExtensionsPayload {
    extensions: ModelExtensions;
    processId: string;
}

export const UPDATE_PROCESS_EXTENSIONS = '[Process] Update extensions';
export class UpdateProcessExtensionsAction implements Action {
    readonly type = UPDATE_PROCESS_EXTENSIONS;
    constructor(public payload: UpdateProcessExtensionsPayload) {}
}

export const DELETE_PROCESS_EXTENSION = '[Process] Delete extension';
export class DeleteProcessExtensionAction implements Action {
    readonly type = DELETE_PROCESS_EXTENSION;
    constructor(public processId: string, public bpmnProcessId: string) {}
}

export const SHOW_PROCESSES = '[App Tree] Show Processes';
export class ShowProcessesAction implements Action {
    readonly type = SHOW_PROCESSES;
    constructor(public projectId: string) {}
}

export const GET_PROCESSES_ATTEMPT = 'GET_PROCESSES_ATTEMPT';
export class GetProcessesAttemptAction implements Action {
    readonly type = GET_PROCESSES_ATTEMPT;
    constructor(public projectId: string) {}
}

export const GET_PROCESSES_SUCCESS = 'GET_PROCESSES_SUCCESS';
export class GetProcessesSuccessAction implements Action {
    readonly type = GET_PROCESSES_SUCCESS;
    constructor(public processes: Process[]) {}
}

export const UPLOAD_PROCESS_ATTEMPT = 'UPLOAD_PROCESS_ATTEMPT';
export class UploadProcessAttemptAction implements Action {
    readonly type = UPLOAD_PROCESS_ATTEMPT;
    constructor(public payload: UploadFileAttemptPayload) {}
}

export const CREATE_PROCESS_ATTEMPT = 'CREATE_PROCESS_ATTEMPT';
export class CreateProcessAttemptAction implements Action {
    readonly type = CREATE_PROCESS_ATTEMPT;
    constructor(public payload: Partial<EntityDialogForm>, public navigateTo = false) {}
}

export const CREATE_PROCESS_SUCCESS = 'CREATE_PROCESS_SUCCESS';
export class CreateProcessSuccessAction implements Action {
    readonly type = CREATE_PROCESS_SUCCESS;
    constructor(public process: Process, public navigateTo = false) {}
}

export const DELETE_PROCESS_ATTEMPT = 'DELETE_PROCESS_ATTEMPT';
export class DeleteProcessAttemptAction implements Action {
    readonly type = DELETE_PROCESS_ATTEMPT;
    constructor(public processId: string) {}
}

export const DELETE_PROCESS_SUCCESS = 'DELETE_PROCESS_SUCCESS';
export class DeleteProcessSuccessAction implements Action {
    readonly type = DELETE_PROCESS_SUCCESS;
    constructor(public processId: string) {}
}

export const GET_PROCESS_ATTEMPT = '[Process] Get attempt';
export class GetProcessAttemptAction implements Action {
    readonly type = GET_PROCESS_ATTEMPT;
    constructor(public payload: string) {}
}

interface GotProcessSuccessActionPayload {
    process: Process;
    diagram: ProcessContent;
}
export const GET_PROCESS_SUCCESS = '[Process] Get success';
export class GetProcessSuccessAction implements Action {
    readonly type = GET_PROCESS_SUCCESS;
    constructor(public payload: GotProcessSuccessActionPayload) {}
}

export const SELECT_MODELER_ELEMENT = 'SELECT_SHAPE';
export class SelectModelerElementAction implements Action {
    readonly type = SELECT_MODELER_ELEMENT;
    constructor(public element: SelectedProcessElement) {}
}

export interface UpdateProcessPayload {
    processId: string;
    content: ProcessContent;
    metadata: Partial<EntityDialogForm>;
}

export interface ValidateProcessPayload {
    title: string;
    processId: string;
    content: ProcessContent;
    extensions: ModelExtensions;
    action: Action;
    errorAction?: Action;
    projectId?: string;
}

export const VALIDATE_PROCESS_ATTEMPT = '[Process] Validate attempt';
export class ValidateProcessAttemptAction implements Action {
    readonly type = VALIDATE_PROCESS_ATTEMPT;
    constructor(public payload: ValidateProcessPayload) {}
}

export const UPDATE_PROCESS_ATTEMPT = '[Process] Update attempt';
export class UpdateProcessAttemptAction implements Action {
    readonly type = UPDATE_PROCESS_ATTEMPT;
    constructor(public payload: UpdateProcessPayload) {}
}

export const UPDATE_PROCESS_SUCCESS = '[Process] Update success';
export class UpdateProcessSuccessAction implements Action {
    readonly type = UPDATE_PROCESS_SUCCESS;
    constructor(public payload: Update<Partial<Process>>, public content: string) {}
}

export const UPDATE_PROCESS_FAILED = '[Process] Update failed';
export class UpdateProcessFailedAction implements Action {
    readonly type = UPDATE_PROCESS_FAILED;
    constructor() {}
}

export interface DownloadProcessPayload {
    id: string;
    name: string;
}
export const DOWNLOAD_PROCESS_DIAGRAM = 'DOWNLOAD_PROCESS_DIAGRAM';
export class DownloadProcessAction implements Action {
    readonly type = DOWNLOAD_PROCESS_DIAGRAM;
    constructor(public process: DownloadProcessPayload) {}
}

export const DOWNLOAD_PROCESS_SVG_IMAGE = 'DOWNLOAD_PROCESS_SVG_IMAGE';
export class DownloadProcessSVGImageAction implements Action {
    readonly type = DOWNLOAD_PROCESS_SVG_IMAGE;
    constructor(public process: DownloadProcessPayload) {}
}

export const CHANGED_PROCESS_DIAGRAM = 'CHANGED_PROCESS_DIAGRAM';
export class ChangedProcessAction implements Action {
    readonly type = CHANGED_PROCESS_DIAGRAM;
    constructor(public element?: SelectedProcessElement) {}
}

export const REMOVE_DIAGRAM_ELEMENT = 'REMOVE_DIAGRAM_ELEMENT';
export class RemoveDiagramElementAction implements Action {
    readonly type = REMOVE_DIAGRAM_ELEMENT;
    constructor(public element?: SelectedProcessElement) {}
}

export const REMOVE_ELEMENT_MAPPING = '[Process] Remove element mapping';
export class RemoveElementMappingAction implements Action {
    readonly type = REMOVE_ELEMENT_MAPPING;
    constructor(public elementId: string, public processModelId: string, public bpmnProcessElementId: string) {}
}

export const CHANGE_PROCESS_MODEL_ACTION = '[Process] Process tab changed';
export class ChangeProcessModelContextAction implements Action {
    readonly type = CHANGE_PROCESS_MODEL_ACTION;
    constructor(public name: ProcessModelContext) {}
}

export type ProcessActions =
    | ShowProcessesAction
    | UploadProcessAttemptAction
    | GetProcessesAttemptAction
    | GetProcessesSuccessAction
    | GetProcessAttemptAction
    | GetProcessSuccessAction
    | CreateProcessAttemptAction
    | CreateProcessSuccessAction
    | UpdateProcessAttemptAction
    | UpdateProcessSuccessAction
    | DeleteProcessAttemptAction
    | DeleteProcessExtensionAction
    | DeleteProcessSuccessAction
    | RemoveElementMappingAction
    | UpdateServiceParametersAction;
