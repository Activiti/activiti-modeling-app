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

import { BpmnElement } from '@alfresco-dbp/modeling-shared/sdk';

const get = (element) => {
    switch (element.type) {
    case BpmnElement.Process:
        return element.businessObject.id;
    case BpmnElement.Participant:
        return element.businessObject.processRef.id;
    case BpmnElement.UserTask:
    case BpmnElement.ServiceTask:
    case BpmnElement.StartEvent:
    case BpmnElement.EndEvent:
    case BpmnElement.BoundaryEvent:
    case BpmnElement.IntermediateCatchEvent:
    case BpmnElement.IntermediateThrowEvent:
    case BpmnElement.CallActivity:
    case BpmnElement.Label:
        if (element.businessObject.$parent.$type === BpmnElement.SubProcess) {
            return element.businessObject.$parent.$parent.id;
        } else {
            return element.businessObject.$parent.id;
        }
    default:
        throw new Error(`Process id not found for element type ${element.type}`);
    }
};

export const processIdHandler = { get };
