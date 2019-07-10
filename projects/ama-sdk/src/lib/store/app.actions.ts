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
    action?: Action;
    dialogData?: ConfirmDialogData;
}

export const OPEN_CONFIRM_DIALOG = 'OPEN_CONFIRM_DIALOG';
export class OpenConfirmDialogAction implements Action {
    readonly type = OPEN_CONFIRM_DIALOG;
    constructor(public payload: OpenConfirmDialogActionPayload) {}
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
