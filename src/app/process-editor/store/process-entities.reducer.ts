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

import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import {
    GET_PROCESSES_ATTEMPT,
    GET_PROCESSES_SUCCESS,
    CREATE_PROCESS_SUCCESS,
    DELETE_PROCESS_SUCCESS,
    CreateProcessSuccessAction,
    GetProcessesSuccessAction,
    DeleteProcessSuccessAction,
    UPDATE_PROCESS_SUCCESS,
    GET_PROCESS_SUCCESS,
    GetProcessSuccessAction,
    UpdateProcessSuccessAction
} from './process-editor.actions';
import { UPDATE_PROCESS_VARIABLES, UpdateProcessVariablesAction } from './process-variables.actions';
import { ProcessEntitiesState, initialProcessEntitiesState, processAdapter } from './process-entities.state';
import { Process, UPDATE_SERVICE_PARAMETERS, UpdateServiceParametersAction, LEAVE_APPLICATION } from 'ama-sdk';

const cloneDeep = require('lodash/cloneDeep');

export function processEntitiesReducer(
    state: ProcessEntitiesState = initialProcessEntitiesState,
    action: Action
): ProcessEntitiesState {
    switch (action.type) {
        case CREATE_PROCESS_SUCCESS:
            return createProcess(state, <CreateProcessSuccessAction>action);

        case GET_PROCESSES_ATTEMPT:
            return { ...state, loading: true };

        case GET_PROCESSES_SUCCESS:
            return getProcessesSuccess(state, <GetProcessesSuccessAction> action);

        case DELETE_PROCESS_SUCCESS:
            return removeProcess(state, <DeleteProcessSuccessAction> action);

        case UPDATE_PROCESS_SUCCESS:
            return updateProcess(state, <UpdateProcessSuccessAction>action);

        case GET_PROCESS_SUCCESS:
            return getProcessSuccess(state, <GetProcessSuccessAction>action);

        case UPDATE_PROCESS_VARIABLES:
            return updateProcessVariables(state, <UpdateProcessVariablesAction> action);

        case UPDATE_SERVICE_PARAMETERS:
            return updateProcessVariablesMapping(state, <UpdateServiceParametersAction> action);

        case LEAVE_APPLICATION:
            return {
                ...state,
                loaded: false
            };

        default:
            return { ...state };
    }
}

function updateProcessVariables(state: ProcessEntitiesState, action: UpdateProcessVariablesAction): ProcessEntitiesState {
    const extensions = { ...state.entities[action.payload.processId].extensions };
    extensions.properties = action.payload.properties;

    return {
        ...state,
        entities: { ...state.entities, [action.payload.processId]: {
            ...state.entities[action.payload.processId],
            extensions
        } }
    };
}

function updateProcessVariablesMapping(state: ProcessEntitiesState, action: UpdateServiceParametersAction): ProcessEntitiesState {
    const newState = cloneDeep(state);
    newState.entities[action.processId].extensions = { variablesMappings: {}, ...newState.entities[action.processId].extensions };
    newState.entities[action.processId].extensions.variablesMappings[action.serviceId] = { ...action.serviceParameterMappings };

    return newState;
}

function createProcess(state: ProcessEntitiesState, action: CreateProcessSuccessAction): ProcessEntitiesState {
    return processAdapter.addOne(action.process, state);
}

function removeProcess(state: ProcessEntitiesState, action: DeleteProcessSuccessAction): ProcessEntitiesState {
    const newState = cloneDeep(state);

    newState.entityContents[action.processId] = null;

    return processAdapter.removeOne(action.processId, newState);
}

function getProcessSuccess(state: ProcessEntitiesState, action: GetProcessSuccessAction): ProcessEntitiesState {
    const newState = cloneDeep(state);

    newState.entityContents[action.payload.process.id] = action.payload.diagram;

    return processAdapter.upsertOne(action.payload.process, newState);
}

function getProcessesSuccess(state: ProcessEntitiesState, action: GetProcessesSuccessAction): ProcessEntitiesState {
    return processAdapter.addMany(action.processes, {
        ...state,
        loading: false,
        loaded: true
    });
}

function updateProcess(state: ProcessEntitiesState, action: UpdateProcessSuccessAction): ProcessEntitiesState {
    const newState = cloneDeep(state);

    newState.entityContents[action.payload.processId] = action.payload.content;

    return processAdapter.updateOne(<Update<Partial<Process>>>{
        id: action.payload.processId,
        ...action.payload.metadata
    }, newState);
}
