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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ProjectTreeFilterComponent } from './project-tree-filter.component';
import { TranslateModule } from '@ngx-translate/core';
import { DebugElement, NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { SharedModule, PROCESS, MODEL_CREATORS, ModelScope, CONNECTOR } from '@alfresco-dbp/modeling-shared/sdk';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslationMock, TranslationService, AppConfigService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

describe('ProjectTreeFilterComponent ', () => {
    let fixture: ComponentFixture<ProjectTreeFilterComponent>;
    let component: ProjectTreeFilterComponent;
    let appConfig: AppConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                MatExpansionModule,
                MatIconModule,
                MatProgressSpinnerModule,
                MatButtonModule,
                TranslateModule.forRoot(),
                SharedModule,
                NoopAnimationsModule,
                MatMenuModule
            ],
            declarations: [ProjectTreeFilterComponent],
            providers: [
                {
                    provide: Store,
                    useValue: {
                        dispatch: jest.fn()
                    }
                },
                {
                    provide: MODEL_CREATORS, multi: true, useValue: {
                        icon: 'device_hub',
                        name: 'Processes',
                        order: 1,
                        dialog: {}
                    }
                },
                { provide: TranslationService, useClass: TranslationMock },
                AppConfigService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectTreeFilterComponent);
        component = fixture.componentInstance;
        component.loading = false;
    });

    it('when tree filter is extended the correct data should be emitted', () => {
        spyOn(component.opened, 'emit');

        component.expanded = false;

        component.ignoreOpenEmit = false;
        component.projectId = 'projectIdTest';
        component.filter = <any>{
            icon: '',
            name: 'Processes',
            type: PROCESS
        };

        component.contents = [];

        fixture.detectChanges();
        const filter = fixture.debugElement.nativeElement.querySelector('.ama-project-tree-filter.process > mat-expansion-panel-header');
        filter.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        expect(component.opened.emit).toHaveBeenCalledWith({
            projectId: 'projectIdTest',
            type: PROCESS,
            loadData: true
        });
    });

    it('should display add and upload options on click of menu', () => {
        component.filter = <any>{
            icon: '',
            name: 'Processes',
            type: PROCESS
        };
        fixture.detectChanges();
        const filterElement = fixture.debugElement.nativeElement.querySelector(`[data-automation-id="project-filter-process"]`);
        filterElement.dispatchEvent(new Event('mouseenter'));
        const menuButton = fixture.debugElement.nativeElement.querySelector(`[data-automation-id="menu-process"]`);
        menuButton.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        const addButton = fixture.debugElement.query(By.css('.add-new-process'));
        const uploadButton = fixture.debugElement.query(By.css('[data-automation-id="upload-process"]'));
        expect(addButton).not.toBeNull();
        expect(uploadButton).not.toBeNull();
    });

    it('when tree filter is closed the correct data should be emitted', () => {
        spyOn(component.closed, 'emit');

        component.expanded = true;

        component.projectId = 'projectIdTest';
        component.filter = <any>{
            icon: '',
            name: 'Processes',
            type: PROCESS
        };

        component.contents = [];

        fixture.detectChanges();
        const filter = fixture.debugElement.nativeElement.querySelector('.ama-project-tree-filter.process > mat-expansion-panel-header');
        filter.dispatchEvent(new Event('click'));
        fixture.detectChanges();

        expect(component.closed.emit).toHaveBeenCalledWith({ type: PROCESS });
    });

    it('when the model is GLOBAL the global class is included', () => {
        component.expanded = true;
        component.projectId = 'projectIdTest';
        component.filter = <any>{
            icon: '',
            name: 'Processes',
            type: PROCESS
        };

        const contents = [
            {
                'id': 'local-process-id',
                'type': 'PROCESS',
                'name': 'local-process',
                'scope': 'Project',
            },
            {
                'id': 'global-process-id',
                'type': 'PROCESS',
                'name': 'global-process',
                'scope': ModelScope.GLOBAL,
            }
        ];

        const changes: SimpleChanges = {
            contents: {
                currentValue: contents,
                firstChange: false,
                isFirstChange: () => false,
                previousValue: undefined
            }
        };

        component.ngOnChanges(changes);
        fixture.detectChanges();

        const localProcess = fixture.debugElement.query(By.css('[data-automation-id="process-local-process-id"]'));
        const globalProcess = fixture.debugElement.query(By.css('[data-automation-id="process-global-process-id"]'));

        expect(localProcess.classes['ama-project-tree-filter-global-item']).toBeFalsy();
        expect(globalProcess.classes['ama-project-tree-filter-global-item']).toBeTruthy();
    });

    it('should filter categories and their processes', () => {
        component.expanded = true;
        component.projectId = 'projectIdTest';
        component.filter = <any>{
            icon: '',
            name: 'Processes',
            type: PROCESS
        };

        const contents = [{ 'id': 'process1', 'name': 'local-process', 'category': 'cat1' },
            { 'id': 'process2', 'name': 'global-process', 'category': 'cat2' },
            { 'id': 'process3', 'name': 'global-process-2', 'category': 'cat1' }];

        const changes: SimpleChanges = {
            contents: {
                currentValue: contents,
                firstChange: false,
                isFirstChange: () => false,
                previousValue: undefined
            }
        };

        component.ngOnChanges(changes);
        fixture.detectChanges();

        const processesByCategory = fixture.debugElement.queryAll(
            By.css('[data-automation-id="ama-project-tree-filter-item-category"]')
        );

        expect(processesByCategory.length).toBe(2);
        expect(processesByCategory[0].children[0].nativeElement.textContent.trim()).toBe('cat1');
        expect(processesByCategory[1].children[0].nativeElement.textContent.trim()).toBe('cat2');

        const processesByName = fixture.debugElement.queryAll(
            By.css('.ama-project-tree-filter__name')
        );

        expect(processesByName.length).toBe(3);

        const categoryOneProcessesElements = processesByCategory[0].queryAll(By.css('[data-automation-id="ama-project-tree-filter-contents-list"]'));
        expect(categoryOneProcessesElements.length).toBe(2);
        const categoryTwoProcessesElements = processesByCategory[1].queryAll(By.css('[data-automation-id="ama-project-tree-filter-contents-list"]'));
        expect(categoryTwoProcessesElements.length).toBe(1);
    });

    it('should not display default category', () => {
        component.expanded = true;
        component.projectId = 'projectIdTest';
        component.filter = <any>{
            icon: '',
            name: 'Processes',
            type: PROCESS
        };

        const changes: SimpleChanges = {
            contents: {
                currentValue: undefined,
                firstChange: false,
                isFirstChange: () => false,
                previousValue: undefined
            }
        };

        component.ngOnChanges(changes);

        fixture.detectChanges();

        const contentsByCategory = fixture.debugElement.queryAll(
            By.css('.ama-project-tree-filter__category')
        );

        expect(contentsByCategory.length).toBe(0);
    });

    it('should display items under default category when there is not any category in the project', async () => {
        component.expanded = true;
        component.projectId = 'projectIdTest';
        component.filter = <any>{
            icon: '',
            name: 'Processes',
            type: PROCESS
        };

        const contents = [
            {'name': 'Default_a', 'category': 'http://bpmn.io/schema/bpmn' },
            { 'name': 'Default_b', 'category': ''}
        ];

        const changes: SimpleChanges = {
            contents: {
                currentValue: contents,
                firstChange: false,
                isFirstChange: () => false,
                previousValue: undefined
            }
        };

        component.ngOnChanges(changes);
        fixture.detectChanges();
        await fixture.whenStable();

        const contentByCategory = fixture.debugElement.queryAll(
            By.css('[data-automation-id="ama-project-tree-filter-item-category"]')
        );

        expect(contentByCategory.length).toBe(1);
        expect(contentByCategory[0].children[0].nativeElement.textContent.trim()).toBe('');
    });

    it('should display items under no category label when there is at least one process without category', async () => {
        component.expanded = true;
        component.projectId = 'projectIdTest';
        component.filter = <any>{
            icon: '',
            name: 'Processes',
            type: PROCESS
        };

        const content = [{ 'name': 'Default_a', 'category': 'http://bpmn.io/schema/bpmn' },
            { 'name': 'Default_b', 'category': 'newCategory' }];

        const change: SimpleChanges = {
            contents: {
                currentValue: content,
                firstChange: false,
                isFirstChange: () => false,
                previousValue: undefined
            }
        };

        component.ngOnChanges(change);
        fixture.detectChanges();

        const contentsByCategory = fixture.debugElement.queryAll(
            By.css('[data-automation-id="ama-project-tree-filter-item-category"]')
        );

        expect(contentsByCategory.length).toBe(2);
        expect(contentsByCategory[0].children[0].nativeElement.textContent.trim()).toBe('newCategory');
    });

    it('should not display connector add and upload options when enableCustomConnectors is false', () => {
        setUpComponentForEnableCustomConnectors(false);
        const connectorUploadInput = getUploadConnectorInput();
        expect(connectorUploadInput).toBeNull();
    });

    it('should display connector add and upload options when enableCustomConnectors is true', () => {
        setUpComponentForEnableCustomConnectors(true);
        const connectorUploadInput = getUploadConnectorInput();
        expect(connectorUploadInput).not.toBeNull();
    });

    it('should display connector add and upload options when enableCustomConnectors is null', () => {
        setUpComponentForEnableCustomConnectors(null);
        const connectorUploadInput = getUploadConnectorInput();
        expect(connectorUploadInput).not.toBeNull();
    });

    function getUploadConnectorInput(): DebugElement {
        const filterElement = fixture.debugElement.nativeElement.querySelector(`[data-automation-id="project-filter-connector"]`);
        filterElement.dispatchEvent(new Event('mouseenter'));
        fixture.detectChanges();
        const menuButton = fixture.debugElement.nativeElement.querySelector(`[data-automation-id="menu-connector"]`);
        menuButton.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        return fixture.debugElement.query(By.css('[data-automation-id="upload-connector"]'));
    }

    function setUpComponentForEnableCustomConnectors(enable: boolean): void {
        appConfig = TestBed.inject(AppConfigService);
        appConfig.config.enableCustomConnectors = enable;

        fixture = TestBed.createComponent(ProjectTreeFilterComponent);
        component = fixture.componentInstance;
        component.loading = false;
        component.expanded = false;

        component.ignoreOpenEmit = false;
        component.projectId = 'projectIdTest';
        component.filter = <any>{
            icon: '',
            name: 'Connector',
            type: CONNECTOR
        };

        component.contents = [];
        fixture.detectChanges();
        const connectorHeader = fixture.debugElement.nativeElement.querySelector('.ama-project-tree-filter.connector > mat-expansion-panel-header');
        connectorHeader.dispatchEvent(new Event('click'));
    }
});
