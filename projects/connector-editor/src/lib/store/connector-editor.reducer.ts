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
import { ConnectorEditorState, INITIAL_CONNECTOR_EDITOR_STATE } from './connector-editor.state';
import {
    GET_CONNECTOR_ATTEMPT,
    LOAD_CONNECTOR_ATTEMPT,
    ModelEditorState,
} from '@alfresco-dbp/modeling-shared/sdk';
import {
    GET_CONNECTOR_SUCCESS,
    UPDATE_CONNECTOR_SUCCESS,
    UPDATE_CONNECTOR_CONTENT_ATTEMPT,
    UPDATE_CONNECTOR_FAILED
} from './connector-editor.actions';

export function connectorEditorReducer(
    state: ConnectorEditorState = { ...INITIAL_CONNECTOR_EDITOR_STATE },
    action: Action
): ConnectorEditorState {
    let newState: ConnectorEditorState;

    switch (action.type) {

    case GET_CONNECTOR_SUCCESS:
    case UPDATE_CONNECTOR_SUCCESS:
        return {
            ...state,
            loading: false,
            updateState: ModelEditorState.SAVED
        };

    case LOAD_CONNECTOR_ATTEMPT:
    case GET_CONNECTOR_ATTEMPT:
        return {
            ...state,
            loading: true
        };

    case UPDATE_CONNECTOR_CONTENT_ATTEMPT:
        return setSavingState(state, ModelEditorState.SAVING);

    case UPDATE_CONNECTOR_FAILED:
        return setSavingState(state, ModelEditorState.FAILED);

    default:
        newState = { ...state };
    }

    return newState;
}

function setSavingState(state: ConnectorEditorState, updateState: ModelEditorState): ConnectorEditorState {
    return {
        ...state,
        updateState
    };
}
