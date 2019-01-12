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

import { ApplicationTreeState, INITIAL_APPLICATION_TREE_STATE, Process, OpenFilterAction } from 'ama-sdk';
import { applicationTreeReducer } from './application-tree.reducer';
import { SELECT_APPLICATION, CloseFilterAction } from '../actions/application';
import { CreateProcessSuccessAction, DeleteProcessSuccessAction } from '../actions/processes';
import { CONNECTOR, PROCESS } from 'ama-sdk';
import { UpdateProcessSuccessAction } from '../../../process-editor/store/process-editor.actions';

describe('ApplicationTreeReducer', () => {
    let initState: ApplicationTreeState;

    initState = {...INITIAL_APPLICATION_TREE_STATE};

    it('should handle SELECT_APPLICATION', () => {
        const newState = applicationTreeReducer(initState, {type: SELECT_APPLICATION});
        expect(newState).toEqual(initState);
    });

    it ('should handle CREATE_PROCESS_SUCCES', () => {
        const process = <Process>{
            id: 'id1',
            name: 'name'
        };

        const newState = applicationTreeReducer(initState, new CreateProcessSuccessAction(process));

        expect(newState.processes[process.id]).toEqual(process);
    });

    it ('should handle UPDATE_PROCESS_SUCCESS', () => {
        const updateProcessPayload = {
            processId: 'id1',
            content: '',
            metadata: {
                name: 'new name',
                description: ''
            }
        };

        const process = <Process>{
            id: 'id1',
            name: 'name'
        };

        const state = applicationTreeReducer(initState, new CreateProcessSuccessAction(process));
        const newState = applicationTreeReducer(state, new UpdateProcessSuccessAction(updateProcessPayload));

        expect(newState.processes[updateProcessPayload.processId].name).toEqual(updateProcessPayload.metadata.name);
    });

    it ('should handle DELETE_PROCESS_SUCCESS', () => {
        const newState = applicationTreeReducer(initState, new DeleteProcessSuccessAction('processId'));

        expect(newState.processes['processId']).toBeUndefined();
    });

    it('should handle OPEN_FILTER', () => {
        const newState = applicationTreeReducer(initState, new OpenFilterAction(PROCESS));

        expect(newState.openedFilters).toEqual([ PROCESS ]);
    });

    it('should handle CLOSE_FILTER', () => {
        const initialState = { ...initState, openedFilters: [ PROCESS, CONNECTOR ]};
        const newState = applicationTreeReducer(initialState, new CloseFilterAction(PROCESS));

        expect(newState.openedFilters).toEqual([ CONNECTOR ]);
    });
});
