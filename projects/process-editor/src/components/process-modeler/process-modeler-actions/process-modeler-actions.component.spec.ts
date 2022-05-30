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

import { BpmnFactoryToken, ProcessModelerService, ProcessModelerServiceToken } from '@alfresco-dbp/modeling-shared/sdk';
import { TranslationMock, TranslationService } from '@alfresco/adf-core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessModelerActionsComponent } from './process-modeler-actions.component';
import { ProcessModelerServiceImplementation } from '../../../services/process-modeler.service';
import { BpmnFactoryMock } from '../../../services/bpmn-js/bpmn-js.mock';

describe('ProcessModelerActionsComponent', () => {
    let fixture: ComponentFixture<ProcessModelerActionsComponent>;
    let processModelerService: ProcessModelerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                MatTooltipModule,
                MatIconModule,
                TranslateModule.forRoot(),
                MatCardModule,
                NoopAnimationsModule
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                { provide: ProcessModelerServiceToken, useClass: ProcessModelerServiceImplementation },
                { provide: BpmnFactoryToken, useClass: BpmnFactoryMock }
            ],
            declarations: [ProcessModelerActionsComponent]
        });

        fixture = TestBed.createComponent(ProcessModelerActionsComponent);
        processModelerService = TestBed.inject(ProcessModelerServiceToken);
        fixture.detectChanges();
    });

    it('should test fit view port button', () => {
        spyOn(processModelerService, 'fitViewPort');

        const button = fixture.debugElement.query(By.css(`[data-automation-class='fit-view-port-button']`));
        expect(button).not.toBe(null);

        button.triggerEventHandler('click', null);
        expect(processModelerService.fitViewPort).toHaveBeenCalled();
    });

    it('should test undo button', () => {
        spyOn(processModelerService, 'undo');

        const button = fixture.debugElement.query(By.css(`[data-automation-class='undo-button']`));
        expect(button).not.toBe(null);

        button.triggerEventHandler('click', null);
        expect(processModelerService.undo).toHaveBeenCalled();
    });

    it('should test redo button', () => {
        spyOn(processModelerService, 'redo');

        const button = fixture.debugElement.query(By.css(`[data-automation-class='redo-button']`));
        expect(button).not.toBe(null);

        button.triggerEventHandler('click', null);
        expect(processModelerService.redo).toHaveBeenCalled();
    });

    it('should test zoom in button', () => {
        spyOn(processModelerService, 'zoomIn');

        const button = fixture.debugElement.query(By.css(`[data-automation-class='zoom-in-button']`));
        expect(button).not.toBe(null);

        button.triggerEventHandler('click', null);
        expect(processModelerService.zoomIn).toHaveBeenCalled();
    });

    it('should test zoom out button', () => {
        spyOn(processModelerService, 'zoomOut');

        const button = fixture.debugElement.query(By.css(`[data-automation-class='zoom-out-button']`));
        expect(button).not.toBe(null);

        button.triggerEventHandler('click', null);
        expect(processModelerService.zoomOut).toHaveBeenCalled();
    });
});
