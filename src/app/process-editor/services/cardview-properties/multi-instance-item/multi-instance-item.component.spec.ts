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
import { CardViewMultiInstanceItemComponent } from './multi-instance-item.component';
import { AppConfigService, AppConfigServiceMock, setupTestBed } from '@alfresco/adf-core';
import { ProcessModelerServiceImplementation } from '../../process-modeler.service';
import { BpmnFactoryMock } from '../../bpmn-js/bpmn-js.mock';
import { BpmnFactoryToken, ProcessModelerService, ProcessModelerServiceToken } from 'ama-sdk';
import { appConfigMock, cardinalityMock, propertyMock } from './multi-instance.mock';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { MultiInstanceProps, MultiInstanceType } from '../../bpmn-js/property-handlers/multi-instance.handler';

describe('CardViewMultiInstanceItemComponent', () => {
    let component: CardViewMultiInstanceItemComponent;
    let fixture: ComponentFixture<CardViewMultiInstanceItemComponent>;
    let processModelerService: ProcessModelerService;
    let appConfig: AppConfigService;

    setupTestBed({
        declarations: [CardViewMultiInstanceItemComponent],
        providers: [
            {provide: AppConfigService, useClass: AppConfigServiceMock},
            {provide: ProcessModelerServiceToken, useClass: ProcessModelerServiceImplementation},
            {provide: BpmnFactoryToken, useClass: BpmnFactoryMock}
        ],
        imports: [
            MatFormFieldModule,
            MatSelectModule,
            MatInputModule,
            TranslateModule.forRoot(),
            HttpClientTestingModule,
            ReactiveFormsModule,
            CommonModule,
            FormsModule,
            NoopAnimationsModule
        ],
        schemas: [NO_ERRORS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CardViewMultiInstanceItemComponent);
        component = fixture.componentInstance;
        processModelerService = TestBed.get(ProcessModelerServiceToken);
        appConfig = TestBed.get(AppConfigService);
        appConfig.config = Object.assign(appConfig.config, appConfigMock);

        spyOn(processModelerService, 'getFromModeler').and.returnValue({
            create: () => {
                return cardinalityMock;
            }
        });

        spyOn(processModelerService, 'updateElementProperty');

        component.property = propertyMock;
        fixture.detectChanges();
    });

    it('should create and set default values', () => {
        expect(component).toBeTruthy();
        expect(component.selectedType).toEqual('parallel');
        expect(component.cardinality.value).toEqual('${expression}');
    });

    it('should set the selected values from the XML file', (done) => {
        fixture.detectChanges();
        component.options$.subscribe((options) => {
            expect(options.length).toEqual(3);
            const multiInstanceElement = fixture.debugElement.query(By.css('[data-automation-id="multi-instance-field"]'));
            expect(multiInstanceElement.nativeElement.textContent).toEqual('Parallel');
            const cardinalityElement = fixture.debugElement.query(By.css('[data-automation-id="cardinality-field"]'));
            expect(cardinalityElement.nativeElement.value).toEqual('${expression}');
            done();
        });
    });

    it('should show error when wrong cardinality found', () => {
        fixture.detectChanges();
        const cardinalityElement = fixture.debugElement.query(By.css('[data-automation-id="cardinality-field"]'));
        cardinalityElement.nativeElement.value = 'a';
        cardinalityElement.nativeElement.dispatchEvent(new Event('input'));
        expect(component.cardinality.hasError('message')).toBeTruthy();

        cardinalityElement.nativeElement.value = '${}';
        cardinalityElement.nativeElement.dispatchEvent(new Event('input'));
        expect(component.cardinality.hasError('message')).toBeTruthy();

        cardinalityElement.nativeElement.value = '5';
        cardinalityElement.nativeElement.dispatchEvent(new Event('input'));
        expect(component.cardinality.hasError('message')).toBeFalsy();

        cardinalityElement.nativeElement.value = '${expression}';
        cardinalityElement.nativeElement.dispatchEvent(new Event('input'));
        expect(component.cardinality.hasError('message')).toBeFalsy();
    });

    it('should remove cardinality when none type selected', () => {
        component.selectedType = MultiInstanceType.none;
        fixture.detectChanges();
        const cardinalityElement = fixture.debugElement.query(By.css('[data-automation-id="cardinality-field"]'));
        expect(cardinalityElement).toBeFalsy();
    });

    it('should change update xml  when multi instance type changes', () => {
        component.onTypeChange(MultiInstanceType.sequence);
        expect(processModelerService.updateElementProperty).toHaveBeenCalledTimes(1);
    });

    it('should delete multiInstance when none type selected', () => {
        expect(component.element[MultiInstanceProps.loopCharacteristics]).toBeTruthy();
        component.onTypeChange(MultiInstanceType.none);
        expect(component.element).toEqual({'$type': 'bpmn:SubProcess', 'id': 'SubProcess_17k'});
        expect(component.cardinality.value).toBeFalsy();
        expect(processModelerService.updateElementProperty).toHaveBeenCalledTimes(1);
    });
});
