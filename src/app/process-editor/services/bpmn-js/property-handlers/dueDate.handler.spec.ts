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
import { BpmnProperty, MOMENT_DATETIME_FORMAT } from '@alfresco-dbp/modeling-shared/sdk';
import { getDiagramElementMock, getModelingMock } from '../bpmn-js.mock';
import * as moment from 'moment';

describe('dueDateHandler', () => {
    const property = BpmnProperty.dueDate;
    const mockDate = moment();

    let handler, mockElement, modeling;

    beforeEach(() => {
        handler = handlers[property];
        mockElement = getDiagramElementMock({ [property]: mockDate.format(MOMENT_DATETIME_FORMAT) });
        modeling = getModelingMock();
    });

    it('should be defined', () => {
        expect(handler).not.toBe(undefined, `Bpmn property: ${property}, should have a handler defined.`);
    });

    describe('get', () => {
        it('should return the dueDate from the element', () => {
            const get = handler.get;
            const dueDate = get(mockElement);

            expect(dueDate).toBe(mockDate.format(MOMENT_DATETIME_FORMAT));
        });
    });

    describe('set', () => {
        it('should set the new dueDate value', () => {
            const newMockDate = new Date();
            const set = handler.set;
            const get = handler.get;

            set(modeling, mockElement, newMockDate);
            const dueDate = get(mockElement);

            expect(dueDate).toBe(moment(newMockDate).format(MOMENT_DATETIME_FORMAT));
        });
    });
});
