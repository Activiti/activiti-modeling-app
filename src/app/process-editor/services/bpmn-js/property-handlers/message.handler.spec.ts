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

import { handlers } from './property.handlers';
import { BpmnProperty } from '@alfresco-dbp/modeling-shared/sdk';
import { getDiagramElementMock, getModelingMock } from '../bpmn-js.mock';

describe('messageHandler', () => {
    const property = BpmnProperty.messageRef;

    let handler, mockElement, modeling;

    beforeEach(() => {
        handler = handlers[property];
        mockElement = getDiagramElementMock({ eventDefinitions: [{
            [property]: {
                id: 'message_123',
                name: 'message_123'
            }
        }]});
        modeling = getModelingMock();
    });

    it('should be defined', () => {
        expect(handler).not.toBe(undefined, `Bpmn property: ${property}, should have a handler defined.`);
    });

    describe('get', () => {
        it('should return the message from the element', () => {
            const get = handler.get;
            const message = get(mockElement);

            expect(message.id).toBe('message_123');
        });
    });

    describe('set', () => {
        it('should set the new message value', () => {
            const set = handler.set,
                get = handler.get,
                modifiedValue = {
                    id: 'message_456',
                    name: 'message_456'
                };

            set(modeling, mockElement, modifiedValue);
            const message = get(mockElement);

            expect(message.id).toBe('message_456');
        });
    });
});
