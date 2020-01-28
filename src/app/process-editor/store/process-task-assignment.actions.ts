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
import { AssignmentModel } from '../components/assignment/assignment-dialog.component';

export const OPEN_TASK_ASSIGNMENT_DIALOG = 'Open task assignment dialog';

export class OpenTaskAssignmentDialogAction implements Action {
    readonly type = OPEN_TASK_ASSIGNMENT_DIALOG;
    constructor() {}
}

export interface UpdateTaskAssignmentPayload {
    id: string;
    data: AssignmentModel;
}

export const UPDATE_TASK_ASSIGNMENT_VARIABLES = 'UPDATE_TASK_ASSIGNMENT';
export class UpdateTaskAssignmentAction implements Action {
    readonly type = UPDATE_TASK_ASSIGNMENT_VARIABLES;
    constructor(public payload: UpdateTaskAssignmentPayload) {}
}
