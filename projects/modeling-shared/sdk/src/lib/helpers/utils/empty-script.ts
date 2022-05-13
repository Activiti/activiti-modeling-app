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

/* eslint-disable */
/* cSpell:disable */
export const getEmptyScript = (model) => {

    return emptyScriptTemplate;
}

export const emptyScriptTemplate = `
/*  What can be used?
*  1 - Input Variables Example:
*          const cost = variables.cost;
*          const taxes = variables.taxes[0];
*
*  2 - Output Variables Example:
*          variables.totalCost = cost * (1 + taxes);
*
*  3 - Runtime Commands (ProcessPayloadBuilder and CommandProducer) Example:
*          const startProcessInstanceCmd = processPayloadBuilder.start().withProcessDefinitionKey('1af40357-b122-4de1-a031-a71630cbdf33').build();
*          commandProducer.send(startProcessInstanceCmd);
*
*  4 - Runtime APIs Example. The following APIs are currently supported: ProcessInstanceAdminControllerApi, ProcessInstanceControllerApi, ProcessInstanceTasksControllerApi, ProcessInstanceVariableAdminControllerApi, ProcessInstanceVariableControllerApi, TaskAdminControllerApi, TaskControllerApi, TaskVariableAdminControllerApi and TaskVariableControllerApi.
*
*  Examples for the different APIs:
*
*       4.1.- runtimeProcessInstanceAdminService (it includes ProcessInstanceAdminControllerApi and ProcessInstanceVariableAdminControllerApi):
*
*           const startProcessPayload = { businessKey: variables.businessKey, payloadType: 'StartProcessPayload', processDefinitionKey: variables.processKey };
*           const runtimeProcessInstanceAdminService = new RuntimeProcessInstanceAdminService();
*           runtimeProcessInstanceAdminService.startProcess(startProcessPayload);
*
*       4.2.- runtimeProcessInstanceService (it includes ProcessInstanceControllerApi, ProcessInstanceTasksControllerApi and ProcessInstanceVariableControllerApi):
*
*           const startProcessPayload = { businessKey: variables.businessKey, payloadType: 'StartProcessPayload', processDefinitionKey: variables.processKey };
*           const runtimeProcessInstanceService = new RuntimeProcessInstanceService();
*           runtimeProcessInstanceService.startProcess(startProcessPayload);
*
*       4.3.- runtimeTaskService (it includes TaskControllerApi and TaskVariableControllerApi):
*
*           const assignTaskPayload = { assignee: variables.assignee, id: '08fdd393-eb2c-4026-85aa-3801f71294d9', payloadType: 'AssignTaskPayload', taskId: 'id-task-1' };
*           const runtimeTaskService = new RuntimeTaskService();
*           runtimeTaskService.assign('id-task-1', assignTaskPayload);
*
*       4.4.- runtimeTaskAdminService (it includes TaskAdminControllerApi and TaskVariableAdminControllerApi):
*
*           const assignTaskPayload = { assignee: variables.assignee, id: '08fdd393-eb2c-4026-85aa-3801f71294d9', payloadType: 'AssignTaskPayload', taskId: 'id-task-1' };
*           const runtimeTaskAdminService = new RuntimeTaskAdminService();
*           runtimeTaskAdminService.assign('id-task-1', assignTaskPayload);
*
*  5 - Query APIs Example. The following APIs are currently supported: ProcessInstanceAdminControllerApi, ProcessInstanceControllerApi, ProcessInstanceDeleteControllerApi, ProcessInstanceDiagramAdminControllerApi, ProcessInstanceDiagramControllerApi, ProcessInstanceServiceTasksAdminControllerApi, ProcessInstanceTasksControllerApi, ProcessInstanceVariableAdminControllerApi, ProcessInstanceVariableControllerApi, TaskAdminControllerApi, TaskControllerApi, TaskVariableAdminControllerApi and TaskVariableControllerApi.
*
*  Examples for the different APIs:
*
*       5.1.- queryProcessInstanceAdminService (it includes ProcessInstanceAdminControllerApi, ProcessInstanceDiagramAdminControllerApi, ProcessInstanceServiceTasksAdminControllerApi and ProcessInstanceVariableAdminControllerApi):
*
*           const queryProcessInstanceAdminService = new QueryProcessInstanceAdminService();
*           queryProcessInstanceAdminService.findById('idProcess');
*
*       5.2.- queryProcessInstanceService (it includes ProcessInstanceControllerApi, ProcessInstanceDeleteControllerApi, ProcessInstanceDiagramControllerApi, ProcessInstanceTasksControllerApi and ProcessInstanceVariableControllerApi):
*
*           const queryProcessInstanceService = new QueryProcessInstanceService();
*           queryProcessInstanceService.findById('idProcess');
*
*       5.3.- queryTaskAdminService (it includes TaskAdminControllerApi and TaskVariableAdminControllerApi):
*
*           const queryTaskAdminService = new QueryTaskAdminService();
*           queryTaskAdminService.findById('idTask');
*
*       5.4.- queryTaskService (it includes TaskControllerApi and TaskVariableControllerApi):
*
*           const queryTaskService = new QueryTaskService();
*           queryTaskService.findById('idTask');
*
*  6 - Form APIs Example. The following APIs are currently supported: FormApi.
*
*  Examples for the different APIs:
*
*       6.1.- FormService (it includes FormApi):
*
*           const formId = variables.formId;
*           const formService = new FormService();
*           const form = formService.getFormDefinition(formId);
*
*
*/`;
