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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { CardViewDueDateItemComponent } from './due-date-item.component';
import { CardItemTypeService, CardViewUpdateService } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AmaState } from '@alfresco-dbp/modeling-shared/sdk';
import { of } from 'rxjs';
import { DueDateItemModel } from './due-date-item.model';

describe('CardViewDueDateItemComponent', () => {
    let fixture: ComponentFixture<CardViewDueDateItemComponent>;
    let component: CardViewDueDateItemComponent;
    let cardViewUpdateService: CardViewUpdateService;
    let store: Store<AmaState>;

    const propertyMock = {
        data: {
            element: {
                businessObject: {
                    eventDefinitions: [{}]
                }
            },
            processId: 'Process_12345678'
        }
    };

    const processMock = {
        extensions: {
            'Process_12345678': {
                properties: {
                    foo: {
                        id: 'processVariable1',
                        name: 'foo',
                        type: 'string',
                        value: 'cat',
                        required: false
                    },
                    bar: {
                        id: 'processVariable2',
                        name: 'bar',
                        type: 'datetime',
                        value: '2020-03-11T00:00:00',
                        required: false
                    }
                }
            }
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                CardItemTypeService,
                CardViewUpdateService,
                FormBuilder,
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn()
                    }
                },
            ],
            declarations: [CardViewDueDateItemComponent],
            imports: [TranslateModule.forRoot()],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CardViewDueDateItemComponent);
        store = TestBed.get(Store);
        component = fixture.componentInstance;
        component.property = <DueDateItemModel>propertyMock;

        cardViewUpdateService = TestBed.get(CardViewUpdateService);
        spyOn(store, 'select').and.returnValue(of(processMock));
        fixture.detectChanges();
    });

    it('should not display variable selector when processVariables is not enabled', () => {
        const dueDateInput = fixture.nativeElement.querySelector('div[class="due-date-input"]');
        const dateTimeVariableInput = fixture.nativeElement.querySelector('div[class="date-time-variable"]');
        expect(dueDateInput).toBeDefined();
        expect(dateTimeVariableInput).toBeNull();
    });

    it('should not display date input when processVariables is not enabled', () => {
        component.useProcessVariable.setValue(true);
        fixture.detectChanges();

        const dueDateInput = fixture.nativeElement.querySelector('div[class="due-date-input"]');
        const dateTimeVariableInput = fixture.nativeElement.querySelector('div[class="date-time-variable"]');
        expect(dueDateInput).toBeNull();
        expect(dateTimeVariableInput).toBeDefined();
    });

    it('should update due date property when process variable is selected', () => {
        spyOn(cardViewUpdateService, 'update');
        component.useProcessVariable.setValue(true);
        component.processVariable.setValue('foo');

        component.updateDueDate();
        fixture.detectChanges();

        expect(cardViewUpdateService.update).toHaveBeenCalledWith(component.property, '${foo}');
    });

    it('should set only datetime process variables when process is retrieved', () => {
        expect(component.processVariables.length).toBe(1);
        expect(component.processVariables[0].name).toBe('bar');
    });
});
