import { Action } from '@ngrx/store';

export enum AppActionTypes {
    AsyncInit = '[App] AsyncInit',
    LoggedIn = '[App] LoggedIn',
    Logout = '[App] Logout'
}

export class AsyncInitAction implements Action {
    readonly type = AppActionTypes.AsyncInit;
    constructor(public config: { menuOpened: boolean }) {}
}

export class LogoutAction implements Action {
    readonly type = AppActionTypes.Logout;
    constructor() {}
}

export class LoggedInAction implements Action {
    readonly type = AppActionTypes.LoggedIn;
    constructor() {}
}

export type AppActions = AsyncInitAction | LogoutAction | LoggedInAction;
