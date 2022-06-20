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

import { Type, InjectionToken } from '@angular/core';

export enum BpmnProperty {
    id = 'id',
    version = 'version',
    name = 'name',
    modelName = 'modelName',
    documentation = 'documentation',
    category = 'targetNamespace',
    implementation = 'implementation',
    decisionTask = 'decisionTask',
    scriptTask = 'scriptTask',
    formKey = 'formKey',
    variables = 'variables',
    assignee = 'assignee',
    candidateUsers = 'candidateUsers',
    candidateGroups = 'candidateGroups',
    dueDate = 'dueDate',
    priority = 'priority',
    calledElement = 'calledElement',
    conditionExpression = 'conditionExpression',
    processName = 'processName',
    processId = 'processId',
    defaultSequenceFlow = 'default',
    signalRef = 'signalRef',
    signalScope = 'signalScope',
    timerEventDefinition = 'timerEventDefinition',
    errorRef = 'errorRef',
    messageRef = 'messageRef',
    correlationKey = 'correlationKey',
    multiInstanceType = 'multiInstanceType',
    messageExpression = 'messageExpression',
    messagePayload = 'messagePayload',
    textAnnotation = 'textAnnotation',
    isExecutable = 'isExecutable',
    loopCharacteristics = 'loopCharacteristics',
    loopDataOutputRef = 'loopDataOutputRef',
    emailServiceTask = 'emailServiceTask',
    docgenServiceTask = 'docgenServiceTask',
    contentServiceTask = 'contentServiceTask',
    inheritBusinessKey = 'inheritBusinessKey'
}

export enum BpmnCompositeProperty {
    assignment = 'assignment',
    properties = 'properties',
    messages = 'messages',
    errors = 'errors',
    emailTemplate = 'emailTemplate'
}

export const PROCESS_EDITOR_CUSTOM_PROPERTY_HANDLERS = new InjectionToken<ProcessEditorCustomProperty[]>('process-editor-custom-property-handlers');

export interface ProcessEditorCustomProperty {
    type: string;
    implementationClass: Type<any>;
}

export function providePropertyHandler(type: BpmnProperty | BpmnCompositeProperty, implementationClass: Type<any>) {
    return {
        provide: PROCESS_EDITOR_CUSTOM_PROPERTY_HANDLERS,
        useValue: { type, implementationClass: implementationClass },
        multi: true
    };
}

type ParticipantType = (element: Bpmn.DiagramElement) => (BpmnProperty | BpmnCompositeProperty)[];

export interface ProcessElements {
    [bpmnElement: string]: (BpmnProperty | BpmnCompositeProperty)[] | ParticipantType;
}

export const PROCESS_ELEMENTS_TOKEN = new InjectionToken('process-elements');

export function provideProcessElementProperties(extendedElementProperties: ProcessElements) {
    return {
        provide: PROCESS_ELEMENTS_TOKEN,
        useValue: extendedElementProperties
    };
}

export const PROCESS_CARDVIEW_PROPERTIES_TOKEN = new InjectionToken('process-cardview-properties');

export function provideCardViewProperties(extendedCardViewProperties) {
    return {
        provide: PROCESS_CARDVIEW_PROPERTIES_TOKEN,
        useValue: extendedCardViewProperties
    };
}
