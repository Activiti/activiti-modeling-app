 /*!
 * @license
 * Copyright 2018 Alfresco, Inc. and/or its affiliates.
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
import { GET_APPLICATION_SUCCESS, GetApplicationSuccessAction, SELECT_APPLICATION } from '../actions/application';
import { INITIAL_APPLICATION_DATA_STATE as init, ApplicationDataState } from 'ama-sdk';

export function applicationDataReducer(state: ApplicationDataState = init, action: Action): ApplicationDataState {
    let newState: ApplicationDataState;

    switch (action.type) {
        case SELECT_APPLICATION:
            newState = initApplication(state);
            break;

        case GET_APPLICATION_SUCCESS:
            newState = setApplication(state, <GetApplicationSuccessAction>action);
            break;

        default:
            newState = Object.assign({}, state);
    }

    return newState;
}

function initApplication(state: ApplicationDataState): ApplicationDataState {
    return { ...init };
}

function setApplication(state: ApplicationDataState, action: GetApplicationSuccessAction): ApplicationDataState {
    const newState = Object.assign({}, state);
    newState.datum = action.payload;
    return newState;
}
