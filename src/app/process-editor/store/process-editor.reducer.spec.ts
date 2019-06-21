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

import { ProcessEditorState, getInitialProcessEditorState } from './process-editor.state';

import {
    UpdateProcessFailedAction,
    UPDATE_PROCESS_FAILED,
    UpdateProcessSuccessAction,
    UpdateProcessAttemptAction,
    UPDATE_PROCESS_ATTEMPT,
    UPDATE_PROCESS_SUCCESS
} from './process-editor.actions';
import { processEditorReducer } from './process-editor.reducer';


const deepFreeze = require('deep-freeze-strict');

describe('ProcessEditorReducer', () => {
    let initialState: ProcessEditorState;

    beforeEach(() => {
        initialState = deepFreeze({ ...getInitialProcessEditorState });
    });

    it('should handle UPDATE_PROCESS_FAILED', () => {
        const action = <UpdateProcessFailedAction>{ type: UPDATE_PROCESS_FAILED };

        const newState = processEditorReducer(initialState, action);
        expect (newState.toolbar.inProgress).toBe(false);
    });

    it('should handle UPDATE_PROCESS_ATTEMPT', () => {
        const action = <UpdateProcessAttemptAction>{ type: UPDATE_PROCESS_ATTEMPT};

        const newState = processEditorReducer(initialState, action);
        expect (newState.toolbar.inProgress).toBe(true);
    });

    it('should handle UPDATE_PROCESS_SUCESS', () => {
        const action = <UpdateProcessSuccessAction>{ type: UPDATE_PROCESS_SUCCESS};

        const newState = processEditorReducer(initialState, action);
        expect (newState.toolbar.inProgress).toBe(false);
    });

});
