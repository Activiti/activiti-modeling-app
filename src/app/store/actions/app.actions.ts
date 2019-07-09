 /*!
 * @license
 * Copyright 2019 Alfresco, Inc. and/or its affiliates.
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
import { AppTheme } from 'ama-sdk';

export enum AppActionTypes {
    AsyncInit = '[App] AsyncInit',
    LoggedIn = '[App] LoggedIn',
    Logout = '[App] Logout'
}

export class AsyncInitAction implements Action {
    readonly type = AppActionTypes.AsyncInit;
    constructor(public config: { selectedTheme: AppTheme; menuOpened: boolean, showConnectorsWithTemplate: boolean }) {}
}

export class LogoutAction implements Action {
    readonly type = AppActionTypes.Logout;
    constructor() {}
}

export class LoggedInAction implements Action {
    readonly type = AppActionTypes.LoggedIn;
    constructor() {}
}

export const SET_LOG_HISTORY_VISIBILITY = '[App] SET_LOG_HISTORY_VISIBILITY';
export class SetLogHistoryVisibilityAction implements Action {
    readonly type = SET_LOG_HISTORY_VISIBILITY;
    constructor(public visible: boolean) {}
}

export const CLEAR_LOG_HISTORY = '[App] CLEAR_LOG_HISTORY';
export class ClearLogHistoryAction implements Action {
    readonly type = CLEAR_LOG_HISTORY;
    constructor() {}
}

export const TOOLBAR_MESSAGE = '[App] TOOLBAR_MESSAGE';
export class ToolbarMessageAction implements Action {
    readonly type = TOOLBAR_MESSAGE;
    constructor(public message: string) {}
}

export type AppActions = AsyncInitAction | LogoutAction | LoggedInAction;
