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

import { TestBed, async } from '@angular/core/testing';
import { ProcessModelerServiceImplementation } from './process-modeler.service';
import { BpmnFactoryToken } from 'ama-sdk';
import { BpmnFactoryMock } from './bpmn-js/bpmn-js.mock';

describe('ProcessModelerServiceImplementation', () => {

    let service: ProcessModelerServiceImplementation;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                ProcessModelerServiceImplementation,
                { provide: BpmnFactoryToken, useClass: BpmnFactoryMock }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        service = TestBed.get(ProcessModelerServiceImplementation);
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should', () => {

        expect(true).toBe(true);
    });
});
