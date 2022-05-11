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

/* eslint-disable max-len */

import { SaveAsDialogPayload } from '@alfresco-dbp/modeling-shared/sdk';

export const mockOpenSaveAsDialog: SaveAsDialogPayload = {
    name: 'test-name',
    description: 'test-description',
    sourceModelContent: 'content'
};

// eslint-disable-next-line
// cSpell:disable
export const mockXMLProcess = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions name="process-test" id="model-fd525131-8580-4b28-98fd-484bde7c3ff1" xmlns:activiti="http://activiti.org/bpmn" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" targetNamespace="http://bpmn.io/schema/bpmn">
    <bpmn2:process id="Process_YXLPKi8G8" isExecutable="true" name="process-test">
        <bpmn2:documentation></bpmn2:documentation>
        <bpmn2:startEvent id="Event_1" />
    </bpmn2:process>
    <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_YXLPKi8G8">
            <bpmndi:BPMNShape id="_BPMNShape_Event_2" bpmnElement="Event_1">
                <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0" />
            </bpmndi:BPMNShape>
        </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
</bpmn2:definitions>`;
/* cSpell:enable */

// eslint-disable-next-line
// cSpell:disable
export const mockXMLProcessPool = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="model-855d0072-6b80-4202-ab47-00d8f9e47f6d" name="proc-test" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
  <bpmn2:collaboration id="Collaboration_06yxhnl">
    <bpmn2:participant id="Participant_0kp9jv7" name="proc-test" processRef="Process_IYpGmiAKX" />
  </bpmn2:collaboration>
  <bpmn2:process id="Process_IYpGmiAKX" name="proc-test" isExecutable="true">
    <bpmn2:documentation />
    <bpmn2:startEvent id="Event_1">
      <bpmn2:outgoing>SequenceFlow_0xhkz9c</bpmn2:outgoing>
    </bpmn2:startEvent>
    <bpmn2:endEvent id="EndEvent_1cg2o1y">
      <bpmn2:incoming>SequenceFlow_0xhkz9c</bpmn2:incoming>
    </bpmn2:endEvent>
    <bpmn2:sequenceFlow id="SequenceFlow_0xhkz9c" sourceRef="Event_1" targetRef="EndEvent_1cg2o1y" />
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_06yxhnl">
      <bpmndi:BPMNShape id="Participant_0kp9jv7_di" bpmnElement="Participant_0kp9jv7" isHorizontal="true">
        <dc:Bounds x="330" y="218" width="400" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="_BPMNShape_Event_2" bpmnElement="Event_1">
        <dc:Bounds x="412" y="240" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1cg2o1y_di" bpmnElement="EndEvent_1cg2o1y">
        <dc:Bounds x="502" y="240" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_0xhkz9c_di" bpmnElement="SequenceFlow_0xhkz9c">
        <di:waypoint x="448" y="258" />
        <di:waypoint x="502" y="258" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>`;
// cSpell:disable

export const mockProcessPoolSaveAsAttemptDialog: SaveAsDialogPayload = {
    name: 'test-name',
    description: 'test-description',
    sourceModelContent: mockXMLProcessPool,
    sourceModelMetadata: {
        extensions: {
            'Process_ruTEr0CHz': {
                'constants': {},
                'mappings': {},
                'properties': {},
                'assignments': {
                    'UserTask_191ib1o': {
                        'type': 'static',
                        'assignment': 'assignee',
                        'id': 'UserTask_191ib1o'
                    }
                }
            }
        }
    }
};

export const mockProcessSaveAsAttemptDialog: SaveAsDialogPayload = {
    name: 'test-name',
    description: 'test-description',
    sourceModelContent: mockXMLProcess,
    sourceModelMetadata: {
        extensions: {
            'Process_ruTEr0CHz': {
                'constants': {},
                'mappings': {},
                'properties': {},
                'assignments': {
                    'UserTask_191ib1o': {
                        'type': 'static',
                        'assignment': 'assignee',
                        'id': 'UserTask_191ib1o'
                    }
                }
            }
        }
    }
};
