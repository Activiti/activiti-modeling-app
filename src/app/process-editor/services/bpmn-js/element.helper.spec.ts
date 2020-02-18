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
import { getDiagramElementMock, getModelingMock } from './bpmn-js.mock';
import { ElementHelper } from './element.helper';

describe('ElementHelper', () => {
    let element: Bpmn.DiagramElement, modeling: Bpmn.Modeling, consoleError: any;
    const propertyWithoutHandler = <BpmnProperty>'non-existing-property';

    beforeEach(() => {
        element = getDiagramElementMock({
            $type: 'diagram-element-type',
            /* cspell: disable-next-line */
            [BpmnProperty.name]: 'Nobuo Uematsu'
        });

        modeling = getModelingMock();

        consoleError = console.error;
        console.error = () => {};
    });

    afterEach(() => {
        console.error = consoleError;
    });

    describe('getType', () => {
        it('should return the type of element', () => {
            const type = ElementHelper.getType(element);

            expect(type).toBe('diagram-element-type');
        });
    });

    describe('getProperty', () => {
        it('should return the given property of the element', () => {
            const propertyValue = ElementHelper.getProperty(element, BpmnProperty.name);
            /* cspell: disable-next-line */
            expect(propertyValue).toBe('Nobuo Uematsu');
        });

        it(`should return null, if the given property doesn't have a handler defined`, () => {
            const getter = () => {
                return ElementHelper.getProperty(element, propertyWithoutHandler);
            };
            expect(getter).not.toThrow();

            const propertyValue = getter();
            expect(propertyValue).toBe(null);
        });
    });

    describe('setProperty', () => {
        it('should set the given property', () => {
            /* cspell: disable-next-line */
            const expectedPropertyValue = 'Yasunori Mitsuda';

            ElementHelper.setProperty(modeling, element, BpmnProperty.name, expectedPropertyValue);
            const modifiedPropertyValue = ElementHelper.getProperty(element, BpmnProperty.name);

            expect(modifiedPropertyValue).toBe(expectedPropertyValue);
        });

        it(`should NOT set the given property if it doesn't have a handler defined`, () => {
            const setter = () => {
                /* cspell: disable-next-line */
                ElementHelper.setProperty(modeling, element, propertyWithoutHandler, 'Chrono Trigger');
            };
            expect(setter).not.toThrow();

            const modifiedPropertyValue = ElementHelper.getProperty(element, propertyWithoutHandler);
            expect(modifiedPropertyValue).toBe(null);
        });
    });
});
