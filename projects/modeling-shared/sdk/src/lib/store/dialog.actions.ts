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
import { TemplateRef } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { EntityDialogPayload, ProjectEntityDialogForm } from '../helpers/common';

export const OPEN_DIALOG = 'OPEN_DIALOG';
export class OpenDialogAction<T> implements Action {
    readonly type = OPEN_DIALOG;
    constructor(
        public dialogContent: ComponentType<T> | TemplateRef<T>,
        public dialogConfig?: MatDialogConfig
    ) {}
}

export const CLOSE_ALL_DIALOGS = 'CLOSE_ALL_DIALOGS';
export class CloseAllDialogsAction implements Action {
    readonly type = CLOSE_ALL_DIALOGS;
}

export const OPEN_ENTITY_DIALOG = 'OPEN_ENTITY_DIALOG';
export class OpenEntityDialogAction implements Action {
    readonly type = OPEN_ENTITY_DIALOG;
    constructor(public payload: EntityDialogPayload) {}
}

export const CREATE_PROJECT_DIALOG = 'CREATE_PROJECT_DIALOG';
export class CreateProjectDialogAction implements Action {
    readonly type = CREATE_PROJECT_DIALOG;
}

export const OVERRIDE_PROJECT_NAME_DIALOG = 'OVERRIDE_PROJECT_NAME_DIALOG';
export class OverrideProjectNameDialogAction implements Action {
    readonly type = OVERRIDE_PROJECT_NAME_DIALOG;
    constructor(public file: File, public name: string) {}
}

export const IMPORT_PROJECT_DIALOG = 'IMPORT_PROJECT_DIALOG';
export class ImportProjectDialogAction implements Action {
    readonly type = IMPORT_PROJECT_DIALOG;
}

export const EDIT_PROJECT_DIALOG = 'EDIT_PROJECT_DIALOG';
export class EditProjectDialogAction implements Action {
    readonly type = EDIT_PROJECT_DIALOG;
    constructor(public payload: ProjectEntityDialogForm) {}
}
