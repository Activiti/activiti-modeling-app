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

import { getEmptyDiagram } from './empty-diagram';

describe('Empty diagram', () => {
    const buidlXML = (process) => {
        const generatedDiagram = getEmptyDiagram(process);
        const parser = new DOMParser();
        const diagram = parser.parseFromString(generatedDiagram, 'text/xml');

        return diagram;
    };

    it('Test when description is missing. The id should pe prefixed with process-', () => {
        const mockProcess = {
            id: 'id1',
            name: 'process1'
        };

        const diagram = buidlXML(mockProcess);
        const documentation = diagram.getElementsByTagName('bpmn2:documentation');
        const id = diagram.getElementsByTagName('bpmn2:process')[0].getAttribute('id');
        const name = diagram.getElementsByTagName('bpmn2:process')[0].getAttribute('name');

        expect(documentation[0].textContent).toBe('');
        expect(id).toBe('process-id1');
        expect(name).toBe('process1');
    });

    it('Test when description is present', () => {
        const mockProcess = {
            id: 'id1',
            name: 'process1',
            description: 'desc'
        };

        const diagram = buidlXML(mockProcess);
        const documentation = diagram.getElementsByTagName('bpmn2:documentation');
        const id = diagram.getElementsByTagName('bpmn2:process')[0].getAttribute('id');
        const name = diagram.getElementsByTagName('bpmn2:process')[0].getAttribute('name');

        expect(documentation[0].textContent).toBe('desc');
        expect(id).toBe('process-id1');
        expect(name).toBe('process1');
    });
});
