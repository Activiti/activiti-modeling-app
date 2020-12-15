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

import { ProjectTreeState, INITIAL_PROJECT_TREE_STATE, OpenFilterAction, CONNECTOR, PROCESS } from '@alfresco-dbp/modeling-shared/sdk';
import { projectTreeReducer } from './project-tree.reducer';
import { SELECT_PROJECT, CloseFilterAction } from '../project-editor.actions';

describe('ProjectTreeReducer', () => {
    let initState: ProjectTreeState;

    initState = {...INITIAL_PROJECT_TREE_STATE};

    it('should handle SELECT_PROJECT', () => {
        const newState = projectTreeReducer(initState, {type: SELECT_PROJECT});
        expect(newState).toEqual(initState);
    });

    it('should handle OPEN_FILTER', () => {
        const newState = projectTreeReducer(initState, new OpenFilterAction(PROCESS));

        expect(newState.openedFilters).toEqual([ PROCESS ]);
    });

    it('should handle CLOSE_FILTER', () => {
        const initialState = { ...initState, openedFilters: [ PROCESS, CONNECTOR ]};
        const newState = projectTreeReducer(initialState, new CloseFilterAction(PROCESS));

        expect(newState.openedFilters).toEqual([ CONNECTOR ]);
    });
});
