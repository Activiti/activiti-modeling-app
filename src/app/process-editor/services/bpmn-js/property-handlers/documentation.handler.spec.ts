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

import { handlers } from './property.handlers';
import { BpmnProperty } from '../../bpmn/properties';
import { getDiagramElementMock, getModelingMock } from '../bpmn-js.mock';
import BpmnModdle from 'bpmn-moddle';

describe('documentationHandler', () => {
    const property = BpmnProperty.documentation;

    let handler, mockElement, modeling;

    beforeEach(() => {
        const moddle = new BpmnModdle();
        handler = handlers[property];
        mockElement = getDiagramElementMock({
            [property]: [moddle.create('bpmn:Documentation', { text: 'documentation-lorem-ipsum' })]
        });

        modeling = getModelingMock();
    });

    it('should be defined', () => {
        expect(handler).not.toBe(undefined, `Bpmn property: ${property}, should have a handler defined.`);
    });

    describe('get', () => {
        it('should return the documentation from the element', () => {
            const get = handler.get;

            const id = get(mockElement);

            expect(id).toBe('documentation-lorem-ipsum');
        });
    });

    describe('set', () => {
        it('should set the new documentation value', () => {
            const set = handler.set,
                get = handler.get,
                modifiedValue = 'modified-documentation-lorem-ipsum';

            set(modeling, mockElement, modifiedValue);
            const id = get(mockElement);

            expect(id).toBe('modified-documentation-lorem-ipsum');
        });
    });
});
