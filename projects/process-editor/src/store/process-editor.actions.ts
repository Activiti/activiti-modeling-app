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
import {
    Process, ProcessContent, UpdateServiceParametersAction, ModelExtensions, EntityDialogForm, UploadFileAttemptPayload, SaveAsDialogPayload, ShowProcessesAction
} from '@alfresco-dbp/modeling-shared/sdk';
import { SelectedProcessElement, ProcessModelContext } from './process-editor.state';
import { Update } from '@ngrx/entity';

export interface UpdateProcessExtensionsPayload {
    extensions: ModelExtensions;
    modelId: string;
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

export interface ProcessEntityDialogForm extends EntityDialogForm {
    category: string;
}

export interface UpdateProcessPayload {
    modelId: string;
    modelContent: ProcessContent;
    modelMetadata: Process;
}

export interface ValidateProcessPayload {
    title: string;
    modelId: string;
    modelContent: ProcessContent;
    modelMetadata: Process;
    action: Action;
    errorAction?: Action;
    projectId?: string;
}

export const VALIDATE_PROCESS_ATTEMPT = '[Process] Validate attempt';
export class ValidateProcessAttemptAction implements Action {
    readonly type = VALIDATE_PROCESS_ATTEMPT;
    constructor(public payload: ValidateProcessPayload) {}
}

export const VALIDATE_PROCESS_SUCCESS = '[Process] Validate success';
export class ValidateProcessSuccessAction implements Action {
    readonly type = VALIDATE_PROCESS_SUCCESS;
    constructor(public payload: Action[]) {}
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

export const DRAFT_UPDATE_PROCESS_CONTENT = '[Process] Draft Content update';
export class DraftUpdateProcessContentAction implements Action {
    readonly type = DRAFT_UPDATE_PROCESS_CONTENT;
    constructor(public payload: Update<Partial<Process>>, public content: string) {}
}

export const DRAFT_DELETE_PROCESS = '[Process] Draft Delete';
export class DraftDeleteProcessAction implements Action {
    readonly type = DRAFT_DELETE_PROCESS;
    constructor(public modelId: string) {}
}

export interface DownloadProcessPayload {
    id: string;
    name: string;
}
export const DOWNLOAD_PROCESS_DIAGRAM = 'DOWNLOAD_PROCESS_DIAGRAM';
export class DownloadProcessAction implements Action {
    readonly type = DOWNLOAD_PROCESS_DIAGRAM;
    constructor(public modelId: string) {}
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

export const OPEN_PROCESS_SAVE_AS_FORM = '[Process] Open save as process';
export class OpenSaveAsProcessAction implements Action {
    readonly type = OPEN_PROCESS_SAVE_AS_FORM;
    constructor(public dialogData: SaveAsDialogPayload) {}
}

export const SAVE_AS_PROCESS_ATTEMPT = '[Process] Save as attempt';
export class SaveAsProcessAttemptAction implements Action {
    readonly type = SAVE_AS_PROCESS_ATTEMPT;
    constructor(public payload: SaveAsDialogPayload, public navigateTo = false) {}
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
    | UpdateServiceParametersAction
    | DraftUpdateProcessContentAction
    | DraftDeleteProcessAction;
