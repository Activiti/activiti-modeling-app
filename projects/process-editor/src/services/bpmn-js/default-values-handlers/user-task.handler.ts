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

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import * as inherits from 'inherits';
import { updateShapeProperty } from '../property-handlers/update-shape-property.handler';
import { BpmnProperty, BpmnElement } from '@alfresco-dbp/modeling-shared/sdk';

const ASSIGNEE_DEFAULT_VALUE = '${initiator}';
const PRIORITY_DEFAULT_VALUE = 0;

export function UserTaskDefaultValuesHandler(eventBus, elementRegistry) {
    CommandInterceptor.call(this, eventBus, 1500);

    this.postExecuted(
        'shape.create',
        context => {
            const element = elementRegistry.get(context.shape.id);

            if (element.type === BpmnElement.UserTask) {
                updateShapeProperty(element, BpmnProperty.assignee, ASSIGNEE_DEFAULT_VALUE);
                updateShapeProperty(element, BpmnProperty.priority, PRIORITY_DEFAULT_VALUE);
            }
        },
        true
    );
}

inherits(UserTaskDefaultValuesHandler, CommandInterceptor);

UserTaskDefaultValuesHandler.$inject = ['eventBus', 'elementRegistry'];

export const UserTaskDefaultValuesBpmnJsModule = {
    __init__: ['userTaskDefaultValuesHandler'],
    userTaskDefaultValuesHandler: ['type', UserTaskDefaultValuesHandler]
};
