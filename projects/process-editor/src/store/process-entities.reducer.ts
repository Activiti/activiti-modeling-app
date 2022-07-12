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

/* eslint-disable max-lines */

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
    DeleteProcessExtensionAction,
    DraftUpdateProcessContentAction,
    DraftDeleteProcessAction,
    DRAFT_UPDATE_PROCESS_CONTENT,
    DRAFT_DELETE_PROCESS
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
    createExtensionsObject,
    SAVE_AS_PROJECT_ATTEMPT,
    UpdateUserTaskTemplateAction,
    UPDATE_TASK_TEMPLATE
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

    case DRAFT_UPDATE_PROCESS_CONTENT:
        return updateDraftProcess(state, <DraftUpdateProcessContentAction> action);

    case DRAFT_DELETE_PROCESS:
        return deleteDraftProcess(state, <DraftDeleteProcessAction> action);

    case GET_PROCESS_SUCCESS:
        return getProcessSuccess(state, <GetProcessSuccessAction>action);

    case UPDATE_PROCESS_VARIABLES:
        return updateProcessVariables(state, <UpdateProcessVariablesAction>action);

    case UPDATE_SERVICE_PARAMETERS:
        return updateProcessVariablesMapping(state, <UpdateServiceParametersAction>action);

    case UPDATE_TASK_ASSIGNMENTS:
        return updateProcessTaskAssignments(state, <UpdateServiceAssignmentAction>action);

    case UPDATE_TASK_TEMPLATE:
        return updateUserTaskTemplate(state, <UpdateUserTaskTemplateAction>action);

    case UPDATE_PROCESS_EXTENSIONS:
        return updateExtensions(state, <UpdateProcessExtensionsAction>action);

    case DELETE_PROCESS_EXTENSION:
        return deleteExtensions(state, <DeleteProcessExtensionAction>action);

    case REMOVE_ELEMENT_MAPPING:
        return removeElementMapping(state, <RemoveElementMappingAction>action);

    case LEAVE_PROJECT:
        return {
            ...state,
            loaded: false
        };

    case SAVE_AS_PROJECT_ATTEMPT:
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
        delete newState.draftEntities?.entities[action.processModelId]?.extensions[action.bpmnProcessElementId].mappings[action.elementId];
    }

    if (constants && constants[action.elementId]) {
        delete newState.entities[action.processModelId].extensions[action.bpmnProcessElementId].constants[action.elementId];
        delete newState.draftEntities?.entities[action.processModelId]?.extensions[action.bpmnProcessElementId].constants[action.elementId];
    }

    if (assignments && assignments[action.elementId]) {
        delete newState.entities[action.processModelId].extensions[action.bpmnProcessElementId].assignments[action.elementId];
        delete newState.draftEntities?.entities[action.processModelId]?.extensions[action.bpmnProcessElementId].assignments[action.elementId];
    }

    return newState;
}

function updateExtensions(state: ProcessEntitiesState, action: UpdateProcessExtensionsAction): ProcessEntitiesState {
    const draftEntities = {
        ...state.draftEntities,
        entities: {
            ...state.draftEntities.entities,
            [action.payload.modelId]: {
                ...state.entities[action.payload.modelId],
                ...state.draftEntities.entities[action.payload.modelId],
                extensions: action.payload.extensions
            }
        }
    };
    return {
        ...state,
        entities: {
            ...state.entities, [action.payload.modelId]: {
                ...state.entities[action.payload.modelId],
                extensions: action.payload.extensions
            }
        },
        draftEntities: draftEntities
    };
}

