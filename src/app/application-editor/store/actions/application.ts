import { Action } from '@ngrx/store';
import { Application, ARTIFACT_TYPE } from 'ama-sdk';

export const SELECT_APPLICATION = 'SELECT_APPLICATION';
export class SelectApplicationAction implements Action {
    readonly type = SELECT_APPLICATION;
    constructor(public payload: string) {}
}

export const OPEN_FILTER = '[App Tree] Open filter';
export class OpenFilterAction implements Action {
    readonly type = OPEN_FILTER;
    constructor(public filterType: ARTIFACT_TYPE) {}
}

export const CLOSE_FILTER = '[App Tree] Close filter';
export class CloseFilterAction implements Action {
    readonly type = CLOSE_FILTER;
    constructor(public filterType: ARTIFACT_TYPE) {}
}

export const GET_APPLICATION_ATTEMPT = 'GET_APPLICATION_ATTEMPT';
export class GetApplicationAttemptAction implements Action {
    readonly type = GET_APPLICATION_ATTEMPT;
    constructor(public payload: string) {}
}

export const GET_APPLICATION_SUCCESS = 'GET_APPLICATION_SUCCESS';
export class GetApplicationSuccessAction implements Action {
    readonly type = GET_APPLICATION_SUCCESS;
    constructor(public payload: Partial<Application>) {}
}
export interface ExportApplicationPayload {
    applicationId: string;
    applicationName: string;
}
export const EXPORT_APPLICATION = 'EXPORT_APPLICATION';
export class ExportApplicationAction implements Action {
    readonly type = EXPORT_APPLICATION;
    constructor(public payload: ExportApplicationPayload) {}
}
