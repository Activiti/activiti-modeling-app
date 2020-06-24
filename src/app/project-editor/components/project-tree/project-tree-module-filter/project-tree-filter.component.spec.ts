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
import { MatExpansionModule, MatIconModule, MatProgressSpinnerModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule, PROCESS, MODEL_CREATORS, ModelScope } from '@alfresco-dbp/modeling-shared/sdk';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslationMock, TranslationService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';

describe('ProjectTreeFilterComponent ', () => {
    let fixture: ComponentFixture<ProjectTreeFilterComponent>;
    let component: ProjectTreeFilterComponent;

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
                { provide: TranslationService, useClass: TranslationMock }
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
        const filter = fixture.debugElement.nativeElement.querySelector('.project-tree-filter.process > mat-expansion-panel-header');
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
        const filter = fixture.debugElement.nativeElement.querySelector('.project-tree-filter.process > mat-expansion-panel-header');
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

        expect(localProcess.classes['project-tree-filter-global-item']).toBeFalsy();
        expect(globalProcess.classes['project-tree-filter-global-item']).toBeTruthy();
    });
});
