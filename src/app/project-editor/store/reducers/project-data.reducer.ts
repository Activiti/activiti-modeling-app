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
import { GET_PROJECT_SUCCESS, GetProjectSuccessAction, SELECT_PROJECT } from '../project-editor.actions';
import { INITIAL_PROJECT_DATA_STATE as init, ProjectDataState } from 'ama-sdk';

export function projectDataReducer(state: ProjectDataState = init, action: Action): ProjectDataState {
    let newState: ProjectDataState;

    switch (action.type) {
        case SELECT_PROJECT:
            newState = initProject(state);
            break;

        case GET_PROJECT_SUCCESS:
            newState = setProject(state, <GetProjectSuccessAction>action);
            break;

        default:
            newState = Object.assign({}, state);
    }

    return newState;
}

function initProject(state: ProjectDataState): ProjectDataState {
    return { ...init };
}

function setProject(state: ProjectDataState, action: GetProjectSuccessAction): ProjectDataState {
    const newState = Object.assign({}, state);
    newState.project = action.payload;
    return newState;
}

