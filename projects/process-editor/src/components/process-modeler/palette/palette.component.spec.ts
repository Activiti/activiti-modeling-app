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

import { PaletteComponent } from './palette.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslationService, TranslationMock, CoreModule, AppConfigService } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProcessModelerPaletteService } from '../../../services/palette/process-modeler-palette.service';
import { PaletteElementsToken, PaletteOverlayDirective, PaletteGroupElement, BpmnTrigger } from '@alfresco-dbp/modeling-shared/sdk';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

describe('Palette component', () => {
    let fixture: ComponentFixture<PaletteComponent>;
    let component: PaletteComponent;
    let processModelerPaletteService: ProcessModelerPaletteService;
    let appConfig: AppConfigService;

    const testPaletteElements = [
        {   group: 'tool',
            type: 'test',
            icon: 'test',
            title: 'test-title',
            clickable: true,
            draggable: true
        },
        {   group: 'container',
            type: 'container',
            icon: 'container',
            title: '',
            children: [
                {   group: 'tool',
                    type: 'test',
                    icon: 'submenu1',
                    title: '',
                    clickable: true,
                    draggable: true
                },
                {   group: 'tool',
                    type: 'test',
                    icon: 'submenu2',
                    title: '',
                    clickable: true,
                    draggable: true
                },
                {
                    group: 'svg',
                    type: 'svg',
                    icon: 'svg',
                    title: 'svg-title',
                    clickable: true,
                    draggable: true,
                    svg: 'svg'
                }
            ]
        },
        {
            group: 'element',
            type: 'bpmn:ServiceTask',
            icon: 'bpmn-icon-service-task',
            title: 'service-task',
            clickable: true,
            draggable: true
        }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                CoreModule.forChild(),
                NoopAnimationsModule,
                MatMenuModule,
                MatCardModule,
                MatIconModule
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                { provide: ProcessModelerPaletteService, useValue: {delegateEvent: jest.fn()}},
                { provide: PaletteElementsToken, useValue: testPaletteElements}
            ],
            declarations: [PaletteComponent, PaletteOverlayDirective],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(PaletteComponent);
        component = fixture.componentInstance;
        processModelerPaletteService = TestBed.inject(ProcessModelerPaletteService);
        fixture.detectChanges();
    });

    it('test hasChildren method', () => {
        expect(component.hasChildren(component.paletteElements[0] as PaletteGroupElement)).toBeFalsy();
        expect(component.hasChildren(component.paletteElements[1] as PaletteGroupElement)).toBeTruthy();
    });

    it('test onClick method', () => {
        const btn = fixture.debugElement.query(By.css('div.test'));
        const event =  new MouseEvent('click');
        btn.nativeElement.dispatchEvent(event);
        expect(processModelerPaletteService.delegateEvent).toHaveBeenCalledWith(component.paletteElements[0] as BpmnTrigger, event);

    });

    it('test onDrag method', () => {
        const btn = fixture.debugElement.query(By.css('div.test'));

        const event = new CustomEvent('dragstart');
        spyOn(event, 'preventDefault').and.stub();
        btn.nativeElement.dispatchEvent(event);
        expect(processModelerPaletteService.delegateEvent).toHaveBeenCalledWith(component.paletteElements[0] as BpmnTrigger, event);
    });

    it('should not display serviceTask when enableCustomConnectors is false', () => {
        setUpComponentForEnableCustomConnectors(false);
        const serviceTaskElement = getServiceTaskElement();
        expect(serviceTaskElement).toBeNull();
    });

    it('should display serviceTask when enableCustomConnectors is true', () => {
        setUpComponentForEnableCustomConnectors(true);
        const serviceTaskElement = getServiceTaskElement();
        expect(serviceTaskElement).not.toBeNull();
    });

    it('should display serviceTask when enableCustomConnectors is null', () => {
        setUpComponentForEnableCustomConnectors(null);
        const serviceTaskElement = getServiceTaskElement();
        expect(serviceTaskElement).not.toBeNull();
    });

    function setUpComponentForEnableCustomConnectors(enable: boolean): void {
        appConfig = TestBed.inject(AppConfigService);
        appConfig.config.enableCustomConnectors = enable;
        fixture = TestBed.createComponent(PaletteComponent);
        component = fixture.componentInstance;
        processModelerPaletteService = TestBed.inject(ProcessModelerPaletteService);
        fixture.detectChanges();
    }

    function getServiceTaskElement(): Element {
        return fixture.debugElement.nativeElement.querySelector('[data-automation-id="element::bpmn:ServiceTask"]');
    }
});
