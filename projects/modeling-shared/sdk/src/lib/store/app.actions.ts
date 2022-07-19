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
import { MODEL_TYPE } from '../api/types';
import { DialogData } from '@alfresco-dbp/adf-candidates/core/dialog';

export const SNACKBAR_ERROR = 'SNACKBAR_ERROR';
export class SnackbarErrorAction implements Action {
    readonly type = SNACKBAR_ERROR;
    constructor(public message: string, public params?: any) {}
}

export const SNACKBAR_INFO = 'SNACKBAR_INFO';
export class SnackbarInfoAction implements Action {
    readonly type = SNACKBAR_INFO;
    constructor(public message: string, public action?: { actions: Action[]; name: string }, public params?: any) {}
}

export const SNACKBAR_WARNING = 'SNACKBAR_WARNING';
export class SnackbarWarningAction implements Action {
    readonly type = SNACKBAR_WARNING;
    constructor(public message: string, public params?: any) {}
}

export const SET_APP_DIRTY_STATE = '[App] Set dirty state';
export class SetAppDirtyStateAction implements Action {
    readonly type = SET_APP_DIRTY_STATE;
    constructor(public payload: boolean) {}
}

export const UPDATE_TAB_TITLE = 'Update tab title';
export class UpdateTabTitle implements Action {
    readonly type = UPDATE_TAB_TITLE;
    constructor(public title: string, public modelId: string | number) {}
}

export const UPDATE_TAB_DIRTY_STATE = 'Update tab dirty state';
export class UpdateTabDirtyState implements Action {
    readonly type = UPDATE_TAB_DIRTY_STATE;
    constructor(public dirtyState: boolean, public modelId: string | number) {}
}

export interface OpenInfoDialogActionPayload {
    dialogData?: DialogData;
}

export interface OpenConfirmDialogActionPayload extends OpenInfoDialogActionPayload {
    action?: Action;
}

export interface ChangeThemePayload {
    theme: string;
}

export const OPEN_CONFIRM_DIALOG = 'OPEN_CONFIRM_DIALOG';
export class OpenConfirmDialogAction implements Action {
    readonly type = OPEN_CONFIRM_DIALOG;
    constructor(public payload: OpenConfirmDialogActionPayload) {}
}

export const OPEN_INFO_DIALOG = 'OPEN_INFO_DIALOG';
export class OpenInfoDialogAction implements Action {
    readonly type = OPEN_INFO_DIALOG;
    constructor(public payload: OpenInfoDialogActionPayload) {}
}

export const OPEN_SETTINGS_DIALOG = 'OPEN_SETTINGS_DIALOG';
export class OpenSettingsDialogAction implements Action {
    readonly type = OPEN_SETTINGS_DIALOG;
    constructor() {}
}

export const CHANGE_THEME = 'CHANGE_THEME';
export class ChangeThemeAction implements Action {
    readonly type = CHANGE_THEME;
    constructor(public payload: ChangeThemePayload) {}
}

export const OPEN_FILTER = '[App Tree] Open filter';
export class OpenFilterAction implements Action {
    readonly type = OPEN_FILTER;
    constructor(public filterType: MODEL_TYPE) {}
}

export const LEAVE_PROJECT = 'Leave project editor';
export class LeaveProjectAction implements Action {
    readonly type = LEAVE_PROJECT;
    constructor() {}
}

export const TOOLBAR_MESSAGE = '[App] TOOLBAR_MESSAGE';
export class ToolbarMessageAction implements Action {
    readonly type = TOOLBAR_MESSAGE;
    constructor(public message: string) {}
}

export const LOADED_APPLICATION = '[App] APPLICATION_LOADED';
export class SetApplicationLoadingStateAction implements Action {
    readonly type = LOADED_APPLICATION;
    constructor(public loading: boolean) {}
}

export const SET_LOG_HISTORY_VISIBILITY = '[App] SET_LOG_HISTORY_VISIBILITY';
export class SetLogHistoryVisibilityAction implements Action {
    readonly type = SET_LOG_HISTORY_VISIBILITY;
    constructor(public visible: boolean) {}
}

export const APP_RESET_ACTION = '[App] Reset';
export class ResetAction implements Action {
    readonly type = APP_RESET_ACTION;
    constructor() {}
}

export const CLEAR_LOG_HISTORY = '[App] CLEAR_LOG_HISTORY';
export class ClearLogHistoryAction implements Action {
    readonly type = CLEAR_LOG_HISTORY;
    constructor() {}
}

export const OPEN_ABOUT_DIALOG = 'Open About Dialog';
export class OpenAboutDialogAction implements Action {
    readonly type = OPEN_ABOUT_DIALOG;
    constructor() {}
}

export const OPEN_LOG_HISTORY =  'OPEN_LOG_HISTORY';
export class OpenLogHistory implements Action {
    readonly type = OPEN_LOG_HISTORY;
    constructor(public projectId: string) {}
}
