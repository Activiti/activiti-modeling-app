import { Action } from '@ngrx/store';
import { Process } from 'ama-sdk';
import { EntityDialogForm } from '../../../store/actions';

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
    constructor(public processes: Partial<Process>[]) {}
}

export interface UploadFileAttemptPayload {
    file: File;
    applicationId: string;
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
    constructor(public process: Partial<Process>) {}
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
