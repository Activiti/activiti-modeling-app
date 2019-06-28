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
import { idHandler } from './id.handler';
import { nameHandler } from './name.handler';
import { documentationHandler } from './documentation.handler';
import { implementationHandler } from './implementation.handler';
import { decisionTaskHandler } from './decisionTask.handler';
import { versionHandler } from './version.handler';
import { assigneeHandler } from './assignee.handler';
import { candidateGroupsHandler } from './candidateGroups.handler';
import { candidateUsersHandler } from './candidateUsers.handler';
import { dueDateHandler } from './dueDate.handler';
import { priorityHandler } from './priority.handler';
import { calledElementHandler } from './calledElement.handler';
import { expressionHandler } from './expression.handler';
import { formSelectorHandler } from './formSelector.handler';
import { processPropertyHandler } from './process-variables.handler';
import { processNameHandler } from './process-name.handler';
import { defaultSequenceFlowHandler } from './default-sequence-flow.handler';
import { signalRefHandler } from './signalRef.handler';
import { signalScopeHandler } from './signalScope.handler';
import { timerTypeHandler } from './timer-type.handler';
import { timerDefinitionHandler } from './timer-definition.handler';

export const handlers = {
    [BpmnProperty.id]: idHandler,
    [BpmnProperty.processName]: processNameHandler,
    [BpmnProperty.name]: nameHandler,
    [BpmnProperty.version]: versionHandler,
    [BpmnProperty.documentation]: documentationHandler,
    [BpmnProperty.implementation]: implementationHandler,
    [BpmnProperty.decisionTask]: decisionTaskHandler,
    [BpmnProperty.assignee]: assigneeHandler,
    [BpmnProperty.candidateGroups]: candidateGroupsHandler,
    [BpmnProperty.candidateUsers]: candidateUsersHandler,
    [BpmnProperty.dueDate]: dueDateHandler,
    [BpmnProperty.priority]: priorityHandler,
    [BpmnProperty.calledElement]: calledElementHandler,
    [BpmnProperty.conditionExpression]: expressionHandler,
    [BpmnProperty.formKey]: formSelectorHandler,
    [BpmnProperty.properties]: processPropertyHandler,
    [BpmnProperty.defaultSequenceFlow]: defaultSequenceFlowHandler,
    [BpmnProperty.signalRef]: signalRefHandler,
    [BpmnProperty.signalScope]: signalScopeHandler,
    [BpmnProperty.type]: timerTypeHandler,
    [BpmnProperty.definition]: timerDefinitionHandler,
};
