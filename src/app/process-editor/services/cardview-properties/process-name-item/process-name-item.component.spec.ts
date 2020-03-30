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

import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { CardViewProcessNameItemComponent } from './process-name-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CardViewProcessNameItemModel } from './process-name-item.model';
import { ProcessModelerServiceToken, ProcessModelerService, BpmnFactoryToken } from '@alfresco-dbp/modeling-shared/sdk';
import { ProcessModelerServiceImplementation } from '../../process-modeler.service';
import { BpmnFactoryMock } from '../../bpmn-js/bpmn-js.mock';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CardViewProcessNameItemComponent', () => {
    let fixture: ComponentFixture<CardViewProcessNameItemComponent>;
    let component: CardViewProcessNameItemComponent;
    let processModelerService: ProcessModelerService;

    const propertyMock = <CardViewProcessNameItemModel>{
        value: 'my-process-name',
        data: {
            element: {
                businessObject: {
                    $parent: {
                        $parent: {
                            name: 'model-name'
                        },
                        participants: [{ name: 'pool1' }]
                    },
                    eventDefinitions: [{}],
                    name: ''
                },
                type: 'bpmn:Participant',
                id: 'Pool_12345678'

            },
            id: 'Process_12345678'
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: ProcessModelerServiceToken, useClass: ProcessModelerServiceImplementation },
                { provide: BpmnFactoryToken, useClass: BpmnFactoryMock }
            ],
            declarations: [CardViewProcessNameItemComponent],
            imports: [
                MatFormFieldModule,
                MatInputModule,
                TranslateModule.forRoot(),
                ReactiveFormsModule,
                NoopAnimationsModule
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CardViewProcessNameItemComponent);
        component = fixture.componentInstance;
        processModelerService = TestBed.get(ProcessModelerServiceToken);
        spyOn(processModelerService, 'updateElementProperty');
    });

    afterEach(() => {
        fixture.destroy();
        processModelerService.updateElementProperty['calls'].reset();
    });

    it('should update pool name when pool name is not defined with process name', () => {
        component.property = propertyMock;
        fixture.detectChanges();
        expect(processModelerService.updateElementProperty).toHaveBeenCalledTimes(1);
        expect(processModelerService.updateElementProperty).toHaveBeenCalledWith(propertyMock.data.element.id, 'processName', propertyMock.value);
    });

    it('should generate pool name when pool name and process name are not defined', () => {
        propertyMock.value = '';
        propertyMock.data.element.businessObject.name = '';
        component.property = propertyMock;
        fixture.detectChanges();
        expect(processModelerService.updateElementProperty).toHaveBeenCalledTimes(1);
        expect(processModelerService.updateElementProperty).toHaveBeenCalledWith(propertyMock.data.element.id, 'processName', 'model-name-1');
    });

    it('should update pool name when name is changed', fakeAsync(() => {
        propertyMock.data.element.businessObject.name = 'my-pool-name';
        propertyMock.value = 'my-pool-name';
        component.property = propertyMock;
        fixture.detectChanges();

        const processNameInput = fixture.debugElement.query(By.css('input[data-automation-id="process-name"]'));
        processNameInput.nativeElement.value = 'new-process-name';
        processNameInput.nativeElement.dispatchEvent(new Event('input'));

        processNameInput.nativeElement.value = 'new-process-name';
        processNameInput.nativeElement.dispatchEvent(new Event('focusout'));
        fixture.detectChanges();

        tick(1000);
        expect(processModelerService.updateElementProperty).toHaveBeenCalledTimes(1);
        expect(processModelerService.updateElementProperty).toHaveBeenCalledWith(propertyMock.data.element.id, 'processName', 'new-process-name');
    }));

    it('should throw error when process name does not meet criteria', async(() => {
        propertyMock.data.element.businessObject.name = 'my-pool-name';
        propertyMock.value = 'my-pool-name';
        component.property = propertyMock;
        fixture.detectChanges();

        expect(component.processName.valid).toBe(true);
        const processNameInput = fixture.debugElement.query(By.css('input[data-automation-id="process-name"]'));
        processNameInput.nativeElement.value = '11new-process-name';
        processNameInput.nativeElement.dispatchEvent(new Event('input'));
        component.processName.markAsTouched();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(component.processName.valid).toBe(false);
            const errorElement = fixture.debugElement.query(By.css('mat-error[data-automation-id="process-name-error"]'));
            expect(errorElement.nativeElement.innerHTML.trim()).toEqual('PROCESS_EDITOR.ELEMENT_PROPERTIES.INVALID_PROCESS_NAME');
        });
    }));

    it('should not update pool name when pool name is defined', () => {
        propertyMock.data.element.businessObject.name = 'my-pool-name';
        component.property = propertyMock;
        fixture.detectChanges();
        expect(processModelerService.updateElementProperty).toHaveBeenCalledTimes(0);
    });
});
