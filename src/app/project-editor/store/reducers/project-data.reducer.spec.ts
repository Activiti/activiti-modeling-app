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

import { ProjectDataState, INITIAL_PROJECT_DATA_STATE, ReleaseProjectSuccessAction } from '@alfresco-dbp/modeling-shared/sdk';
import { projectDataReducer } from './project-data.reducer';
import { SELECT_PROJECT } from '../project-editor.actions';

describe('Project data reducer', () => {
    let initState: ProjectDataState;

    it ('should handle SELECT_PROJECT', () => {
        initState = {...INITIAL_PROJECT_DATA_STATE};
        const newState = projectDataReducer(initState, {type: SELECT_PROJECT});

        expect(newState).toEqual(initState);
    });

    it ('should handle RELEASE_PROJECT_SUCCESS', () => {
        initState = {...INITIAL_PROJECT_DATA_STATE};
        const action = new ReleaseProjectSuccessAction({ version: '2' }, 'project_id');
        const newState = projectDataReducer(initState, action);

        expect(newState.project.version).toEqual(action.release.version);
    });
});
