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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardViewUpdateService } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CardViewMessageItemComponent } from './message-item.component';
import { MessageItemModel } from './message-item.model';
import { Store } from '@ngrx/store';
import { ProcessModelerServiceToken, ProcessModelerService, BpmnFactoryToken, AmaState } from '@alfresco-dbp/modeling-shared/sdk';
import { ProcessModelerServiceImplementation } from '../../process-modeler.service';
import { BpmnFactoryMock } from '../../bpmn-js/bpmn-js.mock';

describe('CardViewMessageItemComponent', () => {
    let fixture: ComponentFixture<CardViewMessageItemComponent>;
    let component: CardViewMessageItemComponent;
    let cardViewUpdateService: CardViewUpdateService;
    let processModelerService: ProcessModelerService;
    let store: Store<AmaState>;

    const propertyMock = new MessageItemModel({
        label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.MESSAGE',
        value: '',
        key: '',
        data: {
            element: {
                businessObject: {
                    eventDefinitions: [{
                        messageRef: {
                            id: 'message_123',
                            name: 'message_123'
                        }
                    }]
                }
            }
        }
    });

    const processMock = {
        businessObject: {
            $parent: {
                rootElements: [
                    {
                        $type: 'bpmn:Message',
                        id: 'message_123',
                        name: 'Message_123'
                    },
                    {
                        $type: 'bpmn:Message',
                        id: 'message_456',
                        name: 'Message_456'
                    }
                ]
            }
        }
    };

    const messageMock = {
        $type: 'bpmn:Message',
        id: 'message_678',
        name: 'Message_678'
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: Store,
                    useValue: {
                        dispatch: jest.fn()
                    }
                },
                { provide: ProcessModelerServiceToken, useClass: ProcessModelerServiceImplementation },
                { provide: BpmnFactoryToken, useClass: BpmnFactoryMock }
            ],
            declarations: [CardViewMessageItemComponent],
            imports: [TranslateModule.forRoot()],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CardViewMessageItemComponent);
        component = fixture.componentInstance;
        cardViewUpdateService = TestBed.inject(CardViewUpdateService);
        processModelerService = TestBed.inject(ProcessModelerServiceToken);
        store = TestBed.inject(Store);

        spyOn(processModelerService, 'getRootProcessElement').and.returnValue(processMock);
        spyOn(processModelerService, 'getFromModeler').and.returnValue({create: () => messageMock});
        spyOn(store, 'dispatch');
        spyOn(cardViewUpdateService, 'update');

        component.property = propertyMock;
        fixture.detectChanges();
    });

    it('should set the selected message from the XML file', () => {
        expect(component.selectedMessage.id).toBe('message_123');
    });

    it('should set the message available messages from the XML file', () => {
        expect(component.messages.length).toBe(2);
        expect(component.messages[0].id).toBe('message_123');
        expect(component.messages[1].id).toBe('message_456');
    });

    it('should add new message to messages and select it when a new one is created', () => {
        component.createNewMessage();
        expect(component.selectedMessage.id).toBe('message_678');
        expect(component.messages.length).toBe(3);
        expect(component.messages[2].id).toBe('message_678');
    });

    it('should add new message to messages and select it when a new one is created', () => {
        component.onMessageChange();
        expect(cardViewUpdateService.update).toHaveBeenCalled();
        expect(store.dispatch).toHaveBeenCalled();
    });

    it('should change message to new one when a new one is created', () => {
        spyOn(component, 'onMessageChange');
        component.createNewMessage();
        expect(component.onMessageChange).toHaveBeenCalled();
    });

});
