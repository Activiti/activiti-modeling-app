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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ProjectTreeComponent } from './project-tree.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProjectTreeHelper } from './project-tree.helper';
import { of } from 'rxjs';
import { PROCESS, FORM, selectSelectedProjectId } from '@alfresco-dbp/modeling-shared/sdk';
import { selectMenuOpened } from '../../../store/selectors/app.selectors';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProjectTreeFilterComponent ', () => {
    let fixture: ComponentFixture<ProjectTreeComponent>;
    let component: ProjectTreeComponent;
    let helper: ProjectTreeHelper;
    const mockFilters = [
        { type: PROCESS, name: 'PROJECT_EDITOR.TREE.PROCESSES', icon: 'device_hub' },
        { type: FORM, name: 'PROJECT_EDITOR.TREE.FORMS', icon: 'subject' },
    ];

    const projectId = 'projectId';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule],
            declarations: [ProjectTreeComponent],
            providers: [
                ProjectTreeHelper,
                {
                    provide: Store, useValue: {
                        select: jest.fn().mockImplementation((selector) => {
                            if (selector === selectMenuOpened) {
                                return of(true);
                            } else if (selector === selectSelectedProjectId) {
                                return of(projectId);
                            }
                            return of({});
                        }),
                        dispatch: jest.fn()
                    }
                },
                {
                    provide: ProjectTreeHelper, useValue:
                        {
                            getFilters: jest.fn().mockReturnValue(mockFilters),
                            getDataAdapter: jest.fn().mockReturnValue({
                                expandedPredicate: () => true,
                                loading: of(true),
                                content: of([]),
                                load: jest.fn()
                            })
                        }
                }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectTreeComponent);
        component = fixture.componentInstance;
        helper = TestBed.get(ProjectTreeHelper);
    });

    it ('should create', () => {
        expect(component).toBeTruthy();
    });

    it ('project tree should contain all the expected filters', () => {
        fixture.detectChanges();

        const filters = fixture.nativeElement.querySelectorAll('ama-project-tree-filter');
        expect(filters.length).toBe(2);
    });

    it ('if filter is opened method getDataAdapter should be called with the filter type', () => {
        fixture.detectChanges();
        const filters = fixture.nativeElement.querySelectorAll('ama-project-tree-filter');

        filters[0].dispatchEvent(new Event('opened'));
        expect(helper.getDataAdapter).toHaveBeenCalledWith(mockFilters[0].type);
    });
});
