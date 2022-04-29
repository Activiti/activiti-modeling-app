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

import { createModelName, formatUuid } from './create-entries-names';
import { ContentType } from './../../api-implementations/acm-api/content-types';

/* eslint-disable */
export const getEmptyDiagram = (model, processId) => {
    const modelId = formatUuid(ContentType.Model, model.id);

    return `<?xml version="1.0" encoding="UTF-8"?>
    <bpmn2:definitions name="${createModelName(model.name)}" id="${modelId}" xmlns:activiti="http://activiti.org/bpmn" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" targetNamespace="${model.category ?? ''}">
        <bpmn2:process id="${processId}" isExecutable="true" name="${createModelName(model.name)}">
            <bpmn2:documentation>${model.description ? model.description : ''}</bpmn2:documentation>
            <bpmn2:startEvent id="Event_1" />
        </bpmn2:process>
        <bpmndi:BPMNDiagram id="BPMNDiagram_1">
            <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${processId}">
                <bpmndi:BPMNShape id="_BPMNShape_Event_2" bpmnElement="Event_1">
                    <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0" />
                </bpmndi:BPMNShape>
            </bpmndi:BPMNPlane>
        </bpmndi:BPMNDiagram>
    </bpmn2:definitions>`;
}
