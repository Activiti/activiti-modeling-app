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

export const OPEN_CANDIDATE_STARTERS_DIALOG = 'Open candidate starters dialog';

export class OpenCandidateStartersDialogAction implements Action {
    readonly type = OPEN_CANDIDATE_STARTERS_DIALOG;
    constructor() {}
}

export interface UpdateCandidateStartersPayload {
    id: string;
    data: AssignmentModel;
}

export const UPDATE_CANDIDATE_STARTERS_VARIABLES = 'UPDATE_CANDIDATE_STARTERS';
export class UpdateCandidateStartersAction implements Action {
    readonly type = UPDATE_CANDIDATE_STARTERS_VARIABLES;
    constructor(public payload: UpdateCandidateStartersPayload) {}
}
