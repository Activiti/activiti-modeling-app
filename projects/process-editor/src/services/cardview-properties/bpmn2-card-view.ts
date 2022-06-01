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

import { BpmnProperty, BpmnCompositeProperty } from '@alfresco-dbp/modeling-shared/sdk';
import { createIdProperty } from './id-cardview-property';
import { createNameProperty } from './name-cardview-property';
import { createImplementationProperty } from './implementation-cardview-property';
import { createDecisionTaskProperty } from './decision-task-cardview-property';
import { createScriptTaskProperty } from './script-task-cardview-property';
import { createDocumentationProperty } from './documentation-cardview-property';
import { createVariablesProperty } from './variables-cardview-property';
import { createAssigneeProperty } from './assignee-cardview-property';
import { createCandidateGroupsProperty } from './candidate-groups-cardview-property';
import { createCandidateUsersProperty } from './candidate-users-cardview-property';
import { createDueDateProperty } from './due-date-cardview-property';
import { createPriorityProperty } from './priority-cardview-property';
import { createCalledElementProperty } from './called-element-cardview-property';
import { createProcessVariablesProperty } from './process-variable-item-property';
import { createExpressionProperty } from './expression-cardview-property';
import { createFormKeyProperty } from './form-selector-cardview-property';
import { createProcessNameProperty } from './process-name-cardview-property';
import { createDefaultSequenceFlowProperty } from './default-sequence-flow-cardview-property';
import { createSignalRefProperty } from './signal-ref-cardview-property';
import { createSignalScopeProperty } from './signal-scope-cardview-property';
import { createTimerDefinitionProperty } from './timer-definition-cardview-property';
import { createErrorRefProperty } from './error-ref-cardview-property';
import { createMessageProperty } from './message-cardview-property';
import { createCorrelationKeyProperty } from './correlation-key-cardview-property';
import { createProcessMessagesProperty } from './process-messages-item-property';
import { createMultiInstanceProperty } from './multi-instance-cardview-property';
import { createMessagePayloadProperty } from './message-payload-cardview-property';
import { createTextAnnotationProperty } from './text-annotation-cardview-property';
import { createModelNameProperty } from './model-name-cardview-property';
import { createModelCategoryProperty } from './model-category-cardview-property';
import { createIsExecutableProperty } from './is-executable-cardview-property';
import { createAssignmentProperty } from './assignment-cardview-property';
import { createProcessIdProperty } from './process-id-cardview-property';
import { createProcessErrorsProperty } from './process-errors-item-property';
import { createEmailServiceTaskProperty } from './email-service-task-cardview-property';
import { createDocgenServiceTaskProperty } from './docgen-service-task-cardview-property';
import { createContentServiceTaskProperty } from './content-service-task-cardview-property';
import { createInheritBusinessKeyProperty } from './inherit-business-key-cardview-property';
import { createModelVersionProperty } from './model-version-cardview-property';

export const bpmn2cardView = {
    [BpmnProperty.id]: createIdProperty,
    [BpmnProperty.version]: createModelVersionProperty,
    [BpmnProperty.name]: createNameProperty,
    [BpmnProperty.documentation]: createDocumentationProperty,
    [BpmnProperty.implementation]: createImplementationProperty,
    [BpmnProperty.decisionTask]: createDecisionTaskProperty,
    [BpmnProperty.scriptTask]: createScriptTaskProperty,
    [BpmnProperty.variables]: createVariablesProperty,
    [BpmnProperty.assignee]: createAssigneeProperty,
    [BpmnCompositeProperty.assignment]: createAssignmentProperty,
    [BpmnProperty.candidateGroups]: createCandidateGroupsProperty,
    [BpmnProperty.candidateUsers]: createCandidateUsersProperty,
    [BpmnProperty.dueDate]: createDueDateProperty,
    [BpmnProperty.priority]: createPriorityProperty,
    [BpmnProperty.calledElement]: createCalledElementProperty,
    [BpmnCompositeProperty.properties]: createProcessVariablesProperty,
    [BpmnProperty.conditionExpression]: createExpressionProperty,
    [BpmnProperty.formKey]: createFormKeyProperty,
    [BpmnProperty.processName]: createProcessNameProperty,
    [BpmnProperty.processId]: createProcessIdProperty,
    [BpmnProperty.modelName]: createModelNameProperty,
    [BpmnProperty.category]: createModelCategoryProperty,
    [BpmnProperty.defaultSequenceFlow]: createDefaultSequenceFlowProperty,
    [BpmnProperty.signalRef]: createSignalRefProperty,
    [BpmnProperty.errorRef]: createErrorRefProperty,
    [BpmnProperty.signalScope]: createSignalScopeProperty,
    [BpmnProperty.timerEventDefinition]: createTimerDefinitionProperty,
    [BpmnProperty.messageRef]: createMessageProperty,
    [BpmnCompositeProperty.messages]: createProcessMessagesProperty,
    [BpmnProperty.correlationKey]: createCorrelationKeyProperty,
    [BpmnProperty.multiInstanceType]: createMultiInstanceProperty,
    [BpmnProperty.messagePayload]: createMessagePayloadProperty,
    [BpmnProperty.textAnnotation]: createTextAnnotationProperty,
    [BpmnProperty.isExecutable]: createIsExecutableProperty,
    [BpmnCompositeProperty.errors]: createProcessErrorsProperty,
    [BpmnProperty.emailServiceTask]: createEmailServiceTaskProperty,
    [BpmnProperty.docgenServiceTask]: createDocgenServiceTaskProperty,
    [BpmnProperty.contentServiceTask]: createContentServiceTaskProperty,
    [BpmnProperty.inheritBusinessKey]: createInheritBusinessKeyProperty
};