function deleteExtensions(state: ProcessEntitiesState, action: DeleteProcessExtensionAction): ProcessEntitiesState {
    const entity = cloneDeep(state.entities[action.processId]);
    delete entity.extensions[action.bpmnProcessId];
    let draftEntity;
    let draftEntities = { ...state.draftEntities };
    if (state.draftEntities?.entityContents[action.processId]) {
        draftEntity = cloneDeep(state.draftEntities.entities[action.processId]);
        delete draftEntity.extensions[action.bpmnProcessId];
        draftEntities = {
            ...state.draftEntities,
            entities: {
                ...state.draftEntities.entities,
                [action.processId]: {
                    ...state.entities[action.processId],
                    ...draftEntity
                }
            }
        };
    }
    return {
        ...state,
        entities: {
            ...state.entities,
            [action.processId]: {
                ...entity
            }
        },
        draftEntities: draftEntities
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

    const draftEntities = {
        ...state.draftEntities,
        entities: {
            ...state.draftEntities.entities,
            [action.payload.modelId]: {
                ...state.entities[action.payload.modelId],
                ...state.draftEntities.entities[action.payload.modelId],
                extensions: newExtensions
            }
        }
    };
    return {
        ...state,
        entities: {
            ...state.entities,
            [action.payload.modelId]: {
                ...state.entities[action.payload.modelId],
                extensions: newExtensions
            }
        },
        draftEntities: draftEntities
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
    const deletedProperties = Object.keys(oldProperties).filter(
        (oldProperty) => Object.keys(newProcessExtensions.properties).findIndex(newProperty => newProperty === oldProperty) === -1
    );
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
    if (!Object.keys(mappings[elementId]).length && !mappings[elementId].mappingType) {
        delete mappings[elementId];
    }
}

function isInputAndOutputsEmpty(mappings) {
    return !!mappings.inputs && !!mappings.outputs
        && !Object.keys(mappings.inputs).length && !Object.keys(mappings.outputs).length;
}

function updateProcessVariablesMapping(state: ProcessEntitiesState, action: UpdateServiceParametersAction): ProcessEntitiesState {
    const actionMappings = cloneDeep(action.serviceParameterMappings);
    const oldExtensions = cloneDeep(state.entities[action.modelId].extensions);
    const processExtensionsModel = new ProcessExtensionsModel(oldExtensions);
    let newExtensions = processExtensionsModel.setMappings(action.processId, action.serviceId, action.serviceParameterMappings);
    const newProcessExtensions = newExtensions[action.processId];

    if (newProcessExtensions.mappings[action.serviceId]) {
        if (Object.keys(newProcessExtensions.mappings[action.serviceId]).length) {
            removeEmptyElementMapping(newProcessExtensions.mappings[action.serviceId], 'inputs');
            removeEmptyElementMapping(newProcessExtensions.mappings[action.serviceId], 'outputs');
        }
    }

    if (isInputAndOutputsEmpty(actionMappings)) {
        delete newProcessExtensions.mappings[action.serviceId];
    }

    if (action.constants) {
        newExtensions = processExtensionsModel.setConstants(action.processId, action.serviceId, action.constants);
    }
    const draftEntities = {
        ...state.draftEntities,
        entities: {
            ...state.draftEntities.entities,
            [action.modelId]: {
                ...state.entities[action.modelId],
                ...state.draftEntities.entities[action.modelId],
                extensions: newExtensions
            }
        }
    };
    return {
        ...state,
        entities: {
            ...state.entities, [action.modelId]: {
                ...state.entities[action.modelId],
                extensions: newExtensions
            }
        },
        draftEntities: draftEntities
    };
}

function updateProcessTaskAssignments(state: ProcessEntitiesState, action: UpdateServiceAssignmentAction): ProcessEntitiesState {
    const oldExtensions = cloneDeep(state.entities[action.modelId].extensions);
    const newExtensions = new ProcessExtensionsModel(oldExtensions).setAssignments(action.processId, action.serviceId, action.taskAssignment);

    const draftEntities = {
        ...state.draftEntities,
        entities: {
            ...state.draftEntities.entities,
            [action.modelId]: {
                ...state.entities[action.modelId],
                ...state.draftEntities.entities[action.modelId],
                extensions: newExtensions
            }
        }
    };
    return {
        ...state,
        entities: {
            ...state.entities, [action.modelId]: {
                ...state.entities[action.modelId],
                extensions: newExtensions
            }
        },
        draftEntities: draftEntities
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
        entities: {
            ...state.entities,
            [action.payload.id]: {
                ...state.entities[action.payload.id],
                version: action.payload.changes.version
            }
        },
        entityContents: {
            ...state.entityContents,
            [action.payload.id]: action.content
        }
    };

    return processAdapter.updateOne({ ...action.payload, changes: action.payload.changes }, newState);
}

function updateDraftProcess(state: ProcessEntitiesState, action: DraftUpdateProcessContentAction): ProcessEntitiesState {
    const newState = {
        ...state,
        entityContents: {
            ...state.entityContents,
        }
    };
    newState.draftEntities.entityContents[action.payload.id] = action.content;
    newState.draftEntities.entities[action.payload.id] = { ...state.entities[action.payload.id], ...action.payload.changes, version: action.payload.changes.version };

    return processAdapter.updateOne({id: <string>'', changes: {}}, newState);
}

function deleteDraftProcess(state: ProcessEntitiesState, action: DraftDeleteProcessAction): ProcessEntitiesState {
    const newState = { ...state, entityContents: { ...state.entityContents } };
    delete newState.draftEntities.entityContents[action.modelId];
    delete newState.draftEntities.entities[action.modelId];

    return processAdapter.updateOne({id: <string>'', changes: {}}, newState);
}

function updateUserTaskTemplate(state: ProcessEntitiesState, action: UpdateUserTaskTemplateAction): ProcessEntitiesState {
    const oldExtensions = cloneDeep(state.entities[action.modelId].extensions);
    const newExtensions = new ProcessExtensionsModel(oldExtensions).setTemplate(
        action.processId,
        action.userTaskId,
        action.taskTemplate
    );

    const draftEntities = {
        ...state.draftEntities,
        entities: {
            ...state.draftEntities.entities,
            [action.modelId]: {
                ...state.entities[action.modelId],
                ...state.draftEntities.entities[action.modelId],
                extensions: newExtensions
            }
        }
    };

    return {
        ...state,
        entities: {
            ...state.entities, [action.modelId]: {
                ...state.entities[action.modelId],
                extensions: newExtensions
            }
        },
        draftEntities: draftEntities
    };
}
