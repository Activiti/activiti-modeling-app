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

describe('modelNameHandler', () => {
    const property = BpmnProperty.modelName;

    let handler: { get, set };
    let mockElement: Bpmn.DiagramElement ;
    let modeling: Bpmn.Modeling;

    beforeEach(() => {
        handler = handlers[property];
        mockElement = getDiagramElementMock({
            $parent: {
                name: 'mock-element-file-name'
            }
        });

        modeling = getModelingMock();
    });

    it('should be defined', () => {
        expect(handler).not.toBe(undefined, `Bpmn property: ${property}, should have a handler defined.`);
    });

    describe('get', () => {
        it('should return the expression from the element', () => {
            const get = handler.get;

            const fileName = get(mockElement);

            expect(fileName).toBe('mock-element-file-name');
        });
    });

    describe('set', () => {
        it('should set the new conditionExpression value', () => {
            const set = handler.set,
                get = handler.get,
                modifiedValue = 'mock-element-file-name-modified';

            set(modeling, mockElement, modifiedValue);
            const expression = get(mockElement);

            expect(expression).toBe(modifiedValue);
        });
    });
});
