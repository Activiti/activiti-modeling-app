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

import { BpmnProperty } from '@alfresco-dbp/modeling-shared/sdk';

// Bpmn-moddle transpiled this way... Good luck using typescript imports (check unit tests and working app as well!!!)
const BpmnModdle = require('bpmn-moddle');
const createBpmnModdle = BpmnModdle.default || BpmnModdle;

const moddle = createBpmnModdle();

const propertyKey = BpmnProperty.conditionExpression;

const get = (element: Bpmn.DiagramElement) => {
    const businessObject = element.businessObject;
    const expression = businessObject && businessObject.get(propertyKey),
        body =  expression ? expression.body : '';

    return body;
};

const set = (modeling: Bpmn.Modeling, element: Bpmn.DiagramElement, value: any) => {
    modeling.updateProperties(element, {
        [propertyKey]: moddle.create('bpmn:FormalExpression', { body: value })
    });
};

export const expressionHandler = { get, set };
