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

import { processEditorReducer } from './process-editor.reducer';
import * as processesActions from '../../application-editor/store/actions/processes';
import * as processVariablesActions from './process-variables.actions';
import { ProcessEditorState, INITIAL_PROCESS_EDITOR_STATE, SelectedProcessElement } from './process-editor.state';
import {
    RemoveDiagramElementAction,
    REMOVE_DIAGRAM_ELEMENT,
    UpdateProcessSuccessAction
} from './process-editor.actions';
import { ServiceParameterMappings, EntityProperty, EntityProperties, UpdateServiceParametersAction } from 'ama-sdk';
import { mockProcess, variablesMappings } from './process.mock';


describe('ProcessEditorReducer', () => {
    let initialState: ProcessEditorState;

    it('should handle DELETE_PROCESS_SUCCESS', () => {
        initialState = { ...INITIAL_PROCESS_EDITOR_STATE };
        const newState = processEditorReducer(initialState, {type: processesActions.DELETE_PROCESS_SUCCESS  } );
        expect(newState.dirty).toEqual(false);
    });

    it('should handle REMOVE_DIAGRAM_ELEMENT', () => {
        const mockElement1: SelectedProcessElement = { id: 'id1', type: 'type1' };
        const mockElement2: SelectedProcessElement = { id: 'id2', type: 'type2' };

        initialState = {
            ...INITIAL_PROCESS_EDITOR_STATE,
            selectedElement: mockElement1
        };

        const newState1 = processEditorReducer(initialState, <RemoveDiagramElementAction>{
            type: REMOVE_DIAGRAM_ELEMENT,
            element: mockElement2
        });
        expect(newState1.selectedElement.id).toBe(mockElement1.id);

        const newState2 = processEditorReducer(initialState, <RemoveDiagramElementAction>{
            type: REMOVE_DIAGRAM_ELEMENT,
            element: mockElement1
        });
        expect(newState2.selectedElement).toBeNull();
    });

    it('should handle UPDATE_PROCESS_SUCCESS', () => {
        const mockActionPayload = {
            processId: mockProcess.id,
            content: 'diagramData',
            metadata: { name: 'new-name', description: 'new-desc' }
        };

        initialState = {
            ...INITIAL_PROCESS_EDITOR_STATE,
            process: mockProcess
        };

        const newState = processEditorReducer(initialState, new UpdateProcessSuccessAction(mockActionPayload));
        expect(newState.dirty).toBe(false);
        expect(newState.process.name).toBe(mockActionPayload.metadata.name);
        expect(newState.process.description).toBe(mockActionPayload.metadata.description);
    });

    it('should handle UPDATE_SERVICE_PARAMETERS', () => {
        const serviceTaskId = 'serviceTaskId';
        const serviceParameterMappings: ServiceParameterMappings = {
            input: { 'param1': 'variable1'},
            output: { 'param2': 'variable'}
        };
        initialState = {
            ...INITIAL_PROCESS_EDITOR_STATE,
            process: { ...mockProcess }
        };

        const newState = processEditorReducer(initialState, new UpdateServiceParametersAction(serviceTaskId, serviceParameterMappings));

        expect(newState.process.extensions.variablesMappings).toEqual({
            ...variablesMappings,
            'serviceTaskId': serviceParameterMappings
        });
    });

    it('should handle UPDATE_PROCESS_VARIABLES', () => {
        initialState = {
            ...INITIAL_PROCESS_EDITOR_STATE,
            process: { ...mockProcess }
        };

        const mockProperty: EntityProperty = { 'id': 'id', 'name': 'appa', 'type': 'string', 'required': false, 'value': '' };
        const mockProperties: EntityProperties = { [mockProperty.id]: mockProperty };
        const action = new processVariablesActions.UpdateProcessVariablesAction(mockProperties);
        const newState = processEditorReducer(initialState, action );

        expect(newState.process.extensions.properties).toEqual(mockProperties);
        expect(newState.process.extensions.variablesMappings).toEqual(mockProcess.extensions.variablesMappings);
    });
});
