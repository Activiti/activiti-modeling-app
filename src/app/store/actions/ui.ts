import { Action } from '@ngrx/store';

export const SET_MENU = 'SET_MENU';
export class SetMenuAction implements Action {
    readonly type = SET_MENU;
    constructor(public payload: boolean) {}
}

