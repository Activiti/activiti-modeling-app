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

import { OutputMappingAvailableVariablePipe } from './output-mapping-available-variables.pipe';
import { pipeMapping, pipeProcessProperties } from './output-mapping-table.component.mock';

describe('FilterUIPipe', () => {
    let pipe: OutputMappingAvailableVariablePipe;

    beforeEach(() => {
        pipe = new OutputMappingAvailableVariablePipe();
    });

    it('should not filter variable mapped for the actual parameter', () => {
        const expectedVariables = [...pipeProcessProperties];
        expectedVariables.splice(1, 1);

        const transformation = pipe.transform(pipeProcessProperties, pipeMapping, 'task-output-1');

        expect(transformation).toEqual(expectedVariables);
    });

    it('should filter variables in other mappings', () => {
        const expectedVariables = [...pipeProcessProperties];
        expectedVariables.splice(0, 2);

        const transformation = pipe.transform(pipeProcessProperties, pipeMapping, 'another-task-output');

        expect(transformation).toEqual(expectedVariables);
    });
});
