import { Action } from '@ngrx/store';

export const SNACKBAR_ERROR = 'SNACKBAR_ERROR';
export class SnackbarErrorAction implements Action {
    readonly type = SNACKBAR_ERROR;
    constructor(public payload: string) {}
}

export const SNACKBAR_INFO = 'SNACKBAR_INFO';
export class SnackbarInfoAction implements Action {
    readonly type = SNACKBAR_INFO;
    constructor(public payload: string) {}
}

export const SNACKBAR_WARNING = 'SNACKBAR_WARNING';
export class SnackbarWarningAction implements Action {
    readonly type = SNACKBAR_WARNING;
    constructor(public payload: string) {}
}

export const SET_APP_DIRTY_STATE = '[App] Set dirty state';
export class SetAppDirtyStateAction implements Action {
    readonly type = SET_APP_DIRTY_STATE;
    constructor(public payload: boolean) {}
}

export interface ConfirmDialogData {
    title?: string;
    subtitle?: string;
    errors?: string[];
}

export interface OpenConfirmDialogActionPayload {
    action: Action;
    dialogData: ConfirmDialogData;
}

export const OPEN_CONFIRM_DIALOG = 'OPEN_CONFIRM_DIALOG';
export class OpenConfirmDialogAction implements Action {
    readonly type = OPEN_CONFIRM_DIALOG;
    constructor(public payload: OpenConfirmDialogActionPayload) {}
}
