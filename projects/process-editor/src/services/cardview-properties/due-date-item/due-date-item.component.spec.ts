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

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CardViewDueDateItemComponent, DueDateType } from './due-date-item.component';
import { CardViewUpdateService, CoreTestingModule } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AmaState } from '@alfresco-dbp/modeling-shared/sdk';
import { of } from 'rxjs';
import { DueDateItemModel } from './due-date-item.model';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatRadioModule } from '@angular/material/radio';

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

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                FormBuilder,
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn()
                    }
                },
            ],
            declarations: [CardViewDueDateItemComponent],
            imports: [
                CoreTestingModule,
                TranslateModule.forRoot(),
                MatRadioModule,
                NoopAnimationsModule
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(CardViewDueDateItemComponent);
        store = TestBed.inject(Store);
        component = fixture.componentInstance;
        component.property = <DueDateItemModel>propertyMock;

        cardViewUpdateService = TestBed.inject(CardViewUpdateService);
        spyOn(store, 'select').and.returnValue(of(processMock));
        component.ngOnInit();
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should not display variable selector when processVariables is not enabled', () => {
        const dueDateInput = fixture.nativeElement.querySelector('div[class="due-date-input"]');
        const dateTimeVariableInput = fixture.nativeElement.querySelector('div[class="date-time-variable"]');
        expect(dueDateInput).toBeDefined();
        expect(dateTimeVariableInput).toBeNull();
    });

    it('should not display date input when processVariables is enabled', () => {
        component.selectedDueDateType.setValue(component.dueDateType.ProcessVariable);
        fixture.detectChanges();

        const dueDateInput = fixture.nativeElement.querySelector('div[class="due-date-input"]');
        const dateTimeVariableInput = fixture.nativeElement.querySelector('div[class="date-time-variable"]');
        expect(dueDateInput).toBeNull();
        expect(dateTimeVariableInput).toBeDefined();
    });

    it('should update due date property when process variable is selected', fakeAsync(() => {
        spyOn(cardViewUpdateService, 'update');

        setProcessVariable(component, fixture, 1);

        expect(cardViewUpdateService.update).toHaveBeenCalledWith(component.property, '${bar}');
    }));

    it('should set only datetime process variables when process is retrieved', () => {
        expect(component.processVariables.length).toBe(1);
        expect(component.processVariables[0].name).toBe('bar');
    });

    it('should set time duration values', fakeAsync(() => {
        spyOn(cardViewUpdateService, 'update');

        setTimeDuration(component, fixture);

        expect(cardViewUpdateService.update).toHaveBeenCalledWith(component.property, 'P1M2DT3H4M');
    }));

    it('should extract time duration values from iso string', () => {
        spyOn(cardViewUpdateService, 'update');
        component.property = { data: propertyMock.data, value: 'P1M2DT3H4M' } as DueDateItemModel;
        component.ngOnInit();

        const {
            months,
            days,
            hours,
            minutes,
        } = component.timeDurationForm.value;

        expect(months).toBe('1');
        expect(days).toBe('2');
        expect(hours).toBe('3');
        expect(minutes).toBe('4');
    });

    it('should maintain values when switching between due date type', fakeAsync(() => {
        spyOn(cardViewUpdateService, 'update');

        cardViewUpdateService.update(component.property, '2022-05-25T12:00:00');

        setTimeDuration(component, fixture);
        expect(cardViewUpdateService.update).toHaveBeenCalledWith(component.property, 'P1M2DT3H4M');

        setProcessVariable(component, fixture, 1);
        expect(cardViewUpdateService.update).toHaveBeenCalledWith(component.property, '${bar}');

        changeDueDateType(component, fixture, DueDateType.StaticDate);
        expect(cardViewUpdateService.update).toHaveBeenCalledWith(component.property, '2022-05-25T12:00:00');

        changeDueDateType(component, fixture, DueDateType.TimeDuration);
        expect(cardViewUpdateService.update).toHaveBeenCalledWith(component.property, 'P1M2DT3H4M');

        changeDueDateType(component, fixture, DueDateType.ProcessVariable);
        expect(cardViewUpdateService.update).toHaveBeenCalledWith(component.property, '${bar}');

        changeDueDateType(component, fixture, DueDateType.TimeDuration);
        expect(cardViewUpdateService.update).toHaveBeenCalledWith(component.property, 'P1M2DT3H4M');

        changeDueDateType(component, fixture, DueDateType.StaticDate);
        expect(cardViewUpdateService.update).toHaveBeenCalledWith(component.property, '2022-05-25T12:00:00');
    }));
});

function setTimeDuration(component: CardViewDueDateItemComponent, fixture: ComponentFixture<CardViewDueDateItemComponent>) {
    changeDueDateType(component, fixture, DueDateType.TimeDuration);

    const monthInput = fixture.debugElement.query(By.css(`[data-automation-id="ama-date-time-duration-months"]`));
    const daysInput = fixture.debugElement.query(By.css(`[data-automation-id="ama-date-time-duration-days"]`));
    const hoursInput = fixture.debugElement.query(By.css(`[data-automation-id="ama-date-time-duration-hours"]`));
    const minutesInput = fixture.debugElement.query(By.css(`[data-automation-id="ama-date-time-duration-minutes"]`));

    monthInput.triggerEventHandler('input', { target: { value: '1' } });
    daysInput.triggerEventHandler('input', { target: { value: '2' } });
    hoursInput.triggerEventHandler('input', { target: { value: '3' } });
    minutesInput.triggerEventHandler('input', { target: { value: '4' } });

    fixture.detectChanges();
    tick(300);
}

function setProcessVariable(component: CardViewDueDateItemComponent, fixture: ComponentFixture<CardViewDueDateItemComponent>, index: number) {
    changeDueDateType(component, fixture, DueDateType.ProcessVariable);

    const variableSelect = fixture.debugElement.query(By.css('mat-select'));
    variableSelect.nativeElement.click();
    fixture.detectChanges();

    const options = fixture.debugElement.queryAll(By.css('mat-option'));
    options[index].nativeElement.click();

    tick(300);
}

function changeDueDateType(component: CardViewDueDateItemComponent, fixture: ComponentFixture<CardViewDueDateItemComponent>, type: DueDateType) {
    component.selectedDueDateType.setValue(type);
    fixture.detectChanges();
    tick(300);
}
