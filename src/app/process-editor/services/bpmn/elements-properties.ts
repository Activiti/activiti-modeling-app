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

import { BpmnProperty, BpmnElement, DECISION_TASK_IMPLEMENTATION, SCRIPT_TASK_IMPLEMENTATION } from 'ama-sdk';

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
const haveConditionExpression = (element: Bpmn.DiagramElement) => !!element.businessObject.conditionExpression;
const isDecisionTask = (element: Bpmn.DiagramElement) => element.businessObject.implementation === DECISION_TASK_IMPLEMENTATION;
const isScriptTask = (element: Bpmn.DiagramElement) => element.businessObject.implementation === SCRIPT_TASK_IMPLEMENTATION;
const isExclusiveGateway = (element: Bpmn.DiagramElement) => element.businessObject.sourceRef.$type ===  BpmnElement.ExclusiveGateway;
const isInclusiveGateway = (element: Bpmn.DiagramElement) => element.businessObject.sourceRef.$type ===  BpmnElement.InclusiveGateway;
const isConditionalFlow = (element: Bpmn.DiagramElement) => element.businessObject.$type ===  BpmnElement.SequenceFlow && haveConditionExpression(element);
const hasProcessInside = (element: Bpmn.DiagramElement) => !!element.businessObject.processRef;

export const elementsProperties = {
    [BpmnElement.Process]: [
        BpmnProperty.id,
        BpmnProperty.modelName,
        BpmnProperty.processName,
        BpmnProperty.documentation,
        BpmnProperty.properties,
        BpmnProperty.messages
    ],
    [BpmnElement.Collaboration]: [
        BpmnProperty.modelName,
        BpmnProperty.id,
        BpmnProperty.documentation
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
        ...(isSignalEvent(element) && haveSignalRef(element) ? [ BpmnProperty.signalScope ] : []),
        ...(isMessageEvent(element) ? [
        BpmnProperty.messageRef,
        BpmnProperty.correlationKey,
        BpmnProperty.messagePayload
        ] : [])
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
        ...(isErrorEvent(element) ? [ BpmnProperty.errorRef ] : []),
        ...(isMessageEvent(element) ? [
        BpmnProperty.messageRef,
        BpmnProperty.correlationKey,
        BpmnProperty.messagePayload
        ] : [])
    ],
    [BpmnElement.SequenceFlow]: (element: Bpmn.DiagramElement) => [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        ...(isExclusiveGateway(element) || isConditionalFlow(element) || isInclusiveGateway(element) ? [ BpmnProperty.conditionExpression ] : []),
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
        BpmnProperty.multiInstanceType,
        ...(isDecisionTask(element) ? [ BpmnProperty.decisionTask ] : [isScriptTask(element) ? [ BpmnProperty.scriptTask ] : [BpmnProperty.implementation]])
    ],
    [BpmnElement.CallActivity]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        BpmnProperty.multiInstanceType,
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
        BpmnProperty.multiInstanceType,
        BpmnProperty.priority,
        BpmnProperty.formKey
    ],
    [BpmnElement.SubProcess]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        BpmnProperty.multiInstanceType
    ],
    [BpmnElement.Participant]: (element: Bpmn.DiagramElement) => [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        ...(hasProcessInside(element) ? [
            BpmnProperty.processName,
            BpmnProperty.properties,
            BpmnProperty.messages
        ] : []),
    ],
    [BpmnElement.Task]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        BpmnProperty.multiInstanceType
    ],
    [BpmnElement.textAnnotation]: [
        BpmnProperty.id,
        BpmnProperty.documentation,
        BpmnProperty.textAnnotation
    ]
};
