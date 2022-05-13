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
import { CardViewTimerDefinitionItemComponent } from './timer-definition-item.component';
import { CardViewUpdateService, AppConfigService } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AmaState } from '@alfresco-dbp/modeling-shared/sdk';
import { of } from 'rxjs';
import moment from 'moment-es6';

describe('CardViewTimerDefinitionItemComponent', () => {
    let fixture: ComponentFixture<CardViewTimerDefinitionItemComponent>;
    let component: CardViewTimerDefinitionItemComponent;
    let cardViewUpdateService: CardViewUpdateService;
    let store: Store<AmaState>;

    const timerOptionsMock = [
        {
            'key': 'timeCycle',
            'label': 'PROCESS_EDITOR.TIMER_TYPES.CYCLE'
        },
        {
            'key': 'timeDuration',
            'label': 'PROCESS_EDITOR.TIMER_TYPES.DURATION'
        },
        {
            'key': 'timeDate',
            'label': 'PROCESS_EDITOR.TIMER_TYPES.DATE'
        }
    ];

    const propertyMock: any = {
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
                        type: 'number',
                        value: 3,
                        required: false
                    },
                    foobar: {
                        id: 'processVariable3',
                        name: 'foobar',
                        type: 'datetime',
                        value: '2019-11-01T00:00:00+00:00',
                        required: false
                    },
                    foobar1: {
                        id: 'processVariable4',
                        name: 'foobar1',
                        type: 'date',
                        value: '2019-11-01',
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
                {
                    provide: AppConfigService, useValue: {
                        get(key: string) {
                            if (key === 'process-modeler.timer-types') {
                                return timerOptionsMock;
                            }
                            return null;
                        }
                    }
                }
            ],
            declarations: [CardViewTimerDefinitionItemComponent],
            imports: [TranslateModule.forRoot()],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CardViewTimerDefinitionItemComponent);
        store = TestBed.inject(Store);
        component = fixture.componentInstance;
        component.property = propertyMock;

        spyOn(store, 'select').and.returnValue(of(processMock));
        cardViewUpdateService = TestBed.inject(CardViewUpdateService);
        fixture.detectChanges();
    });

    it('should not display timer inputs if type is not selected', () => {
        const cycleInput = fixture.nativeElement.querySelector('div[class="timer-cycle"]');
        const dateInput = fixture.nativeElement.querySelector('div[class="ama-timer-date"]');
        const durationInput = fixture.nativeElement.querySelector('div[class="ama-timer-duration"]');
        expect(cycleInput).toBeNull();
        expect(dateInput).toBeNull();
        expect(durationInput).toBeNull();
    });

    it('should not display timer inputs if processVariable is selected', () => {
        component.timerType.setValue('timeCycle');
        component.useProcessVariable.setValue(true);
        fixture.detectChanges();
        const cycleInput = fixture.nativeElement.querySelector('div[class="timer-cycle"]');
        const dateInput = fixture.nativeElement.querySelector('div[class="ama-timer-date"]');
        const durationInput = fixture.nativeElement.querySelector('div[class="ama-timer-duration"]');
        expect(cycleInput).toBeNull();
        expect(dateInput).toBeNull();
        expect(durationInput).toBeNull();
    });

    it('should display timer cycle inputs if cycle type is selected', () => {
        component.timerType.setValue('timeCycle');
        fixture.detectChanges();
        const cycleInput = fixture.nativeElement.querySelector('div[class="timer-cycle"]');
        const dateInput = fixture.nativeElement.querySelector('div[class="ama-timer-date"]');
        const durationInput = fixture.nativeElement.querySelector('div[class="ama-timer-duration"]');
        expect(cycleInput).not.toBeNull();
        expect(dateInput).not.toBeNull();
        expect(durationInput).not.toBeNull();
    });

    it('should display timer date inputs if date type is selected', () => {
        component.timerType.setValue('timeDate');
        fixture.detectChanges();
        const cycleInput = fixture.nativeElement.querySelector('div[class="timer-cycle"]');
        const dateInput = fixture.nativeElement.querySelector('div[class="ama-timer-date"]');
        const durationInput = fixture.nativeElement.querySelector('div[class="ama-timer-duration"]');
        expect(cycleInput).toBeNull();
        expect(dateInput).not.toBeNull();
        expect(durationInput).toBeNull();
    });

    it('should display timer duration inputs if duration type is selected', () => {
        component.timerType.setValue('timeDuration');
        fixture.detectChanges();
        const cycleInput = fixture.nativeElement.querySelector('div[class="timer-cycle"]');
        const dateInput = fixture.nativeElement.querySelector('div[class="ama-timer-date"]');
        const durationInput = fixture.nativeElement.querySelector('div[class="ama-timer-duration"]');
        expect(cycleInput).toBeNull();
        expect(dateInput).toBeNull();
        expect(durationInput).not.toBeNull();
    });

    it('should update timer definition when the duration inputs are filled', () => {
        spyOn(cardViewUpdateService, 'update');
        component.timerType.setValue('timeDuration');
        component.years.setValue(1);

        component.updateTimerDefinition();
        fixture.detectChanges();

        expect(cardViewUpdateService.update).toHaveBeenCalledWith(component.property, {
            type: 'timeDuration',
            definition: 'P1Y'
        });
    });

    it('should update timer definition when the date inputs are filled', () => {
        spyOn(cardViewUpdateService, 'update');
        component.timerType.setValue('timeDate');
        component.date.setValue(moment('2020-03-11'));

        component.updateTimerDefinition();
        fixture.detectChanges();

        expect(cardViewUpdateService.update).toHaveBeenCalledWith(component.property, {
            type: 'timeDate',
            definition: '2020-03-11T00:00:00.000Z'
        });
    });

    it('should update timer definition when the cycle inputs are filled', () => {
        spyOn(cardViewUpdateService, 'update');
        component.timerType.setValue('timeCycle');
        component.date.setValue(moment('2020-03-11'));
        component.repetitions.setValue(3);
        component.years.setValue(1);

        component.updateTimerDefinition();
        fixture.detectChanges();

        expect(cardViewUpdateService.update).toHaveBeenCalledWith(component.property, {
            type: 'timeCycle',
            definition: 'R3/2020-03-11T00:00:00.000Z/P1Y'
        });
    });

    it('should update timer definition when the cycle input is filled with cron expression', () => {
        spyOn(cardViewUpdateService, 'update');
        component.timerType.setValue('timeCycle');
        component.useCronExpression.setValue(true);
        component.cronExpression.setValue('0 0/5 * * * ?');

        component.updateTimerDefinition();
        fixture.detectChanges();

        expect(cardViewUpdateService.update).toHaveBeenCalledWith(component.property, {
            type: 'timeCycle',
            definition: '0 0/5 * * * ?'
        });
    });

    it('should update timer definition when the process variable input is filled', () => {
        spyOn(cardViewUpdateService, 'update');
        component.timerType.setValue('timeCycle');
        component.useProcessVariable.setValue(true);
        component.processVariable.setValue('myVariable');

        component.updateTimerDefinition();
        fixture.detectChanges();

        expect(cardViewUpdateService.update).toHaveBeenCalledWith(component.property, {
            type: 'timeCycle',
            definition: '${myVariable}'
        });
    });

    it('should hide process variable option when the event is of type StartEvent', () => {
        component.eventType = 'bpmn:StartEvent';
        component.timerType.setValue('timeCycle');
        fixture.detectChanges();
        let processVariableContainer = fixture.nativeElement.querySelector('div[class="timer-variable"]');
        expect(processVariableContainer).toBeNull();

        component.eventType = 'bpmn:BoundaryEvent';
        fixture.detectChanges();
        processVariableContainer = fixture.nativeElement.querySelector('div[class="timer-variable"]');
        expect(processVariableContainer).not.toBeNull();
    });

    it('should set process variables when process is retrieved based on type', () => {
        expect(component.optionsForParams['timeDuration'].length).toBe(1);
        expect(component.optionsForParams['timeCycle'].length).toBe(1);
        expect(component.optionsForParams['timeDate'].length).toBe(2);

        expect(component.optionsForParams['timeDuration'][0].name).toBe('foo');
        expect(component.optionsForParams['timeCycle'][0].name).toBe('foo');
        expect(component.optionsForParams['timeDate'][0].name).toBe('foobar');
        expect(component.optionsForParams['timeDate'][1].name).toBe('foobar1');
    });
});
