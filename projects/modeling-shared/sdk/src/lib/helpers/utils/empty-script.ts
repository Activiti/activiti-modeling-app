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
    *  3 - Content APIs Example. The following APIs are currently supported: nodesApi, groupsApi, peopleApi and siteApi.
    *
    *   *** PLEASE NOTE: for some actions (like creating a person or a group) the script runtime client must belong to the ALFRESCO_ADMINISTRATORS group ***
    *
    *          const parentNodeId = 'daf40357-b177-4de1-a031-a71630cbdfb4';
    *          const nodeBodyCreate = nodeBody.create();
    *          nodeBodyCreate.name('test');
    *          nodeBodyCreate.nodeType('cm:folder');
    *          nodesApi.createNode(parentNodeId, nodeBodyCreate, true, null, null);
    *
    *          const groupBodyCreate = groupBody.create();
    *          groupBodyCreate.id(variables.groupId);
    *          groupBodyCreate.displayName(variables.groupName);
    *          const response = groupsApi.createGroup(groupBodyCreate, null, null);
    *          if (response.getStatusCode().is2xxSuccessful()) {
    *              variables.groupId = response.getBody().getEntry().getId();
    *          }
    *
    *          const personBodyCreate = personBody.create();
    *          personBodyCreate.id(variables.personId);
    *          personBodyCreate.email(variables.email);
    *          personBodyCreate.firstName(variables.personFirstName);
    *          personBodyCreate.lastName(variables.personFirstName);
    *          personBodyCreate.enabled(true);
    *          personBodyCreate.password('A1?2c3#4D');
    *          const response = peopleApi.createPerson(personBodyCreate, null);
    *          if (response.getStatusCode().is2xxSuccessful()) {
    *              variables.personId = response.getBody().getEntry().getId();
    *          }
    *
    *          const groupMembershipBodyCreate = groupMembershipBody.create();
    *          groupMembershipBodyCreate.id(variables.personId);
    *          groupMembershipBodyCreate.memberType(groupMembershipBody.memberTypePerson());
    *          groupsApi.createGroupMembership(variables.groupId, groupMembershipBodyCreate, null);
    *
    *           const siteBodyCreate = sitesBody.create();
    *           siteBodyCreate.setTitle(variables.siteName);
    *           siteBodyCreate.visibility(sitesBody.siteCreateVisibilityPublic());
    *           const response = sitesApi.createSite(siteBodyCreate, false, false, null);
    *           if (response.getStatusCode().is2xxSuccessful()) {
    *               variables.siteId = response.getBody().getEntry().getId();
    *           }
    *
    *      The syntax to create the needed @Body for the differents APIs are:
    *      3.1 - nodesApi:
    *            const nodeBodyCreate = nodeBody.create();
    *            const nodeBodyUpdate = nodeBody.update();
    *            const nodeBodyLock = nodeBody.lock();
    *            const nodeBodyMove = nodeBody.move();
    *
    *      3.2 - groupsApi:
    *            const groupBodyCreate = groupBody.create();
    *            const groupBodyUpdate = groupBody.update();
    *            const groupMembershipBodyCreate = groupMembershipBody.create();
    *
    *      3.3 - peopleApi:
    *            const personBodyCreate = personBody.create();
    *            const personBodyUpdate = personBody.update();
    *            const passwordResetBody = passwordBody.reset();
    *
    *      3.4 - siteApi:
    *            const siteBodyCreate = sitesBody.create();
    *            const siteBodyUpdate = sitesBody.update();
    *            const siteMembershipBodyCreate = siteMembershipBody.create();
    *            const siteMembershipBodyUpdate = siteMembershipBody.update();
    *            const siteMembershipBodyApproval = siteMembershipBody.approval();
    *            const siteMembershipBodyRequestCreate = siteMembershipBody.requestCreate();
    *            const siteMembershipBodyRejection = siteMembershipBody.rejection();
    *            const siteMembershipBodyRequestUpdate = siteMembershipBody.requestUpdate();
    *
    *  4 - Runtime Commands (ProcessPayloadBuilder and CommandProducer) Example:
    *          const startProcessInstanceCmd = processPayloadBuilder.start().withProcessDefinitionKey('1af40357-b122-4de1-a031-a71630cbdf33').build();
    *          commandProducer.send(startProcessInstanceCmd);
    */`;
}
