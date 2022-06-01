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

describe('candidateUsersHandler', () => {
    const property = BpmnProperty.candidateUsers;

    let handler;
    let mockElement;
    let modeling;

    beforeEach(() => {
        handler = handlers[property];
        mockElement = getDiagramElementMock({ [property]: 'new-value' });
        modeling = getModelingMock();
    });

    describe('get', () => {
        it('should return the candidateUsers from the element', () => {
            const get = handler.get;
            const candidateUsers = get(mockElement);

            expect(candidateUsers).toBe('new-value');
        });
    });

    describe('set', () => {
        it('should set the new candidateUsers value', () => {
            const set = handler.set,
                get = handler.get,
                modifiedValue = 'modified-value';

            set(modeling, mockElement, modifiedValue);
            const candidateUsers = get(mockElement);

            expect(candidateUsers).toBe('modified-value');
        });
    });
});
