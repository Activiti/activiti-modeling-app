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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    ProcessModelerServiceToken, selectProjectConnectorsArray,
    selectSelectedProjectId, ErrorProvidersToken, SCRIPT, CONNECTOR
} from '@alfresco-dbp/modeling-shared/sdk';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProcessConnectorService } from '../../process-connector-service';
import { ErrorRefItemModel } from './error-ref-item.model';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

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

    const providersContentMock = [
        {
            name: 'connector',
            errors: [...connectorErrorMock]
        },
        {
            name: 'connector2',
            errors: [...connector2ErrorMock]
        }
    ];

    const providerMock = {
        id: '4421a40f-41e5-4a16-b74a-fc15ec54f381',
        type: 'CONNECTOR',
        name: 'connector'
    };

    const connectorContentMock = { ...providerMock, errors: connectorErrorMock };

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

    const providerErrorMock = [{
        'name': 'script1',
        'errors': [{
            '$type': 'bpmn:Error',
            'id': 'script.script1_ERROR_1',
            'name': 'ERROR_1',
            'errorCode': 'ERROR_1'
        }, {
            '$type': 'bpmn:Error',
            'id': 'script.script1_ERROR_3',
            'name': 'ERROR_3',
            'errorCode': 'ERROR_3'
        }, {
            '$type': 'bpmn:Error',
            'id': 'script.script1_ERROR_2',
            'name': 'ERROR_2',
            'errorCode': 'ERROR_2'
        }]
    }, {
        'name': 'script2',
        'errors': [{
            '$type': 'bpmn:Error',
            'id': 'script.script2_SCRIPT_2_ERROR_1',
            'name': 'SCRIPT_2_ERROR_1',
            'errorCode': 'SCRIPT_2_ERROR_1'
        }]
    }];

    const scriptProvider = {
        modelType: SCRIPT,
        getErrors: jest.fn(),
        prepareEntities: jest.fn()
    };

    const connectorProvider = {
        modelType: CONNECTOR,
        getErrors: jest.fn(),
        prepareEntities: jest.fn()
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
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
                        select: jest.fn().mockImplementation((selector) => {
                            if (selector === selectProjectConnectorsArray) {
                                return of([providerMock, connector2Mock]);
                            } else if (selector === selectSelectedProjectId) {
                                return of('9505dc01-af29-47cf-9aca-09079200d4a2');
                            }
                            return of({});
                        }),
                    }
                },
                {
                    provide: ErrorProvidersToken,
                    useValue: [scriptProvider]
                }
            ],
            declarations: [CardViewErrorRefItemComponent],
            imports: [TranslateModule.forRoot(), RouterTestingModule],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

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
        spyOn(component, 'getAttachedErrorProvider').and.callFake(() => component['errorProvider'] = providerMock);
        spyOn(component, 'getErrorAsBpmnElement').and.callFake((error) => ({ id: error.id, name: error.name, errorCode: error }));
        const processModelerService = TestBed.inject(ProcessModelerServiceToken);
        spyOn(processModelerService, 'getRootProcessElement').and.returnValue(rootElementsMock);
        const getConnectorErrorsSpy = spyOn(component, 'loadErrorsGroupFromProvider').and.returnValue(of(providersContentMock));
        fixture.detectChanges();
        // verify
        expect(getConnectorErrorsSpy).toHaveBeenCalled();
        expect(component.errors.length).toBe(3);
    });

    it('should load bpmn errors when serviceTask is not connector', () => {
        // setup
        propertyMock.data.element.businessObject.attachedToRef.implementation = null;
        propertyMock.data.element.businessObject.eventDefinitions[0].errorRef = null;
        const processModelerService = TestBed.inject(ProcessModelerServiceToken);
        const processModelerServiceSpy = spyOn(processModelerService, 'getRootProcessElement').and.returnValue(rootElementsMock);
        fixture.detectChanges();
        // verify
        expect(processModelerServiceSpy).toHaveBeenCalled();
        expect(component.errors.length).toBe(1);
    });

    it('should load bpmn errors from diagram and from providers when is a start event', () => {
        // setup
        propertyMock.data.element.businessObject.attachedToRef = null;
        propertyMock.data.element.businessObject.eventDefinitions[0].errorRef = null;
        const processModelerService = TestBed.inject(ProcessModelerServiceToken);
        const processModelerServiceSpy = spyOn(processModelerService, 'getRootProcessElement').and.returnValue(rootElementsMock);
        const getErrorsFromProviderSpy =  spyOn(component, 'getErrorsFromProvider').and.callFake(() => of(providerErrorMock));
        fixture.detectChanges();
        // verify
        expect(getErrorsFromProviderSpy).toHaveBeenCalled();
        expect(processModelerServiceSpy).toHaveBeenCalled();
        expect(component.errors.length).toBe(1);
        expect(component.errorsGroups.length).toBe(2);
    });

    it('getErrorProviderByName should return an error provider by name when exists', () => {
        const getErrorProviderHandlerSpy = spyOn(component, 'getErrorProviderHandler').and.returnValue(connectorProvider);
        const result = component.getErrorProviderByName('connector');
        expect(getErrorProviderHandlerSpy).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it('getErrorProviderByName should not fetch error provider by name when is not present', () => {
        const getErrorProviderHandlerSpy = spyOn(component, 'getErrorProviderHandler').and.returnValue(scriptProvider);
        const result = component.getErrorProviderByName('form');
        expect(getErrorProviderHandlerSpy).toHaveBeenCalled();
        expect(result).toBeUndefined();
    });

});
