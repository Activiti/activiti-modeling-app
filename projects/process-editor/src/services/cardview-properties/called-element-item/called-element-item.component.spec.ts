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
import { CardViewUpdateService, CardViewModule, TranslationService, TranslationMock } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ProcessEditorElementVariablesService, PROCESS_EDITOR_ELEMENT_VARIABLES_PROVIDERS, selectSelectedProcess } from '@alfresco-dbp/modeling-shared/sdk';
import { of, Observable } from 'rxjs';
import { CalledElementComponent } from './called-element-item.component';
import { CalledElementItemModel } from './called-element-item.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { mockProcessModel, mockProcessArray } from './../../../store/process.mock';
import { selectProcessesArray } from './../../../store/process-editor.selectors';
import { CalledElementTypes } from './called-element.service';

describe('CalledElementComponent', () => {
    let fixture: ComponentFixture<CalledElementComponent>;
    let component: CalledElementComponent;
    let cardViewUpdateService: CardViewUpdateService;
    let actions$: Observable<any>;
    let variableService: ProcessEditorElementVariablesService;
    let variableServiceSpy: any;

    const propertyMock = {
        data: {
            element: {
                businessObject: {
                    eventDefinitions: [{}]
                }
            },
            processId: 'Process_12345678'
        },
        value: 'id2'
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                FormBuilder,
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation((selector) => {
                            if (selector === selectProcessesArray) {
                                return of(mockProcessArray);
                            } else if (selector === selectSelectedProcess) {
                                return of(mockProcessModel);
                            }
                            return of([]);
                        }),
                    }
                },
                provideMockActions(() => actions$),
                { provide: PROCESS_EDITOR_ELEMENT_VARIABLES_PROVIDERS, useValue: [] },
                ProcessEditorElementVariablesService,
                {
                    provide: TranslationService,
                    useClass: TranslationMock
                }
            ],
            declarations: [CalledElementComponent],
            imports: [TranslateModule.forRoot(), CardViewModule],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CalledElementComponent);
        component = fixture.componentInstance;
        component.property = <CalledElementItemModel>propertyMock;
        actions$ = null;

        variableService = TestBed.inject(ProcessEditorElementVariablesService);
        variableServiceSpy = spyOn(variableService, 'getAvailableVariablesForElement').and.returnValue(of([]));
        cardViewUpdateService = TestBed.inject(CardViewUpdateService);
        spyOn(cardViewUpdateService, 'update').and.callThrough();
    });

    it('should open dialog when clicking on called element input', async () => {
        const openDialogSpy = spyOn(component, 'openDialog');
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        const inputChip = fixture.nativeElement.querySelector('[data-automation-id="card-arrayitem-chip-Process"]');
        inputChip.click();
        fixture.detectChanges();
        expect(openDialogSpy).toHaveBeenCalled();
    });

    it('should set Process tag when the called element is a static process', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        const inputChip = fixture.nativeElement.querySelector('[data-automation-id="card-arrayitem-chip-Process"]');
        expect(inputChip).toBeDefined();
        expect(inputChip.textContent).toBe('device_hubProcess');
    });

    it('should set Expression tag when the called element is an expression', async () => {
        component.property.value = '${myExpression}';
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        const inputChip = fixture.nativeElement.querySelector('[data-automation-id="card-arrayitem-chip-Expression"]');
        expect(inputChip).toBeDefined();
        expect(inputChip.textContent).toBe('codeExpression');
    });

    it('should init called element when the called element is a static process', () => {
        component.property.value = 'id2';
        fixture.detectChanges();
        expect(component.calledElement).toBe('id2');
        expect(component.calledElementType).toBe(CalledElementTypes.Static);
    });

    it('should init called element when the called element is an expression', () => {
        component.property.value = '${myExpression}';
        fixture.detectChanges();
        expect(component.calledElement).toBe('${myExpression}');
        expect(component.calledElementType).toBe(CalledElementTypes.Expression);
    });

    it('should call loadCalledElementVariables when the called element is a static process', () => {
        const loadCalledElementVariablesSpy = spyOn(component, 'loadCalledElementVariables').and.callThrough();
        component.property.value = 'id2';
        fixture.detectChanges();
        expect(loadCalledElementVariablesSpy).toHaveBeenCalled();
    });

    it('should not call loadCalledElementVariables when the called element is an expression', () => {
        const loadCalledElementVariablesSpy = spyOn(component, 'loadCalledElementVariables');
        component.property.value = '${myExpression}';
        fixture.detectChanges();
        expect(loadCalledElementVariablesSpy).not.toHaveBeenCalled();
    });

    it('should retrieve process variables from the ProcessEditorElementVariablesService', async () => {
        component.ngOnInit();
        await fixture.whenStable();

        expect(variableServiceSpy).toHaveBeenCalledWith(propertyMock.data.element);
    });
});
