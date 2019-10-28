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

import { BpmnProperty } from 'ama-sdk';
import { createDueDateProperty } from './dueDate-cardview-property';
import { CardViewDateItemModel } from '@alfresco/adf-core';
import { getDiagramElementMock } from '../bpmn-js/bpmn-js.mock';
import { displayDate } from '../bpmn-js/property-handlers/dueDate.handler';

describe('createDueDateProperty', () => {
    let element: Bpmn.DiagramElement;
    let property: CardViewDateItemModel;

    beforeEach(() => {
        element = getDiagramElementMock({
            $type: 'diagram-element-type',
            /* cspell: disable-next-line */
            [BpmnProperty.name]: 'Nobuo Uematsu'
        });

        property = createDueDateProperty({ element });
    });

    it('the format should be ISO8601 formatted', () => {
        expect(property.format).toBe(displayDate);
    });
});
