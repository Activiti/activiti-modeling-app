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
import { AppTheme } from '@alfresco-dbp/modeling-shared/sdk';

export enum AppActionTypes {
    AsyncInit = '[App] AsyncInit',
    LoggedIn = '[App] LoggedIn',
    Logout = '[App] Logout'
}

export class AsyncInitAction implements Action {
    readonly type = AppActionTypes.AsyncInit;
    constructor(public config: { selectedTheme: AppTheme; menuOpened: boolean; showConnectorsWithTemplate: boolean }) {}
}

export class LogoutAction implements Action {
    readonly type = AppActionTypes.Logout;
    constructor() {}
}

export class LoggedInAction implements Action {
    readonly type = AppActionTypes.LoggedIn;
    constructor() {}
}
