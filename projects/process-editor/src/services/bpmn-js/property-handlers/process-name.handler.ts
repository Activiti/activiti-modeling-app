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

import { BpmnProperty, BpmnElement, sanitizeString } from '@alfresco-dbp/modeling-shared/sdk';

const propertyKey = BpmnProperty.name;

const get = (element) => {
    let processName: string;
    if (element.type === BpmnElement.Process) {
        processName = element.businessObject[propertyKey];
    } else if (element.type === BpmnElement.Participant) {
        processName = element.businessObject.processRef.name;
    }

    return processName || '';
};
const set = (modeling: Bpmn.Modeling, element: Bpmn.DiagramElement, value: any) => {
    value = sanitizeString(value);

    if (element.type === BpmnElement.Participant) {
        element.businessObject.processRef.name = value;
        element.businessObject.name = value;
        modeling.updateProperties(element, {});
    } else {
        modeling.updateProperties(element, {
            [propertyKey]: value
        });
    }

};

export const processNameHandler = { get, set };
