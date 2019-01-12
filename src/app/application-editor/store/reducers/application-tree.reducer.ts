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
import {
    GET_PROCESSES_SUCCESS,
    GetProcessesSuccessAction,
    CREATE_PROCESS_SUCCESS,
    CreateProcessSuccessAction,
    DELETE_PROCESS_SUCCESS,
    DeleteProcessSuccessAction
} from '../actions/processes';
import { ApplicationTreeState, INITIAL_APPLICATION_TREE_STATE as init, OPEN_FILTER, OpenFilterAction } from 'ama-sdk';
import { Process } from 'ama-sdk';
import { SELECT_APPLICATION, CLOSE_FILTER, CloseFilterAction } from '../actions/application';
import { UPDATE_PROCESS_SUCCESS, UpdateProcessSuccessAction } from '../../../process-editor/store/process-editor.actions';
const keyBy = require('lodash/keyBy');


export function applicationTreeReducer(state: ApplicationTreeState = init, action: Action): ApplicationTreeState {
    let newState: ApplicationTreeState;

    switch (action.type) {
        case SELECT_APPLICATION:
            newState = initTree(state);
            break;

        case GET_PROCESSES_SUCCESS:
            newState = setProcesses(state, <GetProcessesSuccessAction>action);
            break;

        case CREATE_PROCESS_SUCCESS:
            newState = createProcess(state, <CreateProcessSuccessAction>action);
            break;

        case UPDATE_PROCESS_SUCCESS:
            newState = updateProcess(state, <UpdateProcessSuccessAction>action);
            break;

        case DELETE_PROCESS_SUCCESS:
            newState = deleteProcess(state, <DeleteProcessSuccessAction>action);
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

function initTree(state: ApplicationTreeState): ApplicationTreeState {
    return { ...init };
}


function setProcesses(state: ApplicationTreeState, action: GetProcessesSuccessAction): ApplicationTreeState {
    const newState = { ...state };
    newState.processes = keyBy(action.processes, 'id');
    return newState;
}

function createProcess(state: ApplicationTreeState, action: CreateProcessSuccessAction): ApplicationTreeState {
    const newState = { ...state },
        newProcess = action.process;

    newState.processes = {
        ...state.processes,
        [newProcess.id]: newProcess
    };

    return newState;
}

function updateProcess(state: ApplicationTreeState, action: UpdateProcessSuccessAction): ApplicationTreeState {
    const newState = { ...state },
        oldProcess = state.processes[action.payload.processId],
        newProcess = { ...oldProcess, ...action.payload.metadata };

    newState.processes = {
        ...state.processes,
        [action.payload.processId]: <Process>newProcess
    };

    return newState;
}

function deleteProcess(state: ApplicationTreeState, action: DeleteProcessSuccessAction): ApplicationTreeState {
    const newState = { ...state };
    const processId = action.processId;

    newState.processes = { ...state.processes };
    delete newState.processes[processId];

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
