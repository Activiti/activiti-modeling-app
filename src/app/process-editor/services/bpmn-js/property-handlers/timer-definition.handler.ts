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

const get = element => {
    return element.businessObject.eventDefinitions[0].timeCycle ||
        element.businessObject.eventDefinitions[0].timeDuration ||
        element.businessObject.eventDefinitions[0].timeDate;
};

const set = (modeling: Bpmn.Modeling, element: Bpmn.DiagramElement, value: { type: string, definition: string }, bpmnFactory: Bpmn.Moddle) => {

    delete element.businessObject.eventDefinitions[0].timeCycle;
    delete element.businessObject.eventDefinitions[0].timeDuration;
    delete element.businessObject.eventDefinitions[0].timeDate;

    let timer = undefined;
    timer = bpmnFactory.create('bpmn:FormalExpression', { body: value.definition });
    timer.$parent = element.businessObject.eventDefinitions[0];
    element.businessObject.eventDefinitions[0][value.type] = timer;

    modeling.updateProperties(element, {});
};

export const timerDefinitionHandler = { get, set };
