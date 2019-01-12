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

import {
    GetProcessesAttemptAction,
    CreateProcessSuccessAction,
    CREATE_PROCESS_SUCCESS,
    GET_PROCESSES_ATTEMPT,
    GetProcessesSuccessAction,
    GET_PROCESSES_SUCCESS,
    DeleteProcessSuccessAction,
    DELETE_PROCESS_SUCCESS
} from '../../application-editor/store/actions/processes';
import { ProcessEntitiesState, initialProcessEntitiesState } from './process-entities.state';
import { ProcessActions, UpdateProcessSuccessAction, UPDATE_PROCESS_SUCCESS, GetProcessSuccessAction } from './process-editor.actions';
import { PROCESS, Process, ProcessContent } from 'ama-sdk';
import { processEntitiesReducer } from './process-entities.reducer';

const deepFreeze = require('deep-freeze-strict');

describe('ProcessEntitiesReducer', () => {
    let initialState: ProcessEntitiesState;
    let action: ProcessActions;

    const process = <Partial<Process>>{
        type: PROCESS,
        id: 'mock-id',
        name: 'mock-name',
        description: 'mock-description',
        applicationId: 'mock-app-id'
    };

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
        action = <GetProcessesAttemptAction>{ type: GET_PROCESSES_ATTEMPT, applicationId: 'app-id' };

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
            payload: {
                processId: process.id,
                content: '',
                metadata: changes
            }
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
});
