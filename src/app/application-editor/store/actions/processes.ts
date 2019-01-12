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
import { Process } from 'ama-sdk';
import { EntityDialogForm } from 'ama-sdk';
import { UploadFileAttemptPayload } from 'ama-sdk';

export const SHOW_PROCESSES = '[App Tree] Show Processes';
export class ShowProcessesAction implements Action {
    readonly type = SHOW_PROCESSES;
    constructor(public applicationId: string) {}
}

export const GET_PROCESSES_ATTEMPT = 'GET_PROCESSES_ATTEMPT';
export class GetProcessesAttemptAction implements Action {
    readonly type = GET_PROCESSES_ATTEMPT;
    constructor(public applicationId: string) {}
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
    constructor(public payload: Partial<EntityDialogForm>) {}
}

export const CREATE_PROCESS_SUCCESS = 'CREATE_PROCESS_SUCCESS';
export class CreateProcessSuccessAction implements Action {
    readonly type = CREATE_PROCESS_SUCCESS;
    constructor(public process: Process) {}
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
