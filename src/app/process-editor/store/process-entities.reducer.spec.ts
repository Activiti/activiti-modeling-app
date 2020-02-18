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

import {
    GetProcessesAttemptAction,
    CreateProcessSuccessAction,
    CREATE_PROCESS_SUCCESS,
    GET_PROCESSES_ATTEMPT,
    GetProcessesSuccessAction,
    GET_PROCESSES_SUCCESS,
    DeleteProcessSuccessAction,
    DELETE_PROCESS_SUCCESS,
    ProcessActions,
    UpdateProcessSuccessAction,
    UPDATE_PROCESS_SUCCESS,
    GetProcessSuccessAction,
    RemoveElementMappingAction,
    REMOVE_ELEMENT_MAPPING
} from './process-editor.actions';
import { ProcessEntitiesState, initialProcessEntitiesState } from './process-entities.state';
import { PROCESS, Process, ProcessContent, ServiceParameterMappings,
    UpdateServiceParametersAction, EntityProperty, EntityProperties, MappingType, UPDATE_SERVICE_PARAMETERS } from '@alfresco-dbp/modeling/ama-sdk';
import { processEntitiesReducer } from './process-entities.reducer';
import { mockProcessModel, mappings, mockProcessId } from './process.mock';
import * as processVariablesActions from './process-variables.actions';

const deepFreeze = require('deep-freeze-strict');

