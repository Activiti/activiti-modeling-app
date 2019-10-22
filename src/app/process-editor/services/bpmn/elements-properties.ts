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

import { BpmnProperty, BpmnElement, DECISION_TASK_IMPLEMENTATION } from 'ama-sdk';

const isSignalEvent = (element: Bpmn.DiagramElement) => {
    return !!element.businessObject.eventDefinitions && element.businessObject.eventDefinitions[0].$type === BpmnElement.SignalEventDefinition;
};
const isTimerEvent = (element: Bpmn.DiagramElement) => {
    return !!element.businessObject.eventDefinitions && element.businessObject.eventDefinitions[0].$type === BpmnElement.TimerEventDefinition;
};
const isErrorEvent = (element: Bpmn.DiagramElement) => {
    return !!element.businessObject.eventDefinitions && element.businessObject.eventDefinitions[0].$type === BpmnElement.ErrorEventDefinition;
};
const isMessageEvent = (element: Bpmn.DiagramElement) => {
    return !!element.businessObject.eventDefinitions && element.businessObject.eventDefinitions[0].$type === BpmnElement.MessageEventDefinition;
};
const isInsideSubProcess = (element: Bpmn.DiagramElement) => {
    return element.businessObject.$parent.$type === BpmnElement.SubProcess;
};
const haveSignalRef = (element: Bpmn.DiagramElement) => !!element.businessObject.eventDefinitions[0].signalRef;
const isDecisionTask = (element: Bpmn.DiagramElement) => element.businessObject.implementation === DECISION_TASK_IMPLEMENTATION;
const isExclusiveGateway = (element: Bpmn.DiagramElement) => element.businessObject.sourceRef.$type ===  BpmnElement.ExclusiveGateway;
const isInclusiveGateway = (element: Bpmn.DiagramElement) => element.businessObject.sourceRef.$type ===  BpmnElement.InclusiveGateway;

export const elementsProperties = {
    [BpmnElement.Process]: [
        BpmnProperty.id,
        BpmnProperty.processName,
        BpmnProperty.version,
        BpmnProperty.documentation,
        BpmnProperty.properties,
        BpmnProperty.messages
    ],
    [BpmnElement.IntermediateCatchEvent]: (element: Bpmn.DiagramElement) => [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        ...(isSignalEvent(element) ? [ BpmnProperty.signalRef ] : []),
        ...(isTimerEvent(element) ? [ BpmnProperty.timerEventDefinition ] : []),
        ...(isMessageEvent(element) ? [ BpmnProperty.messageRef, BpmnProperty.correlationKey ] : [])
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
        ...(isSignalEvent(element) ? [ BpmnProperty.signalRef ] : [BpmnProperty.formKey]),
        ...(isTimerEvent(element) ? [ BpmnProperty.timerEventDefinition ] : []),
        ...(isErrorEvent(element) ? [ BpmnProperty.errorRef ] : []),
        ...(isMessageEvent(element) ? [ BpmnProperty.messageRef ] : []),
        ...(isInsideSubProcess(element) && isMessageEvent(element) ? [ BpmnProperty.correlationKey ] : []),

    ],
    [BpmnElement.BoundaryEvent]: (element: Bpmn.DiagramElement) => [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        ...(isSignalEvent(element) ? [ BpmnProperty.signalRef ] : []),
        ...(isTimerEvent(element) ? [ BpmnProperty.timerEventDefinition ] : []),
        ...(isErrorEvent(element) ? [ BpmnProperty.errorRef ] : []),
        ...(isMessageEvent(element) ? [ BpmnProperty.messageRef, BpmnProperty.correlationKey ] : [])
    ],
    [BpmnElement.EndEvent]: (element: Bpmn.DiagramElement) => [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        ...(isSignalEvent(element) ? [ BpmnProperty.signalRef ] : []),
        ...(isErrorEvent(element) ? [ BpmnProperty.errorRef ] : [])
    ],
    [BpmnElement.SequenceFlow]: (element: Bpmn.DiagramElement) => [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        ...(isExclusiveGateway(element) ? [ BpmnProperty.conditionExpression ] : []),
        ...(isInclusiveGateway(element) ? [ BpmnProperty.conditionExpression ] : [])
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
    [BpmnElement.InclusiveGateway]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        BpmnProperty.defaultSequenceFlow
    ],
    [BpmnElement.ServiceTask]: (element: Bpmn.DiagramElement) => [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        ...(isDecisionTask(element) ? [ BpmnProperty.decisionTask ] : [BpmnProperty.implementation])
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
    ],
    [BpmnElement.SubProcess]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        BpmnProperty.multiInstanceType
    ],
    [BpmnElement.Participant]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation
    ]
};
