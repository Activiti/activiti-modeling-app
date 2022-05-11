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
import { AppConfigService, AppConfigServiceMock, CardViewBaseItemModel, CardViewUpdateService, setupTestBed } from '@alfresco/adf-core';
import { ProcessModelerServiceImplementation } from '../../process-modeler.service';
import { BpmnFactoryMock } from '../../bpmn-js/bpmn-js.mock';
import { BpmnFactoryToken, ProcessModelerService, ProcessModelerServiceToken } from '@alfresco-dbp/modeling-shared/sdk';
import { appConfigMock, loopCharacteristicsMock, propertyMock } from './multi-instance.mock';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { MultiInstanceProps, MultiInstanceType } from '../../bpmn-js/property-handlers/multi-instance.handler';
import { CardViewMultiInstanceItemService } from './multi-instance-item.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

describe('CardViewMultiInstanceItemComponent', () => {
    let component: CardViewMultiInstanceItemComponent;
    let fixture: ComponentFixture<CardViewMultiInstanceItemComponent>;
    let processModelerService: ProcessModelerService;
    let cardViewUpdateService: CardViewUpdateService;
    let appConfig: AppConfigService;
    let service: CardViewMultiInstanceItemService;

    setupTestBed({
        declarations: [CardViewMultiInstanceItemComponent],
        providers: [
            {provide: AppConfigService, useClass: AppConfigServiceMock},
            {provide: ProcessModelerServiceToken, useClass: ProcessModelerServiceImplementation},
            {provide: BpmnFactoryToken, useClass: BpmnFactoryMock},
            CardViewMultiInstanceItemService
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
        processModelerService = TestBed.inject(ProcessModelerServiceToken);
        cardViewUpdateService = TestBed.inject(CardViewUpdateService);
        service = fixture.debugElement.injector.get(CardViewMultiInstanceItemService);
        appConfig = TestBed.inject(AppConfigService);
        appConfig.config = Object.assign(appConfig.config, appConfigMock);

        spyOn(processModelerService, 'getFromModeler').and.returnValue({
            create: () => loopCharacteristicsMock
        });

        spyOn(processModelerService, 'updateElementProperty');

        component.property = propertyMock;
        fixture.detectChanges();
    });

    it('should create and set default values', () => {
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

    it('should show error when wrong completionCondition found', () => {
        fixture.detectChanges();
        const completionConditionElement = fixture.debugElement.query(By.css('[data-automation-id="completionCondition-field"]'));
        completionConditionElement.nativeElement.value = 'a';
        completionConditionElement.nativeElement.dispatchEvent(new Event('input'));
        expect(component.completionCondition.hasError('pattern')).toBeTruthy();

        completionConditionElement.nativeElement.value = '5';
        completionConditionElement.nativeElement.dispatchEvent(new Event('input'));
        expect(component.completionCondition.hasError('pattern')).toBeTruthy();

        completionConditionElement.nativeElement.value = '${}';
        completionConditionElement.nativeElement.dispatchEvent(new Event('input'));
        expect(component.completionCondition.hasError('pattern')).toBeTruthy();

        completionConditionElement.nativeElement.value = '${expression}';
        completionConditionElement.nativeElement.dispatchEvent(new Event('input'));
        expect(component.completionCondition.hasError('pattern')).toBeFalsy();
    });

    describe('Collection Element', () => {
        it('should show error when wrong collection expression found', () => {
            fixture.detectChanges();
            const collectionElement = fixture.debugElement.query(By.css('[data-automation-id="collection-field"]'));
            collectionElement.nativeElement.value = 'a';
            collectionElement.nativeElement.dispatchEvent(new Event('input'));
            expect(component.collectionExpression.hasError('pattern')).toBeTruthy();

            collectionElement.nativeElement.value = '${expression}';
            collectionElement.nativeElement.dispatchEvent(new Event('input'));
            expect(component.collectionExpression.hasError('pattern')).toBeFalsy();
        });

        it('should update the xml when expression changes', () => {
            fixture.detectChanges();
            spyOn(service, 'updateEditor').and.callThrough();
            spyOn(service, 'createOrUpdateCollectionExpression').and.callThrough();
            const collectionElement = fixture.debugElement.query(By.css('[data-automation-id="collection-field"]'));
            collectionElement.nativeElement.value = '${expression}';
            collectionElement.nativeElement.dispatchEvent(new Event('change'));
            expect(service.createOrUpdateCollectionExpression).toHaveBeenCalledTimes(1);
            expect(service.updateEditor).toHaveBeenCalledTimes(1);
        });
    });

    describe('ElementVariable', () => {
        it('should show error when wrong ElementVariable found', () => {
            fixture.detectChanges();
            const elementVarField = fixture.debugElement.query(By.css('[data-automation-id="element-variable-field"]'));
            elementVarField.nativeElement.value = '5';
            elementVarField.nativeElement.dispatchEvent(new Event('input'));
            expect(component.elementVariable.hasError('message')).toBeTruthy();

            elementVarField.nativeElement.value = 'assignee';
            elementVarField.nativeElement.dispatchEvent(new Event('input'));
            expect(component.elementVariable.hasError('message')).toBeFalsy();
        });

        it('should update the xml when ElementVariable changes', () => {
            fixture.detectChanges();
            spyOn(service, 'updateEditor').and.callThrough();
            spyOn(service, 'createOrUpdateElementVariable').and.callThrough();
            const elementVarField = fixture.debugElement.query(By.css('[data-automation-id="element-variable-field"]'));
            elementVarField.nativeElement.value = 'assignee';
            elementVarField.nativeElement.dispatchEvent(new Event('change'));
            expect(service.createOrUpdateElementVariable).toHaveBeenCalledTimes(1);
            expect(service.updateEditor).toHaveBeenCalledTimes(1);
        });
    });

    describe('multiInstance type', () => {

        it('should update LoopDataOutputRef property when mapping is updated', async () => {
            const validMapping =  { test: { type: '', value: '' } } ;
            spyOn(component, 'onLoopDataOutputRefChange');
            component.onTypeChange(MultiInstanceType.sequence);
            cardViewUpdateService.update(<CardViewBaseItemModel> { key: 'loopDataOutputRef', data: {}}, validMapping);
            fixture.detectChanges();
            await fixture.whenStable();
            expect(component.onLoopDataOutputRefChange).toHaveBeenCalledWith('test');
            expect(processModelerService.updateElementProperty).toHaveBeenCalled();
        });

        it('should update LoopDataOutputRef property only when update element key is loopDataOutputRef', async () => {
            const validMapping =  { test: { type: '', value: '' } } ;
            spyOn(component, 'onLoopDataOutputRefChange');
            component.onTypeChange(MultiInstanceType.sequence);
            cardViewUpdateService.update(<CardViewBaseItemModel> { key: 'fake-test', data: {}}, validMapping);
            fixture.detectChanges();
            await fixture.whenStable();
            expect(component.onLoopDataOutputRefChange).not.toHaveBeenCalled();
        });

        it('should remove cardinality when none type selected', () => {
            let cardinalityElement = fixture.debugElement.query(By.css('[data-automation-id="cardinality-field"]'));
            let completionConditionElement = fixture.debugElement.query(By.css('[data-automation-id="completionCondition-field"]'));
            expect(cardinalityElement).toBeTruthy();
            expect(completionConditionElement).toBeTruthy();

            component.selectedType = MultiInstanceType.none;
            fixture.detectChanges();

            cardinalityElement = fixture.debugElement.query(By.css('[data-automation-id="cardinality-field"]'));
            completionConditionElement = fixture.debugElement.query(By.css('[data-automation-id="completionCondition-field"]'));
            expect(cardinalityElement).toBeFalsy();
            expect(completionConditionElement).toBeFalsy();
        });

        it('should update xml  when multi instance type changes', () => {
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

});
