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

import { CardViewErrorRefItemComponent } from './error-ref-item.component';
import { CardViewUpdateService, CardItemTypeService } from '@alfresco/adf-core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ProcessModelerServiceToken, Connector } from '@alfresco-dbp/modeling-shared/sdk';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProcessConnectorService } from '../../process-connector-service';
import { ErrorRefItemModel } from './error-ref-item.model';
import { of } from 'rxjs';
import { cold } from 'jasmine-marbles';

describe('CardViewErrorRefItemComponent', () => {
    let fixture: ComponentFixture<CardViewErrorRefItemComponent>;
    let component: CardViewErrorRefItemComponent;

    const propertyMock = {
        data: {
            element: {
                businessObject: {
                    attachedToRef: {
                        $type: 'bpmn:ServiceTask',
                        id: 'ServiceTask_1jh8uhu',
                        implementation: 'connector.ACTION'
                    },
                    eventDefinitions: [{ errorRef: null }]
                }
            },
            processId: 'Process_12345678'
        }
    };

    const connectorErrorMock = [
        { name: 'error_connector1', code: 'error_connector1', description: 'error_connector1' },
        { name: 'error_connector2', code: 'error_connector2', description: 'error_connector2' },
        { name: 'error_connector3', code: 'error_connector3', description: 'error_connector3' }
    ];

    const connector2ErrorMock = [
        { name: 'mockConnector2.error_connector1', code: 'mockConnector2.error_connector1', description: 'mockConnector2.error_connector1' },
        { name: 'mockConnector2.error_connector2', code: 'mockConnector2.error_connector2', description: 'mockConnector2.error_connector2' }
    ];

    const connectorMock = {
        id: '4421a40f-41e5-4a16-b74a-fc15ec54f381',
        type: 'CONNECTOR',
        name: 'mockConnector'
    };

    const connectorContentMock = { ...connectorMock, errors: connectorErrorMock };

    const connector2Mock = {
        id: '4421a40f-41e5-4a16-b74a-fc15ec54f382',
        type: 'CONNECTOR',
        name: 'mockConnector2'
    };

    const connector2ContentMock = { ...connector2Mock, errors: connector2ErrorMock };

    const rootElementsMock = {
        businessObject: {
            $parent: {
                rootElements: [
                    { $type: 'bpmn:Process', id: 'Process_example', name: 'process' },
                    { $type: 'bpmn:Error', id: 'Error_0example', name: 'Error_0example', errorCode: 'Error_0example' }
                ]
            }
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                CardItemTypeService,
                CardViewUpdateService,
                {
                    provide: ProcessModelerServiceToken, useValue: {
                        getRootProcessElement: jest.fn(),
                        getFromModeler: jest.fn().mockReturnValue({
                            create(element: string) {
                                return {
                                    id: '',
                                    type: element,
                                    businessObject: {}
                                };
                            }
                        })
                    }
                },
                {
                    provide: ProcessConnectorService, useValue: {
                        getContent: jest.fn().mockImplementation(id => {
                            switch (id) {
                                case '4421a40f-41e5-4a16-b74a-fc15ec54f381':
                                    return of(connectorContentMock);
                                case '4421a40f-41e5-4a16-b74a-fc15ec54f382':
                                    return of(connector2ContentMock);
                                default:
                                    return of();
                            }
                        })
                    }
                },
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockReturnValue(of([connectorMock, connector2Mock]))
                    }
                },
            ],
            declarations: [CardViewErrorRefItemComponent],
            imports: [TranslateModule.forRoot()],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CardViewErrorRefItemComponent);
        component = fixture.componentInstance;
        component.property = <ErrorRefItemModel>propertyMock;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should load connector errors when serviceTask connector', () => {
        // setup
        spyOn(component, 'getConnector').and.callFake(() => component['connector'] = <Connector>connectorMock);
        spyOn(component, 'getErrorAsBpmnElement').and.callFake((error) => {
            return { id: error.id, name: error.name, errorCode: error };
        });
        const processModelerService = TestBed.get(ProcessModelerServiceToken);
        spyOn(processModelerService, 'getRootProcessElement').and.returnValue(rootElementsMock);
        const getConnectorErrorsSpy = spyOn(component, 'getConnectorErrors').and.returnValue(of(connectorErrorMock));
        fixture.detectChanges();
        // verify
        expect(getConnectorErrorsSpy).toHaveBeenCalled();
        expect(component.errors.length).toBe(3);
    });

    it('should load bpmn errors when serviceTask is not connector', () => {
        // setup
        propertyMock.data.element.businessObject.attachedToRef.implementation = null;
        propertyMock.data.element.businessObject.eventDefinitions[0].errorRef = null;
        const processModelerService = TestBed.get(ProcessModelerServiceToken);
        const processModelerServiceSpy = spyOn(processModelerService, 'getRootProcessElement').and.returnValue(rootElementsMock);
        fixture.detectChanges();
        // verify
        expect(processModelerServiceSpy).toHaveBeenCalled();
        expect(component.errors.length).toBe(1);
    });

    it('should load bpmn errors from diagram and from connectors when is a start event', () => {
        // setup
        propertyMock.data.element.businessObject.attachedToRef = null;
        propertyMock.data.element.businessObject.eventDefinitions[0].errorRef = null;
        const processModelerService = TestBed.get(ProcessModelerServiceToken);
        const processModelerServiceSpy = spyOn(processModelerService, 'getRootProcessElement').and.returnValue(rootElementsMock);
        fixture.detectChanges();
        // verify
        expect(processModelerServiceSpy).toHaveBeenCalled();
        expect(component.errors.length).toBe(1);

        const expected = cold('(x|)', {
            x: [
                {
                    name: connectorMock.name,
                    errors: [
                        {
                            businessObject: {},
                            id: 'connector.mockConnector_error_connector1',
                            name: 'error_connector1',
                            errorCode: 'error_connector1',
                            type: 'bpmn:Error'
                        },
                        {
                            businessObject: {},
                            id: 'connector.mockConnector_error_connector2',
                            name: 'error_connector2',
                            errorCode: 'error_connector2',
                            type: 'bpmn:Error'
                        },
                        {
                            businessObject: {},
                            id: 'connector.mockConnector_error_connector3',
                            name: 'error_connector3',
                            errorCode: 'error_connector3',
                            type: 'bpmn:Error'
                        }
                    ]
                },
                {
                    name: connector2Mock.name,
                    errors: [
                        {
                            businessObject: {},
                            id: 'connector.mockConnector2_mockConnector2.error_connector1',
                            name: 'mockConnector2.error_connector1',
                            errorCode: 'mockConnector2.error_connector1',
                            type: 'bpmn:Error'
                        },
                        {
                            businessObject: {},
                            id: 'connector.mockConnector2_mockConnector2.error_connector2',
                            name: 'mockConnector2.error_connector2',
                            errorCode: 'mockConnector2.error_connector2',
                            type: 'bpmn:Error'
                        }
                    ]
                }
            ]
        });

        expect(component.connectorErrorGroups$).toBeObservable(expected);
    });

});
