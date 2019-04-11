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

import { BpmnProperty, BpmnElement } from 'ama-sdk';

const isSignalEvent = (element: Bpmn.DiagramElement) => !!element.businessObject.eventDefinitions;
const haveSignalRef = (element: Bpmn.DiagramElement) => !!element.businessObject.eventDefinitions[0].signalRef;

export const elementsProperties = {
    [BpmnElement.Process]: [
        BpmnProperty.id,
        BpmnProperty.processName,
        BpmnProperty.version,
        BpmnProperty.documentation,
        BpmnProperty.properties
    ],
    [BpmnElement.IntermediateCatchEvent]: (element: Bpmn.DiagramElement) => [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        ...(isSignalEvent(element) ? [ BpmnProperty.signalRef ] : [])
    ],
    [BpmnElement.IntermediateThrowEvent]: (element: Bpmn.DiagramElement) => [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        ...(isSignalEvent(element) ? [ BpmnProperty.signalRef ] : []),
        ...(isSignalEvent(element) && haveSignalRef(element) ? [ BpmnProperty.signalScope ] : [])
    ],
    [BpmnElement.StartEvent]: (element: Bpmn.DiagramElement) => [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        ...(isSignalEvent(element) ? [ BpmnProperty.signalRef ] : [BpmnProperty.formKey])
    ],
    [BpmnElement.BoundaryEvent]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        BpmnProperty.signalRef
    ],
    [BpmnElement.EndEvent]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation
    ],
    [BpmnElement.SequenceFlow]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        BpmnProperty.conditionExpression
    ],
    [BpmnElement.ExclusiveGateway]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        BpmnProperty.defaultSequenceFlow
    ],
    [BpmnElement.ParallelGateway]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation
    ],
    [BpmnElement.ServiceTask]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        BpmnProperty.implementation
    ],
    [BpmnElement.CallActivity]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        BpmnProperty.calledElement
    ],
    [BpmnElement.UserTask]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        BpmnProperty.assignee,
        BpmnProperty.candidateUsers,
        BpmnProperty.candidateGroups,
        BpmnProperty.dueDate,
        BpmnProperty.priority,
        BpmnProperty.formKey
    ]
};
