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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { PROCESS_EDITOR_STATE_NAME, selectSelectedProcess, BpmnFactoryToken, ProcessModelerService, ProcessModelerServiceToken } from '@alfresco-dbp/modeling-shared/sdk';
import { ProcessModelerServiceImplementation } from '../../services/process-modeler.service';
import { BpmnFactoryMock, getDiagramElementMock } from '../../services/bpmn-js/bpmn-js.mock';
import { of } from 'rxjs';
import { mockProcessModel } from '../../store/process.mock';
import { processEntitiesReducer } from '../../store/process-entities.reducer';
import { Component } from '@angular/core';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { createSelectedElement } from '../../store/process-editor.state';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TaskAssignmentService } from '../../services/cardview-properties/task-assignment-item/task-assignment.service';

@Component({
    selector: 'ama-process-palette',
    template: ''
})
class MockPaletteComponent {
}

describe('ProcessModelerComponent', () => {
    let fixture: ComponentFixture<ProcessModelerComponent>;
    let component: ProcessModelerComponent;
    let processModelerService: ProcessModelerService;

    beforeEach(() => {
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
                TaskAssignmentService,
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
        });

        fixture = TestBed.createComponent(ProcessModelerComponent);
        component = fixture.componentInstance;
        processModelerService = TestBed.inject(ProcessModelerServiceToken);
        fixture.detectChanges();
    });

    it('should init BPMN service', () => {
        spyOn(processModelerService, 'init');
        component.ngOnInit();

        expect(processModelerService.init).toHaveBeenCalled();
    });

    it('should load diagram after init', () => {
        spyOn(processModelerService, 'render');
        spyOn(processModelerService, 'loadXml').and.returnValue(of('diagram'));

        component.ngOnInit();
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
            processId: 'mock-parent-id',
            category: 'mock-parent-category'
        });
    });
});
