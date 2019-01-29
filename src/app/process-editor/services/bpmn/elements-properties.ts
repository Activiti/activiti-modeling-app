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

import { BpmnElement } from './elements';
import { BpmnProperty } from 'ama-sdk';

export const elementsProperties = {
    [BpmnElement.Process]: [
        BpmnProperty.id,
        BpmnProperty.processName,
        BpmnProperty.version,
        BpmnProperty.documentation,
        BpmnProperty.properties
    ],
    [BpmnElement.IntermediateCatchEvent]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation
    ],
    [BpmnElement.IntermediateThrowEvent]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation
    ],
    [BpmnElement.StartEvent]: [
        BpmnProperty.id,
        BpmnProperty.name,
        BpmnProperty.documentation,
        BpmnProperty.formKey
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
        BpmnProperty.documentation
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
