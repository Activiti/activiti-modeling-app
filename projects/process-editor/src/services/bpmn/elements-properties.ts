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

import {
    BpmnProperty,
    BpmnElement,
    DECISION_TASK_IMPLEMENTATION,
    SCRIPT_TASK_IMPLEMENTATION,
    BpmnCompositeProperty,
    EMAIL_SERVICE_SEND_TASK_IMPLEMENTATION,
    DOCGEN_SERVICE_GENERATE_TASK_IMPLEMENTATION,
    CONTENT_SERVICE_NAME
} from '@alfresco-dbp/modeling-shared/sdk';

const isSignalEvent = (element: Bpmn.DiagramElement) =>
    !!element.businessObject.eventDefinitions && element.businessObject.eventDefinitions[0].$type === BpmnElement.SignalEventDefinition;
const isTimerEvent = (element: Bpmn.DiagramElement) =>
    !!element.businessObject.eventDefinitions && element.businessObject.eventDefinitions[0].$type === BpmnElement.TimerEventDefinition;
const isErrorEvent = (element: Bpmn.DiagramElement) =>
    !!element.businessObject.eventDefinitions && element.businessObject.eventDefinitions[0].$type === BpmnElement.ErrorEventDefinition;
const isMessageEvent = (element: Bpmn.DiagramElement) =>
    !!element.businessObject.eventDefinitions && element.businessObject.eventDefinitions[0].$type === BpmnElement.MessageEventDefinition;
const isInsideSubProcess = (element: Bpmn.DiagramElement) => element.businessObject.$parent.$type === BpmnElement.SubProcess;
const haveSignalRef = (element: Bpmn.DiagramElement) => !!element.businessObject.eventDefinitions[0].signalRef;
const haveConditionExpression = (element: Bpmn.DiagramElement) => !!element.businessObject.conditionExpression;
const isDecisionTask = (element: Bpmn.DiagramElement) => element.businessObject.implementation === DECISION_TASK_IMPLEMENTATION;
const isScriptTask = (element: Bpmn.DiagramElement) => element.businessObject.implementation === SCRIPT_TASK_IMPLEMENTATION;
const isEmailServiceTask = (element: Bpmn.DiagramElement) => element.businessObject.implementation === EMAIL_SERVICE_SEND_TASK_IMPLEMENTATION;
const isDocgenServiceTask = (element: Bpmn.DiagramElement) => element.businessObject.implementation === DOCGEN_SERVICE_GENERATE_TASK_IMPLEMENTATION;
const isContentServiceTask = (element: Bpmn.DiagramElement) => element.businessObject.implementation?.startsWith(CONTENT_SERVICE_NAME);
const isExclusiveGateway = (element: Bpmn.DiagramElement) => element.businessObject.sourceRef.$type === BpmnElement.ExclusiveGateway;
const isInclusiveGateway = (element: Bpmn.DiagramElement) => element.businessObject.sourceRef.$type === BpmnElement.InclusiveGateway;
const isConditionalFlow = (element: Bpmn.DiagramElement) => element.businessObject.$type === BpmnElement.SequenceFlow && haveConditionExpression(element);
const hasProcessInside = (element: Bpmn.DiagramElement) => !!element.businessObject.processRef;

export const elementsProperties = {
    [BpmnElement.Process]: [
        BpmnProperty.processId,
        BpmnProperty.version,
        BpmnProperty.modelName,
        BpmnProperty.processName,
        BpmnProperty.isExecutable,
        BpmnProperty.documentation,
        BpmnProperty.category,
        BpmnCompositeProperty.properties,
        BpmnCompositeProperty.messages,
        BpmnCompositeProperty.errors
    ],
    [BpmnElement.Collaboration]: [
        BpmnProperty.modelName,
        BpmnProperty.id,
        BpmnProperty.documentation,
        BpmnProperty.category,
        BpmnCompositeProperty.messages,
        BpmnCompositeProperty.errors
    ],
    [BpmnElement.IntermediateCatchEvent]: (element: Bpmn.DiagramElement) => [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        ...(isSignalEvent(element) ? [BpmnProperty.signalRef] : []),
        ...(isTimerEvent(element) ? [BpmnProperty.timerEventDefinition] : []),
        ...(isMessageEvent(element) ? [BpmnProperty.messageRef, BpmnProperty.correlationKey] : [])
    ],
    [BpmnElement.IntermediateThrowEvent]: (element: Bpmn.DiagramElement) => [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        ...(isSignalEvent(element) ? [BpmnProperty.signalRef] : []),
        ...(isSignalEvent(element) && haveSignalRef(element) ? [BpmnProperty.signalScope] : []),
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
        ...(isSignalEvent(element) ? [BpmnProperty.signalRef] : [BpmnProperty.formKey]),
        ...(isTimerEvent(element) ? [BpmnProperty.timerEventDefinition] : []),
        ...(isErrorEvent(element) ? [BpmnProperty.errorRef] : []),
        ...(isMessageEvent(element) ? [BpmnProperty.messageRef] : []),
        ...(isInsideSubProcess(element) && isMessageEvent(element) ? [BpmnProperty.correlationKey] : []),

    ],
    [BpmnElement.BoundaryEvent]: (element: Bpmn.DiagramElement) => [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        ...(isSignalEvent(element) ? [BpmnProperty.signalRef] : []),
        ...(isTimerEvent(element) ? [BpmnProperty.timerEventDefinition] : []),
        ...(isErrorEvent(element) ? [BpmnProperty.errorRef] : []),
        ...(isMessageEvent(element) ? [BpmnProperty.messageRef, BpmnProperty.correlationKey] : [])
    ],
    [BpmnElement.EndEvent]: (element: Bpmn.DiagramElement) => [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        ...(isSignalEvent(element) ? [BpmnProperty.signalRef] : []),
        ...(isErrorEvent(element) ? [BpmnProperty.errorRef] : []),
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
        ...(isExclusiveGateway(element) || isConditionalFlow(element) || isInclusiveGateway(element) ? [BpmnProperty.conditionExpression] : []),
    ],
    [BpmnElement.Gateway]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation
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
        ...(isDecisionTask(element) ? [BpmnProperty.decisionTask] : [isScriptTask(element) ?
            [BpmnProperty.scriptTask] : [isEmailServiceTask(element) ?
                [BpmnProperty.emailServiceTask] : [isDocgenServiceTask(element) ?
                    [BpmnProperty.docgenServiceTask] : [isContentServiceTask(element) ?
                        [BpmnProperty.contentServiceTask] : BpmnProperty.implementation]]]])
    ],
    [BpmnElement.CallActivity]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        BpmnProperty.inheritBusinessKey,
        BpmnProperty.multiInstanceType,
        BpmnProperty.calledElement
    ],
    [BpmnElement.UserTask]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnCompositeProperty.assignment,
        BpmnProperty.documentation,
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
        ...(hasProcessInside(element) ? [
            BpmnProperty.processId,
            BpmnProperty.processName,
            BpmnProperty.isExecutable,
            BpmnCompositeProperty.properties,
            BpmnCompositeProperty.messages,
            BpmnCompositeProperty.errors
        ] : []),
        BpmnProperty.id,
        BpmnProperty.documentation
    ],
    [BpmnElement.Task]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        BpmnProperty.multiInstanceType
    ],
    [BpmnElement.TextAnnotation]: [
        BpmnProperty.id,
        BpmnProperty.documentation,
        BpmnProperty.textAnnotation
    ],
    [BpmnElement.Lane]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
    ]
};
