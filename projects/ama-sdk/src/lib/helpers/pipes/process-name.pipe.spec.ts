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

import { ProcessNamePipe } from './process-name.pipe';
import * as hellper from '../utils/create-entries-names';

describe('ProcessNamePipe', () => {
    let pipe: ProcessNamePipe;

    beforeEach(() => {
        pipe = new ProcessNamePipe();
    });

    it('providing no value returns fallback', () => {
        expect(pipe.transform(undefined, [])).toBe(undefined);
    });

    it('providing value returns expected result', () => {
        spyOn(hellper, 'createProcessName');

        pipe.transform('name.bpmn', []);
        expect(hellper.createProcessName).toHaveBeenCalledWith('name.bpmn');
    });
});
