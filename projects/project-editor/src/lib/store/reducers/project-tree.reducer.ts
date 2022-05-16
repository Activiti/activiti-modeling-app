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
import { ProjectTreeState, INITIAL_PROJECT_TREE_STATE as init, OPEN_FILTER, OpenFilterAction, SELECT_PROJECT } from '@alfresco-dbp/modeling-shared/sdk';
import { CLOSE_FILTER, CloseFilterAction, CHANGE_FILTER_STATUS, ChangeFilterStatus } from '../project-editor.actions';

export function projectTreeReducer(state: ProjectTreeState = init, action: Action): ProjectTreeState {
    let newState: ProjectTreeState;

    switch (action.type) {
    case SELECT_PROJECT:
        newState = { ...init };
        break;

    case OPEN_FILTER:
        newState = openFilter(state, <OpenFilterAction>action);
        break;

    case CLOSE_FILTER:
        newState = closeFilter(state, <CloseFilterAction>action);
        break;

    case CHANGE_FILTER_STATUS:
        newState = changeFilterStatus(state, <ChangeFilterStatus>action);
        break;

    default:
        newState = Object.assign({}, state);
    }

    return newState;
}

function openFilter(state: ProjectTreeState, action: OpenFilterAction): ProjectTreeState {
    const newState = { ...state, openedFilters: [ ...state.openedFilters ] };

    if (newState.openedFilters.indexOf(action.filterType) < 0) {
        newState.openedFilters.push(action.filterType);
    }

    return newState;
}

function closeFilter(state: ProjectTreeState, action: CloseFilterAction): ProjectTreeState {
    const newState = {
        ...state,
        openedFilters: state.openedFilters.filter(filter => filter !== action.filterType)
    };

    return newState;
}

function changeFilterStatus(state: ProjectTreeState, action: ChangeFilterStatus): ProjectTreeState {
    const newState = { ...state, openedFilters: [...state.openedFilters] };

    const filterIndex = newState.openedFilters.indexOf(action.filterType);

    if (filterIndex < 0) {
        newState.openedFilters.push(action.filterType);
    } else {
        newState.openedFilters.splice(filterIndex, 1);
    }

    return newState;
}
