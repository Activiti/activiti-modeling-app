import { Action } from '@ngrx/store';

export const SET_MENU = 'SET_MENU';
export class SetMenuAction implements Action {
    readonly type = SET_MENU;
    constructor(public payload: boolean) {}
}

export const SET_APP_DIRTY_STATE = '[App] Set dirty state';
export class SetAppDirtyStateAction implements Action {
    readonly type = SET_APP_DIRTY_STATE;
    constructor(public payload: boolean) {}
}
