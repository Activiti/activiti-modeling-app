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

import { ProjectsListComponent } from './projects-list.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationMock, TranslationService, AppConfigService, CoreModule } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import {
    AmaState, AmaApi, PROJECT_CONTEXT_MENU_OPTIONS, selectLoading,
    selectPagination, selectProjectSummaries, ExportProjectAction,
    LayoutService
} from '@alfresco-dbp/modeling-shared/sdk';
import { By } from '@angular/platform-browser';
import { of, BehaviorSubject } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MomentModule } from 'ngx-moment';
import { RouterTestingModule } from '@angular/router/testing';
import { Pagination } from '@alfresco/js-api';
import { mockProject, mockProject1, paginationMock } from './projects-list.mock';
import { DashboardService } from '../../services/dashboard.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe ('Projects List Component', () => {
    let component: ProjectsListComponent;
    let fixture: ComponentFixture<ProjectsListComponent>;
    let store: Store<AmaState>;
    let layoutService: LayoutService;

    const projectsLoaded$ = new BehaviorSubject<boolean>(false);
    const paginationLoaded$ = new BehaviorSubject<Pagination>(paginationMock);
    let dashboardService: DashboardService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                CoreModule.forChild(),
                MatMenuModule,
                MatTableModule,
                MatSortModule,
                MatPaginatorModule,
                MomentModule,
                RouterTestingModule,
                NoopAnimationsModule,
                MatIconModule
            ],
            declarations: [
                ProjectsListComponent
            ],
            providers: [
                AmaApi,
                {
                    provide: Store,
                    useValue: {
                        dispatch: jest.fn(),
                        select: jest.fn().mockImplementation((selector) => {
                            if (selector === selectLoading) {
                                return projectsLoaded$;
                            } else if (selector === selectPagination) {
                                return paginationLoaded$;
                            } else if (selector === selectProjectSummaries) {
                                return of([ mockProject, mockProject1 ]);
                            }

                            return of({});
                        })
                    }
                },
                { provide: PROJECT_CONTEXT_MENU_OPTIONS, useValue: []},
                { provide: TranslationService, useClass: TranslationMock },
                { provide: AppConfigService, useValue: { get() { return {}; } } },
                LayoutService
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).overrideModule(MatIconModule, {
            remove: {
                declarations: [MatIcon],
                exports: [MatIcon]
            }
        });

        dashboardService = TestBed.inject(DashboardService);
        fixture = TestBed.createComponent(ProjectsListComponent);
        store = TestBed.inject(Store);
        layoutService = TestBed.inject(LayoutService);
        layoutService.isTabletWidth = jest.fn().mockReturnValue(false);
        component = fixture.componentInstance;
        component.ngOnInit();
        fixture.detectChanges();
    });

    it('clicking on download button should dispatch an ExportProjectAction', () => {
        dashboardService.fetchProjects = jest.fn().mockReturnValue(of([ mockProject ]));

        const dispatchSpy = spyOn(store, 'dispatch');
        const menu = fixture.debugElement.query(By.css('[data-automation-id="project-context-mock-project-id"]'));
        menu.triggerEventHandler('click', {});
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('[data-automation-id="project-download-mock-project-id"]'));
        button.triggerEventHandler('click', {});
        fixture.detectChanges();
        const exportAction: ExportProjectAction = dispatchSpy.calls.argsFor(0)[0];

        expect(exportAction.type).toBe('EXPORT_PROJECT');
        expect(exportAction.payload).toEqual({
            projectId: 'mock-project-id',
            projectName: 'mock-project-name'
        });
    });

    it('should sort by updated column desc by default', () => {
        expect(component.sorting.key).toEqual('lastModifiedDate');
        expect(component.sorting.direction).toEqual('desc');
    });
});