describe('ProcessEntitiesReducer', () => {
    let initialState: ProcessEntitiesState;
    let action: ProcessActions;

    const process = <Partial<Process>>{
        type: PROCESS,
        id: 'mock-id',
        name: 'mock-name',
        description: 'mock-description',
        projectId: 'mock-app-id'
    };

    const processId = 'Process_12345678';

    beforeEach(() => {
        initialState = deepFreeze({ ...initialProcessEntitiesState });
    });

    it('should handle CREATE_PROCESS_SUCCESS', () => {
        action = <CreateProcessSuccessAction>{ type: CREATE_PROCESS_SUCCESS, process: process };

        const newState = processEntitiesReducer(initialState, action);
        expect(newState.ids).toEqual([process.id]);
        expect(newState.entities).toEqual({ [process.id]: process });
    });

    it('should handle GET_PROCESSES_ATTEMPT', () => {
        action = <GetProcessesAttemptAction>{ type: GET_PROCESSES_ATTEMPT, projectId: 'app-id' };

        const newState = processEntitiesReducer(initialState, action);

        expect(newState.loading).toEqual(true);
    });

    it('should handle GET_PROCESSES_SUCCESS', () => {
        const processes = [process, { ...process, id: 'mock-id2' }];
        action = <GetProcessesSuccessAction>{ type: GET_PROCESSES_SUCCESS, processes: processes };

        const newState = processEntitiesReducer(initialState, action);
        expect(newState.ids).toEqual(processes.map(conn => conn.id));
        expect(newState.entities).toEqual({
            [processes[0].id]: processes[0],
            [processes[1].id]: processes[1]
        });
        expect(newState.loading).toEqual(false);
        expect(newState.loaded).toEqual(true);
    });

    it('should handle REMOVE_ELEMENT_MAPPING', () => {
        const elementId = 'UserTask_0o7efx6';
        const processes = [{ ...process, extensions: {
            mappings: {
                [elementId]: {
                    inputs: {
                        'e441111c-5a3d-4f78-a571-f57e67ce85bf': {
                            type: MappingType.value,
                            value: 'test'
                        }
                    }
                }
            },
            constants: {
                [elementId]: {
                    '_activiti_dmn_table_"': {
                        'value': 'dt'
                    }
                }
            },
            properties: {}
        } }];
        action = <GetProcessesSuccessAction>{ type: GET_PROCESSES_SUCCESS, processes };
        let newState = processEntitiesReducer(initialState, action);

        action = <RemoveElementMappingAction>{ type: REMOVE_ELEMENT_MAPPING, processId: process.id, elementId };
        newState = processEntitiesReducer(newState, action);

        expect(newState.entities[process.id].extensions.mappings).toEqual({});
        expect(newState.entities[process.id].extensions.constants).toEqual({});
    });

    it('should handle UPDATE_SERVICE_PARAMETERS', () => {
        const elementId = 'UserTask_0o7efx6';
        const mockMapping = {
            inputs: {
                'e441111c-5a3d-4f78-a571-f57e67ce85bf': {
                    type: MappingType.value,
                    value: 'test'
                }
            }
        };
        const mockConstants = {
            '_activiti_dmn_table_"': {
                'value': 'dt'
            }
        };
        const processes = [{ ...process, extensions: {
            mappings: {},
            id: 'mock-id',
            properties: {},
            constants: {}
        } }];
        let newState = processEntitiesReducer(initialState, <GetProcessesSuccessAction>{ type: GET_PROCESSES_SUCCESS, processes });

        newState = processEntitiesReducer(newState, <UpdateServiceParametersAction>{
            type: UPDATE_SERVICE_PARAMETERS,
            modelId: process.id,
            processId: processId,
            serviceId: elementId,
            serviceParameterMappings: mockMapping,
            constants: mockConstants
        });
        expect(newState.entities[process.id].extensions[processId].mappings).toEqual({
            [elementId]: mockMapping
        });
        expect(newState.entities[process.id].extensions[processId].constants).toEqual({
            [elementId]: mockConstants
        });

        newState = processEntitiesReducer(newState, <UpdateServiceParametersAction>{
            type: UPDATE_SERVICE_PARAMETERS,
            modelId: process.id,
            processId: processId,
            serviceId: elementId,
            serviceParameterMappings: {}
        });
        expect(newState.entities[process.id].extensions.mappings).toEqual({});
    });

    it('should handle DELETE_PROCESS_SUCCESS', () => {
        const processes = [process, { ...process, id: 'mock-id2' }];
        action = <GetProcessesSuccessAction>{ type: GET_PROCESSES_SUCCESS, processes: processes };
        let newState = processEntitiesReducer(initialState, action);

        action = <DeleteProcessSuccessAction>{ type: DELETE_PROCESS_SUCCESS, processId: 'mock-id2' };

        newState = processEntitiesReducer(newState, action);
        expect(newState.ids).toEqual([process.id]);
        expect(newState.entities).toEqual({
            [process.id]: process
        });
    });

    it('should handle UPDATE_PROCESS_SUCCESS', () => {
        const processes = [process, { ...process, id: 'mock-id2' }];
        action = <GetProcessesSuccessAction>{ type: GET_PROCESSES_SUCCESS, processes: processes };

        const stateWithAddedProcesses = processEntitiesReducer(initialState, action);
        const changes = {
            id: process.id,
            changes: {
                ...process,
                name: 'name2',
                description: 'desc2'
            }
        };
        action = <UpdateProcessSuccessAction>{
            type: UPDATE_PROCESS_SUCCESS,
            payload: changes,
            content: ''
        };

        const newState = processEntitiesReducer(stateWithAddedProcesses, action);
        expect(newState.entities[process.id]).toEqual({
            ...process,
            name: 'name2',
            description: 'desc2'
        });
    });

    describe('GET_PROCESS_SUCCESS', () => {
        let diagram: ProcessContent;

        beforeEach(() => {
            diagram = <ProcessContent>'<bpmn></bpmn>';
        });

        it('should update the process in the state', () => {
            action = new GetProcessSuccessAction({ process: <Process>process, diagram });

            const newState = processEntitiesReducer(initialState, action);

            expect(newState.entities[process.id]).toEqual(process);
        });

        it('should update the content of a process in the state', () => {
            action = new GetProcessSuccessAction({ process: <Process>process, diagram });

            const newState = processEntitiesReducer(initialState, action);

            expect(newState.entityContents[process.id]).toEqual(diagram);
        });

        it('should update the content with default values if no content from backend. The id must be prefixed with process-', () => {
            action = new GetProcessSuccessAction({ process: <Process>process, diagram: <ProcessContent>'' });

            const newState = processEntitiesReducer(initialState, action);

            expect(newState.entityContents[process.id]).toEqual('');
        });
    });

    it('should handle UPDATE_SERVICE_PARAMETERS', () => {
        const serviceTaskId = 'serviceTaskId';
        const serviceParameterMappings: ServiceParameterMappings = {
            inputs: { 'param1': 'variable1'},
            outputs: { 'param2': 'variable'}
        };
        initialState = {
            ...initialProcessEntitiesState,
            entities: { [mockProcessModel.id]: mockProcessModel },
            ids: [mockProcessModel.id]
        };

        const newState = processEntitiesReducer(initialState, new UpdateServiceParametersAction(mockProcessModel.id, processId, serviceTaskId, serviceParameterMappings));

        expect(newState.entities[mockProcessModel.id].extensions[processId].mappings).toEqual({
            ...mappings,
            'serviceTaskId': serviceParameterMappings
        });
    });

    it('should handle UPDATE_PROCESS_VARIABLES', () => {
        initialState = {
            ...initialProcessEntitiesState,
            entities: { [mockProcessModel.id]: mockProcessModel },
            ids: [mockProcessModel.id]
        };

        /* cspell: disable-next-line */
        const mockProperty: EntityProperty = { 'id': 'id', 'name': 'appa', 'type': 'string', 'required': false, 'value': '' };
        const mockProperties: EntityProperties = { [mockProperty.id]: mockProperty };
        const newState = processEntitiesReducer(initialState, new processVariablesActions.UpdateProcessVariablesAction({
            modelId: mockProcessModel.id,
            processId: mockProcessId,
            properties: mockProperties
        }));

        expect(newState.entities[mockProcessModel.id].extensions[mockProcessId].properties).toEqual(mockProperties);
        expect(newState.entities[mockProcessModel.id].extensions.mappings).toEqual(mockProcessModel.extensions.mappings);
    });
});
