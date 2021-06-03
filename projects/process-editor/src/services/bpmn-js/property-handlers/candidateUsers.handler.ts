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
import { updateShapeProperty } from './update-shape-property.handler';

const propertyKey = BpmnProperty.candidateUsers;

const get = element => element.businessObject.get(propertyKey);
const set = (modeling: Bpmn.Modeling, element: Bpmn.DiagramElement, value: any) => {
    updateShapeProperty(element, propertyKey, value);
    modeling.updateProperties(element, {});
};

export const candidateUsersHandler = { get, set };
