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

import { BpmnProperty } from 'ama-sdk';
import { createIdProperty } from './id-cardview-property';
import { createNameProperty } from './name-cardview-property';
import { createImplementationProperty } from './implementation-cardview-property';
import { createDecisionTaskProperty } from './decisionTask-cardview-property';
import { createVersionProperty } from './version-cardview-property';
import { createDocumentationProperty } from './documentation-cardview-property';
import { createVariablesProperty } from './variables-cardview-property';
import { createAssigneeProperty } from './assignee-cardview-property';
import { createCandidateGroupsProperty } from './candidateGroups-cardview-property';
import { createCandidateUsersProperty } from './candidateUsers-cardview-property';
import { createDueDateProperty } from './dueDate-cardview-property';
import { createPriorityProperty } from './priority-cardview-property';
import { createCalledElementProperty } from './calledElement-cardview-property';
import { createProcessVariablesProperty } from './process-variable-item-property';
import { createExpressionProperty } from './expression-cardview-property';
import { createFormKeyProperty } from './formSelector-cardview-property';
import { createProcessNameProperty } from './process-name-cardview-property';
import { createDefaultSequenceFlowProperty } from './default-sequence-flow-cardview-property';
import { createSignalRefProperty } from './signalRef-cardview-property';
import { createSignalScopeProperty } from './signalScope-cardview-property';
import { createTimerTypeProperty } from './timer-type-cardview-property';
import { createTimerDefinitionProperty } from './timer-definition-cardview-property';

export const bpmn2cardView = {
    [BpmnProperty.id]: createIdProperty,
    [BpmnProperty.name]: createNameProperty,
    [BpmnProperty.version]: createVersionProperty,
    [BpmnProperty.documentation]: createDocumentationProperty,
    [BpmnProperty.implementation]: createImplementationProperty,
    [BpmnProperty.decisionTask]: createDecisionTaskProperty,
    [BpmnProperty.variables]: createVariablesProperty,
    [BpmnProperty.assignee]: createAssigneeProperty,
    [BpmnProperty.candidateGroups]: createCandidateGroupsProperty,
    [BpmnProperty.candidateUsers]: createCandidateUsersProperty,
    [BpmnProperty.dueDate]: createDueDateProperty,
    [BpmnProperty.priority]: createPriorityProperty,
    [BpmnProperty.calledElement]: createCalledElementProperty,
    [BpmnProperty.properties]: createProcessVariablesProperty,
    [BpmnProperty.conditionExpression]: createExpressionProperty,
    [BpmnProperty.formKey]: createFormKeyProperty,
    [BpmnProperty.processName]: createProcessNameProperty,
    [BpmnProperty.defaultSequenceFlow]: createDefaultSequenceFlowProperty,
    [BpmnProperty.signalRef]: createSignalRefProperty,
    [BpmnProperty.signalScope]: createSignalScopeProperty,
    [BpmnProperty.type]: createTimerTypeProperty,
    [BpmnProperty.definition]: createTimerDefinitionProperty
};
