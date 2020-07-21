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

import { getEmptyDiagram } from './empty-diagram';

describe('Empty diagram', () => {
    const buildXML = (process: any) => {
        const generatedDiagram = getEmptyDiagram(process, 'process-id');
        const parser = new DOMParser();
        const diagram = parser.parseFromString(generatedDiagram, 'text/xml');

        return diagram;
    };

    it('process\' id should be prefixed with process-', () => {
        const mockProcess = {
            id: 'id1',
            name: 'model1'
        };

        const diagram = buildXML(mockProcess);
        const documentation = diagram.getElementsByTagName('bpmn2:documentation');
        const id = diagram.getElementsByTagName('bpmn2:definitions')[0].getAttribute('id');
        const idReference = diagram.getElementsByTagName('bpmndi:BPMNPlane')[0].getAttribute('bpmnElement');
        const processId = diagram.getElementsByTagName('bpmn2:process')[0].getAttribute('id');
        const name = diagram.getElementsByTagName('bpmn2:definitions')[0].getAttribute('name');

        expect(documentation[0].textContent).toBe('');
        expect(id).toBe('model-id1');
        expect(idReference).toBe(processId);
        expect(name).toBe('model1');
    });

    it('description should be in the xml properly', () => {
        const mockProcess = {
            id: 'id1',
            name: 'model1',
            description: 'desc'
        };

        const diagram = buildXML(mockProcess);
        const documentation = diagram.getElementsByTagName('bpmn2:documentation');
        const id = diagram.getElementsByTagName('bpmn2:definitions')[0].getAttribute('id');
        const name = diagram.getElementsByTagName('bpmn2:definitions')[0].getAttribute('name');
        const namespace = diagram.getElementsByTagName('bpmn2:definitions')[0].getAttribute('xmlns:activiti');

        expect(documentation[0].textContent).toBe('desc');
        expect(id).toBe('model-id1');
        expect(name).toBe('model1');
        expect(namespace).toBe('http://activiti.org/bpmn');
    });
});
