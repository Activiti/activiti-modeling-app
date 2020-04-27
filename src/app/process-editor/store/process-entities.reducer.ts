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
    RemoveElementMappingAction,
    DELETE_PROCESS_EXTENSION,
    DeleteProcessExtensionAction
} from './process-editor.actions';
import { UPDATE_PROCESS_VARIABLES, UpdateProcessVariablesAction } from './process-variables.actions';
import { ProcessEntitiesState, initialProcessEntitiesState, processAdapter } from './process-entities.state';
import {
    UPDATE_SERVICE_PARAMETERS,
    UpdateServiceParametersAction,
    LEAVE_PROJECT,
    ProcessExtensionsModel,
    UPDATE_TASK_ASSIGNMENTS,
    UpdateServiceAssignmentAction,
    EntityProperty,
    EntityProperties,
    ProcessExtensionsContent,
    createExtensionsObject
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

        case DELETE_PROCESS_EXTENSION:
            return deleteExtensions(state, <DeleteProcessExtensionAction> action);

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
    const mappings = newState.entities[action.processModelId].extensions[action.bpmnProcessElementId].mappings;
    const constants = newState.entities[action.processModelId].extensions[action.bpmnProcessElementId].constants;
    const assignments = newState.entities[action.processModelId].extensions[action.bpmnProcessElementId].assignments;

    if (mappings && mappings[action.elementId]) {
        delete newState.entities[action.processModelId].extensions[action.bpmnProcessElementId].mappings[action.elementId];
    }

    if (constants && constants[action.elementId]) {
        delete newState.entities[action.processModelId].extensions[action.bpmnProcessElementId].constants[action.elementId];
    }

    if (assignments && assignments[action.elementId]) {
        delete newState.entities[action.processModelId].extensions[action.bpmnProcessElementId].assignments[action.elementId];
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

function deleteExtensions(state: ProcessEntitiesState, action: DeleteProcessExtensionAction): ProcessEntitiesState {
    const entity = cloneDeep(state.entities[action.processId]);
    delete entity.extensions[action.bpmnProcessId];
    return {
        ...state,
        entities: {
            ...state.entities,
            [action.processId]: {
                ...entity
            }
        }
    };
}

function updateProcessVariables(state: ProcessEntitiesState, action: UpdateProcessVariablesAction): ProcessEntitiesState {
    const oldExtensions = cloneDeep(state.entities[action.payload.modelId].extensions);
    const oldProcessModel = new ProcessExtensionsModel(oldExtensions);
    if (!oldExtensions[action.payload.processId]) {
        oldExtensions[action.payload.processId] = createExtensionsObject();
    }
    const oldProperties = oldExtensions[action.payload.processId].properties;
    const newExtensions = oldProcessModel.setProperties(action.payload.processId, action.payload.properties);
    const newProcessExtensions = newExtensions[action.payload.processId];

    removeUpdatedPropertyMappings(newProcessExtensions, oldProperties);
    removeDeletedPropertyMapping(newProcessExtensions, oldProperties);

    return {
        ...state,
        entities: {
            ...state.entities,
            [action.payload.modelId]: {
                ...state.entities[action.payload.modelId],
                extensions: newExtensions
            }
        }
    };
}

function removeUpdatedPropertyMappings(newProcessExtensions: ProcessExtensionsContent, oldProperties: EntityProperties) {
    Object.values(newProcessExtensions.properties).forEach((property: EntityProperty) => {
        if (oldProperties[property.id] && (oldProperties[property.id].name !== property.name || oldProperties[property.id].type !== property.type)) {
            Object.keys(newProcessExtensions.mappings).forEach((elementId) => {
                removeParamMappings(newProcessExtensions.mappings, elementId, oldProperties[property.id].name);
                removeEmptyMapping(newProcessExtensions.mappings, elementId);
            });
        }
    });
}

function removeDeletedPropertyMapping(newProcessExtensions: ProcessExtensionsContent, oldProperties: EntityProperties) {
    const deletedProperties = Object.keys(oldProperties).filter((oldProperty) => {
        return Object.keys(newProcessExtensions.properties).findIndex(newProperty => newProperty === oldProperty) === -1;
    });
    Object.values(deletedProperties).forEach((oldPropertyId) => {
        Object.keys(newProcessExtensions.mappings).forEach((elementId) => {
            removeParamMappings(newProcessExtensions.mappings, elementId, oldProperties[oldPropertyId].name);
            removeEmptyMapping(newProcessExtensions.mappings, elementId);
        });
    });
}

function removeParamMappings(mappings, elementId, propertyName) {
    removeOutputMappings(mappings[elementId], propertyName);
    removeInputMappings(mappings[elementId], propertyName);

    removeEmptyElementMapping(mappings[elementId], 'inputs');
    removeEmptyElementMapping(mappings[elementId], 'outputs');
}

function removeOutputMappings(elementMappings, propertyName) {
    if (elementMappings.outputs && elementMappings.outputs[propertyName]) {
        delete elementMappings.outputs[propertyName];
    }
}

function removeInputMappings(elementMappings, propertyName) {
    if (elementMappings.inputs) {
        Object.keys(elementMappings.inputs).forEach((fieldId) => {
            if (elementMappings.inputs[fieldId].type === 'variable' && elementMappings.inputs[fieldId].value === propertyName) {
                delete elementMappings.inputs[fieldId];
            }
        });
    }
}

function removeEmptyElementMapping(elementMappings, key) {
    if (!!elementMappings[key] && !Object.keys(elementMappings[key]).length) {
        delete elementMappings[key];
    }
}

function removeEmptyMapping(mappings, elementId) {
    if (!Object.keys(mappings[elementId]).length) {
        delete mappings[elementId];
    }
}

function updateProcessVariablesMapping(state: ProcessEntitiesState, action: UpdateServiceParametersAction): ProcessEntitiesState {
    const oldExtensions = cloneDeep(state.entities[action.modelId].extensions);
    const processExtensionsModel = new ProcessExtensionsModel(oldExtensions);
    let newExtensions = processExtensionsModel.setMappings(action.processId, action.serviceId, action.serviceParameterMappings);

    const newProcessExtensions = newExtensions[action.processId];

    if (newProcessExtensions.mappings[action.serviceId]) {
        if (Object.keys(newProcessExtensions.mappings[action.serviceId]).length) {
            removeEmptyElementMapping(newProcessExtensions.mappings[action.serviceId], 'inputs');
            removeEmptyElementMapping(newProcessExtensions.mappings[action.serviceId], 'outputs');
        }
        removeEmptyMapping(newProcessExtensions.mappings, action.serviceId);
    }

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
