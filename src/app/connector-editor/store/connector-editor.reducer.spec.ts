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

import { ConnectorEditorState, INITIAL_CONNECTOR_EDITOR_STATE } from './connector-editor.state';
import { connectorEditorReducer } from './connector-editor.reducer';
import {
    UPDATE_CONNECTOR_SUCCESS,
    GET_CONNECTOR_SUCCESS
} from './connector-editor.actions';
import { GET_CONNECTOR_ATTEMPT } from '@alfresco-dbp/modeling-shared/sdk';

describe('ConnectorEditorReducer', () => {
    let initialState: ConnectorEditorState;
    let newState: ConnectorEditorState;

    it('should handle GET_CONNECTOR_ATTEMPT', () => {
        initialState = { ...INITIAL_CONNECTOR_EDITOR_STATE };
        newState = connectorEditorReducer(initialState, { type: GET_CONNECTOR_ATTEMPT } );
        expect(newState.loading).toEqual(true);
    });

    it('should handle GET_CONNECTOR_SUCCESS and UPDATE_CONNECTOR_SUCCESS', () => {
        initialState = { ...INITIAL_CONNECTOR_EDITOR_STATE };
        newState = connectorEditorReducer(initialState, { type: GET_CONNECTOR_SUCCESS } );
        expect(newState.loading).toEqual(false);

        newState = connectorEditorReducer(initialState, { type: UPDATE_CONNECTOR_SUCCESS } );
        expect(newState.loading).toEqual(false);
    });
});
