 /*!
 * @license
 * Copyright 2018 Alfresco, Inc. and/or its affiliates.
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
import { Process, ProcessContent, UpdateServiceParametersAction } from 'ama-sdk';
import { SelectedProcessElement } from './process-editor.state';
import { EntityDialogForm } from 'ama-sdk';
import {
    UploadProcessAttemptAction,
    ShowProcessesAction,
    GetProcessesAttemptAction,
    GetProcessesSuccessAction,
    CreateProcessAttemptAction,
    CreateProcessSuccessAction,
    DeleteProcessAttemptAction,
    DeleteProcessSuccessAction
} from '../../application-editor/store/actions/processes';

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
    processId: string;
    content: ProcessContent;
    action: Action;
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
    constructor(public payload: UpdateProcessPayload) {}
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
    | DeleteProcessSuccessAction
    | UpdateServiceParametersAction;
