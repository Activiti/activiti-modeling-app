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

import { handlers } from './property-handlers/property.handlers';
import { BpmnProperty, BpmnCompositeProperty } from '@alfresco-dbp/modeling-shared/sdk';

export const ElementHelper = {
    getType(element: Bpmn.DiagramElement): string {
        return element.businessObject.$type;
    },

    getProperty(element: Bpmn.DiagramElement, propertyName: BpmnProperty | BpmnCompositeProperty): any {
        try {
            const handler = getHandler(propertyName);
            const get = handler.get;
            return get(element);
        } catch (error) {
            /*tslint:disable-next-line*/
            console.error(`Handler::get is not defined for ${propertyName}`, error);
            return null;
        }
    },

    setProperty(modeling: Bpmn.Modeling, element: Bpmn.DiagramElement, propertyName: BpmnProperty, value: any, moddle: Bpmn.Moddle): void {
        try {
            const handler = getHandler(propertyName);
            const set = handler.set;

            set(modeling, element, value, moddle);
        } catch (error) {
            /*tslint:disable-next-line*/
            console.error(`Handler::set is not defined for ${propertyName}`, error);
        }
    }
};

function getHandler(propertyName) {
    return handlers[propertyName];
}
