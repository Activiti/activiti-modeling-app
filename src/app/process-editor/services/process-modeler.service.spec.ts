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
import { BpmnFactoryToken, ModelerInitOptions, MESSAGE, XmlParsingProblem } from 'ama-sdk';
import { BpmnFactoryMock } from './bpmn-js/bpmn-js.mock';

describe('ProcessModelerServiceImplementation', () => {

    let service: ProcessModelerServiceImplementation,
        bpmnFactoryMock: BpmnFactoryMock,
        initConfig: ModelerInitOptions;

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
        bpmnFactoryMock = TestBed.get(BpmnFactoryToken);

        initConfig = {
            clickHandler: jest.fn(),
            changeHandler: jest.fn(),
            removeHandler: jest.fn(),
            selectHandler: jest.fn()
        };
        service.init(initConfig);
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should test updateElementId method', () => {
        const modeler = bpmnFactoryMock.modeler;
        const modeling = modeler.get('modeling');
        spyOn(modeling, 'updateProperties');

        const mockEvent = { element: { id: 'ServiceTask_1ny0i0c', type: 'bpmn:UserTask' } };

        modeler.get('eventBus').fire('shape.changed', mockEvent);
        expect(modeling.updateProperties).toHaveBeenCalledWith(mockEvent.element, { id: 'UserTask_1ny0i0c' });
    });

    describe('loadXml', () => {

        function expectEventHandlersCalledTimes(times: number) {
            const handlers = Object.keys(initConfig);
            handlers.forEach(handler => {
                expect(initConfig[handler].mock.calls.length).toEqual(times, `${handler} was not called in the right amount of number.`);
            });
        }

        function fireEventHandlers() {
            const events = ['element.click', 'element.changed', 'shape.remove', 'selection.changed'];
            events.forEach(event => {
                bpmnFactoryMock.modeler.get('eventBus').fire(event);
            });
        }

        it('should mute event handlers when starting the load', () => {
            expectEventHandlersCalledTimes(0);
            fireEventHandlers();
            expectEventHandlersCalledTimes(1);

            service.loadXml('<xml />').subscribe(() => {});

            fireEventHandlers();
            expectEventHandlersCalledTimes(1);
        });

        it('should unmute event handlers when loaded successfully', (complete) => {
            spyOn(bpmnFactoryMock.modeler, 'importXML')
                .and.callFake((xml, callback) => callback(null, []));

            service.loadXml('<xml />').subscribe({
                next: () => {
                    fireEventHandlers();
                    expectEventHandlersCalledTimes(1);
                },
                complete
            });
        });

        it('should unmute event handlers when loading WAS NOT successful', (complete) => {
            spyOn(bpmnFactoryMock.modeler, 'importXML')
                .and.callFake((xml, callback) => callback('error', []));

            service.loadXml('<xml />').subscribe({
                error: () => {
                    fireEventHandlers();
                    expectEventHandlersCalledTimes(1);
                    complete();
                }
            });
        });

        it('should have error when an error happens during importXml', (complete) => {
            spyOn(bpmnFactoryMock.modeler, 'importXML')
                .and.callFake((xml, callback) => callback(new Error('expected error'), []));

            service.loadXml('<xml />').subscribe({
                error: (error: XmlParsingProblem) => {
                    expect(error.type).toBe(MESSAGE.ERROR);
                    expect(error.messages).toEqual(['Error: expected error']);
                    complete();
                }
            });
        });

        it('should have error when a warning(s) happen(s) during importXml', (complete) => {
            spyOn(bpmnFactoryMock.modeler, 'importXML')
                .and.callFake((xml, callback) => callback(null, [
                    { message: 'warning1'},
                    { message: 'warning2'}
                ]));

            service.loadXml('<xml />').subscribe({
                error: (error: XmlParsingProblem) => {
                    expect(error.type).toBe(MESSAGE.WARN);
                    expect(error.messages).toEqual(['warning1', 'warning2']);
                    complete();
                }
            });
        });
    });
});
