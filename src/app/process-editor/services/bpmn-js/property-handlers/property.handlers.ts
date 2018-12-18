import { BpmnProperty } from '../../bpmn/properties';
import { idHandler } from './id.handler';
import { nameHandler } from './name.handler';
import { documentationHandler } from './documentation.handler';
import { implementationHandler } from './implementation.handler';
import { versionHandler } from './version.handler';
import { assigneeHandler } from './assignee.handler';
import { candidateGroupsHandler } from './candidateGroups.handler';
import { candidateUsersHandler } from './candidateUsers.handler';
import { dueDateHandler } from './dueDate.handler';
import { priorityHandler } from './priority.handler';
import { calledElementHandler } from './calledElement.handler';
import { expressionHandler } from './expression.handler';
import { processPropertyHandler } from './process-variables.handler';

export const handlers = {
    [BpmnProperty.id]: idHandler,
    [BpmnProperty.name]: nameHandler,
    [BpmnProperty.version]: versionHandler,
    [BpmnProperty.documentation]: documentationHandler,
    [BpmnProperty.implementation]: implementationHandler,
    [BpmnProperty.assignee]: assigneeHandler,
    [BpmnProperty.candidateGroups]: candidateGroupsHandler,
    [BpmnProperty.candidateUsers]: candidateUsersHandler,
    [BpmnProperty.dueDate]: dueDateHandler,
    [BpmnProperty.priority]: priorityHandler,
    [BpmnProperty.calledElement]: calledElementHandler,
    [BpmnProperty.conditionExpression]: expressionHandler,
    [BpmnProperty.properties]: processPropertyHandler
};
