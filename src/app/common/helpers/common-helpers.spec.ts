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

import { createProcessName, PROCESS_FILE_FORMAT } from 'ama-sdk';
import { sortEntriesByName } from './sort-entries-by-name';

describe('Common Helpers', () => {

    it('should test createProcessName function', () => {
        const testName = 'testName';
        expect(createProcessName(testName + PROCESS_FILE_FORMAT)).toBe(testName);
    });

    it('should test sortEntriesByName function', () => {
        const entries = [{ name: 'B' }, { name: 'd' }, { name: 'A' }, { name: 'c' }];
        const sortedEntries = [{ name: 'A' }, { name: 'B' }, { name: 'c' }, { name: 'd' }];

        expect(sortEntriesByName(entries)).toEqual(sortedEntries);
    });
});
