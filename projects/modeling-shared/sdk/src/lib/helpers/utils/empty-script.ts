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


/* tslint:disable */
/* cSpell:disable */
export const getEmptyScript = (model) => {

    return `
        /*  What can be used?
    *  1 - Input Variables Example:
    *          const cost = variables.cost;
    *          const taxes = variables.taxes[0];
    *
    *  2 - Output Variables Example:
    *          variables.totalCost = cost * (1 + taxes);
    *
    *  3 - Content APIs Example. The following APIs are currently supported: actionsApi, queryApi, searchApi, nodesApi, groupsApi, peopleApi, siteApi and tagsApi.
    *
    *   *** PLEASE NOTE: for some actions (like creating a person or a group) the script runtime client must belong to the ALFRESCO_ADMINISTRATORS group ***
    *
    *   Examples for the different APIs:
    *
    *       3.1.- actionsApi:
    *
    *           Executes an action:
    *           const actionBodyExec = {"actionDefinitionId":"copy","targetId": "4c4b3c43-f18b-43ff-af84-751f16f1ddfd","params": {"destination-folder": "workspace://SpacesStore/34219f79-66fa-4ebf-b371-118598af898c"}}
    *           const actionService = new ActionService();
    *           const result = actionService.actionExec(actionBodyExec);
    *           variables.id = result.entry.id;
    *
    *       3.2.- queryApi:
    *
    *           Finds nodes:
    *           const term = "lorem";
    *           const queryService = new QueryService();
    *           const result = queryService.findNodes(term);
    *           variables.name = result.list.entries[0].entry.name;
    *
    *       3.3.- searchApi:
    *
    *           Searches Alfresco:
    *           const query = {"query": {"query": "cm:title:alfrezco"}}
    *           const searchService = new SearchService();
    *           searchService.search(query);
    *
    *       3.4.- nodesApi:
    *
    *           Creates a node:
    *           const parentNodeId = 'daf40357-b177-4de1-a031-a71630cbdfb4';
    *           const nodeBodyCreate = {name:"test2", nodeType: "cm:folder"};
    *           const nodeService = new NodeService();
    *           const node = nodeService.createNode(parentNodeId, nodeBodyCreate);
    *           variables.id = node.entry.id;
    *
    *       3.5.- groupsApi:
    *
    *           Creates a group:
    *           const groupBodyCreate = {"id":variables.groupId, "displayName": variables.groupName};
    *           const groupService = new GroupService();
    *           const group = groupService.createGroup(groupBodyCreate);
    *           variables.displayName = group.entry.displayName;
    *
    *       3.6.- peopleApi:
    *
    *           Creates a person:
    *           const personBodyCreate = {"id": "abeecher","firstName": "Alice","lastName": "Beecher","displayName": "Alice Beecher","email": "abeecher@example.com","password": "secret","properties":{"my:property": "The value"}}
    *           const peopleService = new PeopleService();
    *           const people = peopleService.createPerson(personBodyCreate);
    *           variables.email = people.entry.email;
    *
    *       3.7.- sitesApi:
    *
    *           Creates a site:
    *           const siteBodyCreate = {"title": "Marketing","visibility": "PUBLIC"}
    *           const siteService = new SiteService();
    *           const site = siteService.createSite(siteBodyCreate);
    *           variables.title = site.entry.title;
    *
    *       3.8.- tagsApi:
    *
    *           Creates a tag for a node:
    *           const tagBodyCreate = {"tag": "test-tag-1"}
    *           const tagService = new TagService();
    *           const nodeId = '657fbf20-3896-43d7-a5d8-91f41cbfee73';
    *           const tag = tagService.createTagForNode(nodeId, tagBodyCreate);
    *
    *
    *  4 - Runtime Commands (ProcessPayloadBuilder and CommandProducer) Example:
    *          const startProcessInstanceCmd = processPayloadBuilder.start().withProcessDefinitionKey('1af40357-b122-4de1-a031-a71630cbdf33').build();
    *          commandProducer.send(startProcessInstanceCmd);
    *
    *
    *  5 - Runtime APIs Example. The following APIs are currently supported: ProcessInstanceAdminControllerApi, ProcessInstanceControllerApi, ProcessInstanceTasksControllerApi, ProcessInstanceVariableAdminControllerApi, ProcessInstanceVariableControllerApi, TaskAdminControllerApi, TaskControllerApi, TaskVariableAdminControllerApi and TaskVariableControllerApi.
    *
    *  Examples for the different APIs:
    *
    *       5.1.- runtimeProcessInstanceAdminService (it includes ProcessInstanceAdminControllerApi and ProcessInstanceVariableAdminControllerApi):
    *
    *           const startProcessPayload = { businessKey: variables.businessKey, payloadType: 'StartProcessPayload', processDefinitionKey: variables.processKey };
    *           const runtimeProcessInstanceAdminService = new RuntimeProcessInstanceAdminService();
    *           runtimeProcessInstanceService.startProcess(startProcessPayload);
    *
    *       5.2.- runtimeProcessInstanceService (it includes ProcessInstanceControllerApi, ProcessInstanceTasksControllerApi and ProcessInstanceVariableControllerApi):
    *
    *           const startProcessPayload = { businessKey: variables.businessKey, payloadType: 'StartProcessPayload', processDefinitionKey: variables.processKey };
    *           const runtimeProcessInstanceService = new RuntimeProcessInstanceService();
    *           runtimeProcessInstanceService.startProcess(startProcessPayload);
    *
    *       5.3.- runtimeTaskService (it includes TaskControllerApi and TaskVariableControllerApi):
    *
    *           const assignTaskPayload = { assignee: variables.assignee, id: '08fdd393-eb2c-4026-85aa-3801f71294d9', payloadType: 'AssignTaskPayload', taskId: 'id-task-1' };
    *           const runtimeTaskService = new RuntimeTaskService();
    *           runtimeTaskService.assign('id-task-1', assignTaskPayload);
    *
    *       5.4.- runtimeTaskAdminService (it includes TaskAdminControllerApi and TaskVariableAdminControllerApi):
    *
    *           const assignTaskPayload = { assignee: variables.assignee, id: '08fdd393-eb2c-4026-85aa-3801f71294d9', payloadType: 'AssignTaskPayload', taskId: 'id-task-1' };
    *           const runtimeTaskAdminService = new RuntimeTaskAdminService();
    *           runtimeTaskAdminService.assign('id-task-1', assignTaskPayload);
    *
    *  6 - Query APIs Example. The following APIs are currently supported: ProcessInstanceAdminControllerApi, ProcessInstanceControllerApi, ProcessInstanceDeleteControllerApi, ProcessInstanceDiagramAdminControllerApi, ProcessInstanceDiagramControllerApi, ProcessInstanceServiceTasksAdminControllerApi, ProcessInstanceTasksControllerApi, ProcessInstanceVariableAdminControllerApi, ProcessInstanceVariableControllerApi, TaskAdminControllerApi, TaskControllerApi, TaskVariableAdminControllerApi and TaskVariableControllerApi.
    *
    *  Examples for the different APIs:
    *
    *       6.1.- queryProcessInstanceAdminService (it includes ProcessInstanceAdminControllerApi, ProcessInstanceDiagramAdminControllerApi, ProcessInstanceServiceTasksAdminControllerApi and ProcessInstanceVariableAdminControllerApi):
    *
    *           const queryProcessInstanceAdminService = new QueryProcessInstanceAdminService();
    *           queryProcessInstanceAdminService.findById('idProcess');
    *
    *       6.2.- queryProcessInstanceService (it includes ProcessInstanceControllerApi, ProcessInstanceDeleteControllerApi, ProcessInstanceDiagramControllerApi, ProcessInstanceTasksControllerApi and ProcessInstanceVariableControllerApi):
    *
    *           const queryProcessInstanceService = new QueryProcessInstanceService();
    *           queryProcessInstanceService.findById('idProcess');
    *
    *       6.3.- queryTaskAdminService (it includes TaskAdminControllerApi and TaskVariableAdminControllerApi):
    *
    *           const queryTaskAdminService = new QueryTaskAdminService();
    *           queryTaskAdminService.findById('idTask');
    *
    *       6.4.- queryTaskService (it includes TaskControllerApi and TaskVariableControllerApi):
    *
    *           const queryTaskService = new QueryTaskService();
    *           queryTaskService.findById('idTask');
    *
    *   7 - Form APIs Example. The following APIs are currently supported: FormApi.
    *
    *   Examples for the different APIs:
    *
    *       7.1.- FormService (it includes FormApi):
    *
    *           const formId = variables.formId;
    *           const formService = new FormService();
    *           const form = formService.getFormDefinition(formId);
    *
    *
    */`;
}
