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
    *          let cost = variables.cost;
    *          let taxes = variables.taxes[0];
    * 
    *  2 - Output Variables Example:
    *          variables.totalCost = cost * (1 + taxes);
    * 
    *  3 - Content APIs Example. The following APIs are currently supported: nodesApi, groupsApi, peopleApi and siteApi.
    *          let parentNodeId = "daf40357-b177-4de1-a031-a71630cbdfb4";
    *          let nodeBodyCreate = nodeBody.create();
    *          nodeBodyCreate.name("test");
    *          nodeBodyCreate.nodeType("cm:folder");
    *          nodesApi.createNode(parentNodeId, nodeBodyCreate, true, null, null);  
    * 
    *      The syntax to create the needed @Body for the differents APIs are:
    *      3.1 - nodesApi:
    *            let nodeBodyCreate = nodeBody.create();
    *            let nodeBodyUpdate = nodeBody.update();
    *            let nodeBodyLock = nodeBody.lock();
    *            let nodeBodyMove = nodeBody.move();
    * 
    *      3.2 - groupsApi:
    *            let groupBodyCreate = groupBody.create();
    *            let groupBodyUpdate = groupBody.update();
    *            let groupMembershipBodyCreate = groupMembershipBody.create();
    * 
    *      3.3 - peopleApi:
    *            let personBodyCreate = personBody.create();
    *            let personBodyUpdate = personBody.update();
    *            let passwordResetBody = passwordBody.reset();
    * 
    *      3.4 - siteApi:
    *            let siteBodyCreate = siteBody.create();
    *            let siteBodyUpdate = siteBody.update();
    *            let siteMembershipBodyCreate = siteMembershipBody.create();
    *            let siteMembershipBodyUpdate = siteMembershipBody.update();
    *            let siteMembershipBodyApproval = siteMembershipBody.approval();
    *            let siteMembershipBodyRequestCreate = siteMembershipBody.requestCreate();
    *            let siteMembershipBodyRejection = siteMembershipBody.rejection();
    *            let siteMembershipBodyRequestUpdate = siteMembershipBody.requestUpdate();
    * 
    *  4 - Runtime Commands (ProcessPayloadBuilder and CommandProducer) Example:
    *          let startProcessInstanceCmd = processPayloadBuilder.start().withProcessDefinitionKey("1af40357-b122-4de1-a031-a71630cbdf33").build();
    *          commandProducer.send(startProcessInstanceCmd);
    */`;
}
