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
import { idHandler } from './id.handler';
import { nameHandler } from './name.handler';
import { documentationHandler } from './documentation.handler';
import { implementationHandler } from './implementation.handler';
import { decisionTaskHandler } from './decision-task.handler';
import { scriptTaskHandler } from './script-task.handler';
import { assigneeHandler } from './assignee.handler';
import { candidateGroupsHandler } from './candidate-groups.handler';
import { candidateUsersHandler } from './candidate-users.handler';
import { dueDateHandler } from './due-date.handler';
import { priorityHandler } from './priority.handler';
import { calledElementHandler } from './called-element.handler';
import { expressionHandler } from './expression.handler';
import { formSelectorHandler } from './form-selector.handler';
import { processPropertyHandler } from './process-variables.handler';
import { processNameHandler } from './process-name.handler';
import { defaultSequenceFlowHandler } from './default-sequence-flow.handler';
import { signalRefHandler } from './signal-ref.handler';
import { signalScopeHandler } from './signal-scope.handler';
import { timerDefinitionHandler } from './timer-definition.handler';
import { errorRefHandler } from './error-ref.handler';
import { messageHandler } from './message.handler';
import { correlationKeyHandler } from './correlation-key.handler';
import { processMessagesHandler } from './process-messages.handler';
import { multiInstanceHandler } from './multi-instance.handler';
import { textAnnotationHandler } from './text-annotation.handler';
import { modelNameHandler } from './model-name.handler';
import { isExecutableHandler } from './is-executable.handler';
import { categoryHandler } from './category.handler';
import { processIdHandler } from './process-id.handler';
import { processErrorsHandler } from './process-errors.handler';
import { loopCharacteristics } from './loop-characteristics.handler';
import { loopDataOutputRef } from './loop-data-output-ref.handler';
import { emailServiceTaskHandler } from './email-service-task.handler';
import { inheritBusinessKeyHandler } from './inherit-business-key.handler';
import { versionHandler } from './version.handler';

export const handlers = {
    [BpmnProperty.id]: idHandler,
    [BpmnProperty.version]: versionHandler,
    [BpmnProperty.processName]: processNameHandler,
    [BpmnProperty.processId]: processIdHandler,
    [BpmnProperty.modelName]: modelNameHandler,
    [BpmnProperty.name]: nameHandler,
    [BpmnProperty.documentation]: documentationHandler,
    [BpmnProperty.category]: categoryHandler,
    [BpmnProperty.implementation]: implementationHandler,
    [BpmnProperty.decisionTask]: decisionTaskHandler,
    [BpmnProperty.scriptTask]: scriptTaskHandler,
    [BpmnProperty.assignee]: assigneeHandler,
    [BpmnProperty.candidateGroups]: candidateGroupsHandler,
    [BpmnProperty.candidateUsers]: candidateUsersHandler,
    [BpmnProperty.dueDate]: dueDateHandler,
    [BpmnProperty.priority]: priorityHandler,
    [BpmnProperty.calledElement]: calledElementHandler,
    [BpmnProperty.conditionExpression]: expressionHandler,
    [BpmnProperty.formKey]: formSelectorHandler,
    [BpmnCompositeProperty.properties]: processPropertyHandler,
    [BpmnProperty.defaultSequenceFlow]: defaultSequenceFlowHandler,
    [BpmnProperty.signalRef]: signalRefHandler,
    [BpmnProperty.signalScope]: signalScopeHandler,
    [BpmnProperty.timerEventDefinition]: timerDefinitionHandler,
    [BpmnProperty.errorRef]: errorRefHandler,
    [BpmnProperty.messageRef]: messageHandler,
    [BpmnProperty.correlationKey]: correlationKeyHandler,
    [BpmnCompositeProperty.messages]: processMessagesHandler,
    [BpmnProperty.multiInstanceType]: multiInstanceHandler,
    [BpmnProperty.textAnnotation]: textAnnotationHandler,
    [BpmnProperty.isExecutable]: isExecutableHandler,
    [BpmnCompositeProperty.errors]: processErrorsHandler,
    [BpmnProperty.loopCharacteristics]: loopCharacteristics,
    [BpmnProperty.loopDataOutputRef]: loopDataOutputRef,
    [BpmnProperty.emailServiceTask]: emailServiceTaskHandler,
    [BpmnProperty.inheritBusinessKey]: inheritBusinessKeyHandler
};
