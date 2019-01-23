 /*!
 * @license
 * Copyright 2018 Alfresco, Inc. and/or its affiliates.
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
import { SharedModule, PROCESS } from 'ama-sdk';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslationMock, TranslationService } from '@alfresco/adf-core';

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
                { provide: TranslationService, useClass: TranslationMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectTreeFilterComponent);
        component = fixture.componentInstance;
    });


    it ('should create', () => {
        expect(component).toBeTruthy();
    });

    it ('when tree filter is extended the correct data should be emitted', () => {
        spyOn(component.opened, 'emit');

        component.expanded = false;
        component.ignoreOpenEmit = false;
        component.projectId = 'appIdTest';
        component.filter = <any>{
            icon: '',
            name: 'Processes',
            type: PROCESS
        };

        component.contents = [];

        const filter = fixture.nativeElement.querySelector('.project-tree-filter');
        filter.dispatchEvent(new Event('opened'));
        fixture.detectChanges();

        expect(component.opened.emit).toHaveBeenCalledWith({
            projectId: 'appIdTest',
            type: PROCESS,
            loadData: true
        });
    });

    it ('when tree filter is closed the correct data should be emitted', () => {
        spyOn(component.closed, 'emit');

        component.expanded = false;

        component.projectId = 'appIdTest';
        component.filter = <any>{
            icon: '',
            name: 'Processes',
            type: PROCESS
        };

        component.contents = [];

        const filter = fixture.nativeElement.querySelector('.project-tree-filter');
        filter.dispatchEvent(new Event('closed'));
        fixture.detectChanges();

        expect(component.closed.emit).toHaveBeenCalledWith({ type: PROCESS });
    });
});
