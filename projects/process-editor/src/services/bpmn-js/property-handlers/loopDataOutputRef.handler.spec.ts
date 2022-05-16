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
import { BpmnProperty, BpmnElement } from '@alfresco-dbp/modeling-shared/sdk';
import { getDiagramElementMock, getModelingMock } from '../bpmn-js.mock';

describe('LoopDataOutputRef', () => {
    const property = BpmnProperty.loopDataOutputRef;
    const multiInstanceKey = BpmnProperty.loopCharacteristics;

    let handler: { get; set };
    let mockElement: Bpmn.DiagramElement;
    let modeling: Bpmn.Modeling;

    beforeEach(() => {
        handler = handlers[property];
        modeling = getModelingMock();
        mockElement = getDiagramElementMock({ [multiInstanceKey]: { [property]: 'test' } });
        mockElement.type = BpmnElement.Process;
    });

    it('should be defined', () => {
        expect(handler).not.toBe(undefined, `Bpmn property: ${property}, should have a handler defined.`);
    });

    describe('get', () => {
        it('should return the LoopDataOutputRef property from the element', () => {
            const get = handler.get;

            const version = get(mockElement);

            expect(version).toBe('test');
        });
    });

    describe('set', () => {
        it('should set the new LoopDataOutputRef property value', () => {
            const set = handler.set,
                get = handler.get,
                modifiedValue = 'set-test';

            set(modeling, mockElement, modifiedValue);
            const version = get(mockElement);

            expect(version).toBe('set-test');
        });

        it('should call updateProperties with empty properties', () => {
            spyOn(modeling, 'updateProperties');
            const set = handler.set,
                modifiedValue = 'set-test';

            set(modeling, mockElement, modifiedValue);
            expect(modeling.updateProperties).toHaveBeenCalledWith(mockElement, {});
        });
    });
});
