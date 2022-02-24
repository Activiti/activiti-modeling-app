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

const propertyKey = BpmnProperty.inheritBusinessKey;

const get = (element) => {
    const value: boolean = element.businessObject.$attrs[propertyKey];

    return value === undefined ? false : value;
};

const set = (modeling: Bpmn.Modeling, element: Bpmn.DiagramElement, value: any) => {
    element.businessObject.$attrs[propertyKey] = value;
    modeling.updateProperties(element, {});
};

export const inheritBusinessKeyHandler = { get, set };
