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

import { selectOpenedFilters } from './project-tree.selectors';
import { PROCESS, FORM, UI } from '@alfresco-dbp/modeling-shared/sdk';

describe('Project tree selectors', () => {

    describe('selectOpenedFilters', () => {
        it ('should return [PROCESS] by default if nothing is opened', () => {
            const state = {
                'project-editor': {
                    tree: { openedFilters: [] }
                }
            };

            const openedFilters = selectOpenedFilters(state);

            expect(openedFilters).toEqual([PROCESS]);
        });

        it ('should return the array something if something is already in there', () => {
            const state = {
                'project-editor': {
                    tree: { openedFilters: [ FORM, UI ] }
                }
            };

            const openedFilters = selectOpenedFilters(state);

            expect(openedFilters).toEqual([ FORM, UI ]);
        });
    });
});
