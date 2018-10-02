import { Action } from '@ngrx/store';
import { Process, ProcessDiagramData, ServiceParameterMappings } from 'ama-sdk';
import { SelectedProcessElement } from './process-editor.state';
import { EntityDialogForm } from '../../store/actions';

export const UPDATE_SERVICE_PARAMETERS = '[ProcessEditor] Update Service Parameters';
export class UpdateServiceParametersAction implements Action {
    readonly type = UPDATE_SERVICE_PARAMETERS;
    constructor(public serviceId: string, public serviceParameterMappings: ServiceParameterMappings) {}
}

export const GET_PROCESS_ATTEMPT = '[Process] Get attempt';
export class GetProcessAttemptAction implements Action {
    readonly type = GET_PROCESS_ATTEMPT;
    constructor(public payload: string) {}
}

interface GotProcessSuccessActionPayload {
    process: Process;
    diagram: ProcessDiagramData;
}
export const GET_PROCESS_SUCCESS = '[Process] Get success';
export class GotProcessSuccessAction implements Action {
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
    content: ProcessDiagramData;
    metadata: Partial<EntityDialogForm>;
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
