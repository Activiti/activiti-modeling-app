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

import { TestBed } from '@angular/core/testing';
import { ProcessModelerServiceImplementation } from './process-modeler.service';
import { BpmnFactoryToken, ModelerInitOptions, MESSAGE, XmlParsingProblem } from '@alfresco-dbp/modeling-shared/sdk';
import { BpmnFactoryMock } from './bpmn-js/bpmn-js.mock';
import { PROCESS_SVG_IMAGE } from './process-editor.constants';

describe('ProcessModelerServiceImplementation', () => {

    let service: ProcessModelerServiceImplementation;
    let bpmnFactoryMock: BpmnFactoryMock;
    let initConfig: ModelerInitOptions;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                ProcessModelerServiceImplementation,
                { provide: BpmnFactoryToken, useClass: BpmnFactoryMock }
            ]
        });
    });

    beforeEach(() => {
        service = TestBed.inject(ProcessModelerServiceImplementation);
        bpmnFactoryMock = TestBed.inject<BpmnFactoryMock>(BpmnFactoryToken);

        initConfig = {
            clickHandler: jest.fn(),
            changeHandler: jest.fn(),
            removeHandler: jest.fn(),
            selectHandler: jest.fn(),
            createHandler: jest.fn(),
            copyActionHandler: jest.fn(),
            pasteActionHandler: jest.fn()
        };
        service.init(initConfig);
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    describe('loadXml', () => {

        function expectEventHandlersCalledTimes(times: number) {
            const handlers = Object.keys(initConfig);
            handlers.forEach(handler => {
                expect(initConfig[handler].mock.calls.length).toEqual(times);
            });
        }

        function fireEventHandlers() {
            const events = ['element.click', 'element.changed', 'shape.remove', 'selection.changed', 'create.end', 'copyPaste.copyElement', 'copyPaste.pasteElement'];
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

    describe('export', () => {

        it('should call saveXML() by default', () => {
            spyOn(bpmnFactoryMock.modeler, 'saveXML');
            service.export().then(() => {
                expect(bpmnFactoryMock.modeler.saveXML).toHaveBeenCalled();
            });
        });

        it('should call saveSVG() for SVG type export', () => {
            spyOn(bpmnFactoryMock.modeler, 'saveSVG');
            service.export(PROCESS_SVG_IMAGE).then(() => {
                expect(bpmnFactoryMock.modeler.saveSVG).toHaveBeenCalled();
            });
        });
    });

    describe('register event handler', () => {

        it('should call the method registered for the event handler', () => {
            const fakeFunc = jasmine.createSpy('registeredEventHandler');
            service.createEventHandlerForAction('banana.action', fakeFunc);
            bpmnFactoryMock.modeler.get('eventBus').fire('banana.action');
            expect(fakeFunc).toHaveBeenCalled();
        });
    });
});
