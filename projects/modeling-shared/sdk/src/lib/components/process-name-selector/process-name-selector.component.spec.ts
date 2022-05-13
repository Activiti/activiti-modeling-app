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
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ProcessNameSelectorComponent } from './process-name-selector.component';
import { ProcessService } from '../../services/process.service';
import { AmaApi } from '../../api/api.interface';
import { By } from '@angular/platform-browser';

describe('ProcessNameSelectorComponent', () => {
    let component: ProcessNameSelectorComponent;
    let fixture: ComponentFixture<ProcessNameSelectorComponent>;
    let processService: ProcessService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                TranslateModule.forRoot(),
                MatSelectModule
            ],
            declarations: [ProcessNameSelectorComponent],
            providers: [
                AmaApi,
                {
                    provide: Store, useValue: {
                        select: jest.fn().mockImplementation(() => of('testProjectId')),
                        dispatch: jest.fn()
                    }
                },
                { provide: TranslationService, useClass: TranslationMock },
                {
                    provide: ProcessService, useValue: {
                        getProcesses: jest.fn().mockImplementation(() => of({
                            testProcess: [{
                                processName: 'testProcessName',
                                processDefinitionId: 'testProcessDefinitionId',
                                processProperties: []
                            }],
                            testProcess1: [{
                                processName: 'testProcessName1',
                                processDefinitionId: 'testProcessDefinitionId1',
                                processProperties: []
                            }]
                        })),
                        dispatch: jest.fn()
                    }
                }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessNameSelectorComponent);
        component = fixture.componentInstance;
        component.value = 'testProcessDefinitionId';
        component.required = true;
        processService = TestBed.inject(ProcessService);
        fixture.detectChanges();
    });

    it('should retrieve process definitions on init', () => {
        spyOn(processService, 'getProcesses').and.returnValue(of({}));
        component.ngOnInit();
        expect(processService.getProcesses).toHaveBeenCalledWith('testProjectId');
    });

    it('should emit the process definition key when select changes', () => {
        spyOn(component.change, 'emit');
        spyOn(processService, 'getProcesses').and.returnValue(of({}));
        component.value = 'abcd';
        fixture.detectChanges();
        component.onChange();
        expect(component.change.emit).toHaveBeenCalledWith('abcd');
    });

    it('should filter excluded processes', (done) => {
        component.extendedProperties = { plain: false, excludedProcesses: ['testProcess']};
        component.processes.subscribe((processes) => {
            expect(processes['testProcess']).not.toBeDefined();
            expect(processes['testProcess1']).toBeDefined();
            done();
        });
        component.ngOnInit();
    });

    describe('empty option', () => {

        it('should display the empty option when input is not required', () => {
            component.required = false;
            const processSelect = fixture.debugElement.query(By.css('[data-automation-id="process-name-selector"]'));
            processSelect.nativeElement.click();
            fixture.detectChanges();
            const processSelectOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            const expectedFormSelectOptions = [undefined, 'testProcessName', 'testProcessName1'];
            expect(processSelectOptions.length).toBe(expectedFormSelectOptions.length);
            expectedFormSelectOptions.forEach((value, index) => {
                if (processSelectOptions[index].nativeElement.textContent) {
                    expect(processSelectOptions[index].nativeElement.textContent.trim()).toBe(value);
                } else {
                    expect(processSelectOptions[index].nativeElement.textContent).toBe('');
                }
            });
        });

        it('should not display the empty option when input is required', () => {
            component.required = true;
            const processSelect = fixture.debugElement.query(By.css('[data-automation-id="process-name-selector"]'));
            processSelect.nativeElement.click();
            fixture.detectChanges();
            const processSelectOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            const expectedFormSelectOptions = ['testProcessName', 'testProcessName1'];
            expect(processSelectOptions.length).toBe(expectedFormSelectOptions.length);
            expectedFormSelectOptions.forEach((value, index) => {
                expect(processSelectOptions[index].nativeElement.textContent.trim()).toBe(value);
            });
        });
    });
});
