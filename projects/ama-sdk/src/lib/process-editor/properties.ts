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
    name = 'name',
    modelName = 'modelName',
    documentation = 'documentation',
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
    properties = 'properties',
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
    messages = 'messages',
    messagePayload = 'messagePayload',
    textAnnotation = 'textAnnotation',
    isExecutable = 'isExecutable'
}

export const PROCESS_EDITOR_CUSTOM_PROPERTY_HANDLERS = new InjectionToken<ProcessEditorCustomProperty[]>('process-editor-custom-property-handlers');

export interface ProcessEditorCustomProperty {
    type: string;
    implementationClass: Type<{}>;
}

export function providePropertyHandler(type: BpmnProperty, implementationClass: Type<{}>) {
    return {
        provide: PROCESS_EDITOR_CUSTOM_PROPERTY_HANDLERS,
        useValue: { type, implementationClass: implementationClass },
        multi: true
    };
}
