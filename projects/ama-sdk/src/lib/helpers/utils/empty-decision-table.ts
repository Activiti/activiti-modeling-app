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

import { formatUuid, createDecisionTableName } from './create-entries-names';
import { ContentType } from './../../api-implementations/acm-api/content-types';
import { DecisionTable } from '../../api/types';

/* tslint:disable */
export const getEmptyDecisionTable = (decisionTable: DecisionTable) => `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/DMN/20151101/dmn.xsd" id="${formatUuid(ContentType.DecisionTable, decisionTable.id)}" name="${createDecisionTableName(decisionTable.name)}" documentation="${decisionTable.description ? decisionTable.description: ''}" namespace="http://camunda.org/schema/1.0/dmn" exporter="dmn-js (https://demo.bpmn.io/dmn)" exporterVersion="6.2.1">
  <decision id="decision-${createDecisionTableName(decisionTable.name)}" name="${createDecisionTableName(decisionTable.name)}">
    <decisionTable id="decisionTable_1sue4jl">
      <input id="input1" label="">
        <inputExpression id="inputExpression1" typeRef="string">
          <text></text>
        </inputExpression>
      </input>
      <output id="output1" label="" name="" typeRef="string" />
    </decisionTable>
  </decision>
</definitions>`