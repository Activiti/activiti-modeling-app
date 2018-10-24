import { Action } from '@ngrx/store';
import { ProcessProperties } from 'ama-sdk';

export const OPEN_VARIABLES_DIALOG = 'Open dialog';

export class OpenVariablesDialogAction implements Action {
    readonly type = OPEN_VARIABLES_DIALOG;
    constructor() {}
}

export const UPDATE_PROCESS_VARIABLES = 'UPDATE_PROCESS_VARIABLES';
export class UpdateProcessVariablesAction implements Action {
    readonly type = UPDATE_PROCESS_VARIABLES;
    constructor(public properties: ProcessProperties) {}
}
