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
import { ApplicationTreeState, INITIAL_APPLICATION_TREE_STATE as init, OPEN_FILTER, OpenFilterAction } from 'ama-sdk';
import { SELECT_APPLICATION, CLOSE_FILTER, CloseFilterAction } from '../application-editor.actions';


export function applicationTreeReducer(state: ApplicationTreeState = init, action: Action): ApplicationTreeState {
    let newState: ApplicationTreeState;

    switch (action.type) {
        case SELECT_APPLICATION:
            newState = { ...init };
            break;

        case OPEN_FILTER:
            newState = openFilter(state, <OpenFilterAction>action);
            break;

        case CLOSE_FILTER:
            newState = closeFilter(state, <CloseFilterAction>action);
            break;

        default:
            newState = Object.assign({}, state);
    }

    return newState;
}

function openFilter(state: ApplicationTreeState, action: OpenFilterAction): ApplicationTreeState {
    const newState = { ...state, openedFilters: [ ...state.openedFilters ] };

    if (newState.openedFilters.indexOf(action.filterType) < 0) {
        newState.openedFilters.push(action.filterType);
    }

    return newState;
}

function closeFilter(state: ApplicationTreeState, action: CloseFilterAction): ApplicationTreeState {
    const newState = {
        ...state,
        openedFilters: state.openedFilters.filter(filter => filter !== action.filterType)
    };

    return newState;
}
