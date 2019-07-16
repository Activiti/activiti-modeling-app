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


import { ACMCrud } from '../acm-crud';

export class ACMDecisionTable extends ACMCrud {

    displayName = 'Decision Table';
    namePrefix = 'QA_APS_DECISION_';
    type = 'DECISION';
    contentType = 'text/plain';
    contentExtension = 'xml';

    getDefaultContent(name: string, entityId: string) {
        const id = this.type.toLowerCase() + '-' + entityId;

        return `<?xml version="1.0" encoding="UTF-8"?>
        <definitions xmlns="http://www.omg.org/spec/DMN/20151101/dmn.xsd" id="${id}" name="${name}"
          namespace="http://activiti.org/schema/1.0/dmn" exporter="dmn-js (https://demo.bpmn.io/dmn)" exporterVersion="6.2.1">
          <decision id="Decision_${name}" name="Decision_${name}">
          <decisionTable id="DecisionTable_${name}">
            <input id="InputClause_${name}">
              <inputExpression id="LiteralExpression_${name}" typeRef="string" />
            </input>
            <output id="OutputClause_${name}" typeRef="string" />
          </decisionTable>
        </decision>
        </definitions>`;
    }
}
