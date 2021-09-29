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

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { ProjectTreeFilterComponent } from './project-tree-filter.component';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule, PROCESS, MODEL_CREATORS, ModelScope, CONNECTOR } from '@alfresco-dbp/modeling-shared/sdk';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslationMock, TranslationService, AppConfigService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Element } from '@angular/compiler';

describe('ProjectTreeFilterComponent ', () => {
    let fixture: ComponentFixture<ProjectTreeFilterComponent>;
    let component: ProjectTreeFilterComponent;
    let appConfig: AppConfigService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatExpansionModule,
                MatIconModule,
                MatProgressSpinnerModule,
                TranslateModule.forRoot(),
                SharedModule,
                NoopAnimationsModule
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
        }).compileComponents();
    }));

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

        component.contents = [
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

        fixture.detectChanges();

        const localProcess = fixture.debugElement.query(By.css('[data-automation-id="process-local-process-id"]'));
        const globalProcess = fixture.debugElement.query(By.css('[data-automation-id="process-global-process-id"]'));

        expect(localProcess.classes['ama-project-tree-filter-global-item']).toBeFalsy();
        expect(globalProcess.classes['ama-project-tree-filter-global-item']).toBeTruthy();
    });

    it('should not display connector add and upload options when enableCustomConnectors is false', () => {
        setUpComponentForEnableCustomConnectors(false);
        const connectorCreateButton = getAddConnectorButton();
        const connectorUploadInput = getUploadConnectorInput();
        expect(connectorCreateButton).toBeNull();
        expect(connectorUploadInput).toBeNull();
    });

    it('should display connector add and upload options when enableCustomConnectors is true', () => {
        setUpComponentForEnableCustomConnectors(true);
        const connectorCreateButton = getAddConnectorButton();
        const connectorUploadInput = getUploadConnectorInput();
        expect(connectorCreateButton).not.toBeNull();
        expect(connectorUploadInput).not.toBeNull();
    });

    it('should display connector add and upload options when enableCustomConnectors is null', () => {
        setUpComponentForEnableCustomConnectors(null);
        const connectorCreateButton = getAddConnectorButton();
        const connectorUploadInput = getUploadConnectorInput();
        expect(connectorCreateButton).not.toBeNull();
        expect(connectorUploadInput).not.toBeNull();
    });

    function getAddConnectorButton(): Element {
        return fixture.debugElement.nativeElement.querySelector('.add-new-connector');
    }

    function getUploadConnectorInput(): Element {
        return fixture.debugElement.nativeElement.querySelector('[data-automation-id="upload-connector"]');
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
