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
    UpdateProcessSuccessAction,
    UPDATE_PROCESS_EXTENSIONS,
    UpdateProcessExtensionsAction,
    REMOVE_ELEMENT_MAPPING,
    RemoveElementMappingAction
} from './process-editor.actions';
import { UPDATE_PROCESS_VARIABLES, UpdateProcessVariablesAction } from './process-variables.actions';
import { ProcessEntitiesState, initialProcessEntitiesState, processAdapter } from './process-entities.state';
import {
    UPDATE_SERVICE_PARAMETERS,
    UpdateServiceParametersAction,
    LEAVE_PROJECT,
    ProcessExtensionsModel,
    UPDATE_TASK_ASSIGNMENTS,
    UpdateServiceAssignmentAction
} from '@alfresco-dbp/modeling-shared/sdk';

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
            return getProcessesSuccess(state, <GetProcessesSuccessAction>action);

        case DELETE_PROCESS_SUCCESS:
            return removeProcess(state, <DeleteProcessSuccessAction>action);

        case UPDATE_PROCESS_SUCCESS:
            return updateProcess(state, <UpdateProcessSuccessAction>action);

        case GET_PROCESS_SUCCESS:
            return getProcessSuccess(state, <GetProcessSuccessAction>action);

        case UPDATE_PROCESS_VARIABLES:
            return updateProcessVariables(state, <UpdateProcessVariablesAction>action);

        case UPDATE_SERVICE_PARAMETERS:
            return updateProcessVariablesMapping(state, <UpdateServiceParametersAction>action);

        case UPDATE_TASK_ASSIGNMENTS:
            return updateProcessTaskAssignments(state, <UpdateServiceAssignmentAction>action);

        case UPDATE_PROCESS_EXTENSIONS:
            return updateExtensions(state, <UpdateProcessExtensionsAction>action);

        case REMOVE_ELEMENT_MAPPING:
            return removeElementMapping(state, <RemoveElementMappingAction>action);

        case LEAVE_PROJECT:
            return {
                ...state,
                loaded: false
            };

        default:
            return { ...state };
    }
}

function removeElementMapping(state: ProcessEntitiesState, action: RemoveElementMappingAction): ProcessEntitiesState {
    const newState = cloneDeep(state);
    const mappings = newState.entities[action.processId].extensions.mappings;
    const constants = newState.entities[action.processId].extensions.constants;

    if (mappings && mappings[action.elementId]) {
        delete newState.entities[action.processId].extensions.mappings[action.elementId];
    }

    if (constants && constants[action.elementId]) {
        delete newState.entities[action.processId].extensions.constants[action.elementId];
    }

    return newState;
}

function updateExtensions(state: ProcessEntitiesState, action: UpdateProcessExtensionsAction): ProcessEntitiesState {
    return {
        ...state,
        entities: {
            ...state.entities, [action.payload.processId]: {
                ...state.entities[action.payload.processId],
                extensions: action.payload.extensions
            }
        }
    };
}

function updateProcessVariables(state: ProcessEntitiesState, action: UpdateProcessVariablesAction): ProcessEntitiesState {
    const oldExtensions = cloneDeep(state.entities[action.payload.modelId].extensions);
    const newExtensions = new ProcessExtensionsModel(oldExtensions).setProperties(action.payload.processId, action.payload.properties);

    return {
        ...state,
        entities: {
            ...state.entities, [action.payload.modelId]: {
                ...state.entities[action.payload.modelId],
                extensions: newExtensions
            }
        }
    };
}

function updateProcessVariablesMapping(state: ProcessEntitiesState, action: UpdateServiceParametersAction): ProcessEntitiesState {
    const oldExtensions = cloneDeep(state.entities[action.modelId].extensions);
    const processExtensionsModel = new ProcessExtensionsModel(oldExtensions);
    let newExtensions = processExtensionsModel.setMappings(action.processId, action.serviceId, action.serviceParameterMappings);

    if (action.constants) {
        newExtensions = processExtensionsModel.setConstants(action.processId, action.serviceId, action.constants);
    }

    return {
        ...state,
        entities: {
            ...state.entities, [action.modelId]: {
                ...state.entities[action.modelId],
                extensions: newExtensions
            }
        }
    };
}

function updateProcessTaskAssignments(state: ProcessEntitiesState, action: UpdateServiceAssignmentAction): ProcessEntitiesState {
    const oldExtensions = cloneDeep(state.entities[action.modelId].extensions);
    const newExtensions = new ProcessExtensionsModel(oldExtensions).setAssignments(action.processId, action.serviceId, action.taskAssignment);

    return {
        ...state,
        entities: {
            ...state.entities, [action.modelId]: {
                ...state.entities[action.modelId],
                extensions: newExtensions
            }
        }
    };
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
    const newState = {
        ...state,
        entityContents: {
            ...state.entityContents,
            [action.payload.id]: action.content
        }
    };

    return processAdapter.updateOne({ ...action.payload, changes: action.payload.changes }, newState);
}
