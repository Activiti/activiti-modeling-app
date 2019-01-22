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

import { ApplicationTreeState, INITIAL_APPLICATION_TREE_STATE, OpenFilterAction, CONNECTOR, PROCESS } from 'ama-sdk';
import { applicationTreeReducer } from './application-tree.reducer';
import { SELECT_APPLICATION, CloseFilterAction } from '../application-editor.actions';

describe('ApplicationTreeReducer', () => {
    let initState: ApplicationTreeState;

    initState = {...INITIAL_APPLICATION_TREE_STATE};

    it('should handle SELECT_APPLICATION', () => {
        const newState = applicationTreeReducer(initState, {type: SELECT_APPLICATION});
        expect(newState).toEqual(initState);
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
