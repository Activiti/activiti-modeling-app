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

import { ProcessModelerComponent } from './process-modeler.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { MatTooltipModule, MatIconModule, MatCardModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { AmaState, PROCESS_EDITOR_STATE_NAME, selectSelectedProcess, BpmnFactoryToken, ProcessModelerService, ProcessModelerServiceToken } from '@alfresco-dbp/modeling-shared/sdk';
import { ProcessModelerServiceImplementation } from '../../services/process-modeler.service';
import { BpmnFactoryMock, getDiagramElementMock } from '../../services/bpmn-js/bpmn-js.mock';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { mockProcessModel } from '../../store/process.mock';
import { processEntitiesReducer } from '../../store/process-entities.reducer';
import { Component } from '@angular/core';
import { ProcessDiagramLoaderService } from '../../services/process-diagram-loader.service';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { createSelectedElement } from '../../store/process-editor.state';

@Component({
    selector: 'ama-process-palette',
    template: ''
  })
  class MockPaletteComponent {
  }

describe('ProcessModelerComponent', () => {
    let fixture: ComponentFixture<ProcessModelerComponent>;
    let component: ProcessModelerComponent;
    let store: Store<AmaState>;
    let processModelerService: ProcessModelerService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatTooltipModule,
                MatIconModule,
                StoreModule.forRoot({
                    [PROCESS_EDITOR_STATE_NAME]: processEntitiesReducer
                }),
                TranslateModule.forRoot(),
                MatCardModule,
                NoopAnimationsModule
            ],
            providers: [
                ProcessDiagramLoaderService,
                { provide: TranslationService, useClass: TranslationMock },
                { provide: ProcessModelerServiceToken, useClass: ProcessModelerServiceImplementation },
                { provide: BpmnFactoryToken, useClass: BpmnFactoryMock },
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation((selector) => {
                            if (selector === selectSelectedProcess) {
                                return of(mockProcessModel);
                            }

                            return of({});
                        }),
                        dispatch: jest.fn()
                    }
                }
            ],
            declarations: [ProcessModelerComponent, MockPaletteComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessModelerComponent);
        component = fixture.componentInstance;
        store = TestBed.get(Store);
        processModelerService = TestBed.get(ProcessModelerServiceToken);
        fixture.detectChanges();
    });

    it('should render canvas element', () => {
        expect(component.canvas.nativeElement).not.toBeNull();
    });

    it('should init BPMN service', () => {
        spyOn(processModelerService, 'init');
        component.ngOnInit();

        expect(processModelerService.init).toHaveBeenCalled();
    });

    it('should test fit view port button', () => {
        spyOn(processModelerService, 'fitViewPort');

        const button = fixture.debugElement.query(By.css('[data-automation-class="fit-view-port-button"]'));
        expect(button).not.toBe(null);

        button.triggerEventHandler('click', null);
        expect(processModelerService.fitViewPort).toHaveBeenCalled();
    });

    it('should test undo button', () => {
        spyOn(processModelerService, 'undo');

        const button = fixture.debugElement.query(By.css('[data-automation-class="undo-button"]'));
        expect(button).not.toBe(null);

        button.triggerEventHandler('click', null);
        expect(processModelerService.undo).toHaveBeenCalled();
    });

    it('should test redo button', () => {
        spyOn(processModelerService, 'redo');

        const button = fixture.debugElement.query(By.css('[data-automation-class="redo-button"]'));
        expect(button).not.toBe(null);

        button.triggerEventHandler('click', null);
        expect(processModelerService.redo).toHaveBeenCalled();
    });

    it('should test zoom in button', () => {
        spyOn(processModelerService, 'zoomIn');

        const button = fixture.debugElement.query(By.css('[data-automation-class="zoom-in-button"]'));
        expect(button).not.toBe(null);

        button.triggerEventHandler('click', null);
        expect(processModelerService.zoomIn).toHaveBeenCalled();
    });

    it('should test zoom out button', () => {
        spyOn(processModelerService, 'zoomOut');

        const button = fixture.debugElement.query(By.css('[data-automation-class="zoom-out-button"]'));
        expect(button).not.toBe(null);

        button.triggerEventHandler('click', null);
        expect(processModelerService.zoomOut).toHaveBeenCalled();
    });

    it('should load diagram after view init', () => {
        spyOn(processModelerService, 'render');
        spyOn(processModelerService, 'loadXml').and.returnValue(of('diagram'));

        component.ngAfterViewInit();
        fixture.detectChanges();

        component.source = 'diagram';

        expect(processModelerService.render).toHaveBeenCalled();
        expect(processModelerService.loadXml).toHaveBeenCalled();
    });

    it('should test createSelectedElement function', () => {
        const selectedElement = createSelectedElement(getDiagramElementMock({ name: 'mock-element-name' }));

        expect(selectedElement).toEqual({
            id: 'mock-element-id',
            type: 'mock-element-type',
            name: 'mock-element-name',
            processId: 'mock-parent-id'
        });
    });

});
