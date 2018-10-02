/*!
 * @license
 * Alfresco Example Modeling Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Modeling Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Modeling Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Modeling Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { BpmnProperty } from '../bpmn/properties';
import { getDiagramElementMock, getModelingMock } from './bpmn-js.mock';
import { ElementHelper } from './element.helper';

describe('ElementHelper', () => {
    let element: Bpmn.DiagramElement, modeling: Bpmn.Modeling, consoleError: any;
    const propertyWithoutHandler = <BpmnProperty>'non-existing-property';

    beforeEach(() => {
        element = getDiagramElementMock({
            $type: 'diagram-element-type',
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
            const expectedPropertyValue = 'Yasunori Mitsuda';

            ElementHelper.setProperty(modeling, element, BpmnProperty.name, expectedPropertyValue);
            const modifiedPropertyValue = ElementHelper.getProperty(element, BpmnProperty.name);

            expect(modifiedPropertyValue).toBe(expectedPropertyValue);
        });

        it(`should NOT set the given property if it doesn't have a handler defined`, () => {
            const setter = () => {
                ElementHelper.setProperty(modeling, element, propertyWithoutHandler, 'Chrono Trigger');
            };
            expect(setter).not.toThrow();

            const modifiedPropertyValue = ElementHelper.getProperty(element, propertyWithoutHandler);
            expect(modifiedPropertyValue).toBe(null);
        });
    });
});
