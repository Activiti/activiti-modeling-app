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

import BpmnModdle from 'bpmn-moddle';
import { BpmnProperty } from 'ama-sdk';
const moddle = new BpmnModdle();


const propertyKey = BpmnProperty.type;

const get = (element: Bpmn.DiagramElement) => {
    const businessObject = element.businessObject;
    const timers = businessObject && businessObject.get(propertyKey),
        text = timers && timers.length > 0 ? timers[0].text : '';

    return text;
};


const set = (modeling: Bpmn.Modeling, element: Bpmn.DiagramElement, value: any) => {
    modeling.updateProperties(element, {
        [propertyKey]: [
            moddle.create('bpmn:TimeCycle', {
                text: value
            })
        ]
    });
};

export const timerTypeHandler = { get, set };
