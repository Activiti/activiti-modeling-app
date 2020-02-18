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
import { ExportProjectAction } from '../../../project-editor/store/project-editor.actions';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationMock, TranslationService, AppConfigService } from '@alfresco/adf-core';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { Store } from '@ngrx/store';
import { AmaState, AmaApi, PROJECT_CONTEXT_MENU_OPTIONS, selectLoading, selectPagination, selectProjectSummaries } from '@alfresco-dbp/modeling-shared/sdk';
import { By } from '@angular/platform-browser';
import { of, BehaviorSubject } from 'rxjs';
import { MatMenuModule, MatTableModule } from '@angular/material';
import { MomentModule } from 'ngx-moment';
import { RouterTestingModule } from '@angular/router/testing';
import { Pagination } from '@alfresco/js-api';
import { mockProject, paginationMock } from './projects-list.mock';
import { DashboardService } from '../../services/dashboard.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe ('Projects List Component', () => {
    let component: ProjectsListComponent;
    let fixture: ComponentFixture<ProjectsListComponent>;
    let store: Store<AmaState>;

    const projectsLoaded$ = new BehaviorSubject<boolean>(false);
    const paginationLoaded$ = new BehaviorSubject<Pagination>(paginationMock);
    let dashboardService: DashboardService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                MatMenuModule,
                MatTableModule,
                MomentModule,
                RouterTestingModule,
                NoopAnimationsModule
            ],
            declarations: [
                ProjectsListComponent
            ],
            providers: [
                AmaApi,
                DashboardService,
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
                                return of([ mockProject ]);
                            }

                            return of({});
                        })
                    }
                },
                { provide: PROJECT_CONTEXT_MENU_OPTIONS, useValue: []},
                { provide: TranslationService, useClass: TranslationMock },
                { provide: AppConfigService, useValue: {get: jest.fn('navigation').mockRejectedValue('{}')} }
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        dashboardService = TestBed.get(DashboardService);
        fixture = TestBed.createComponent(ProjectsListComponent);
        store = TestBed.get(Store);
        component = fixture.componentInstance;
        component.ngOnInit();
        fixture.detectChanges();
    });

    it('clicking on download button should dispatch an ExportProjectAction', () => {
        dashboardService.fetchProjects = jest.fn().mockReturnValue(of([ mockProject ]));

        spyOn(store, 'dispatch');
        const menu = fixture.debugElement.query(By.css('[data-automation-id="project-context-mock-project-id"]'));
        menu.triggerEventHandler('click', {});
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('[data-automation-id="project-download-mock-project-id"]'));
        button.triggerEventHandler('click', {});
        fixture.detectChanges();
        const exportAction: ExportProjectAction = store.dispatch.calls.argsFor(0)[0];

        expect(exportAction.type).toBe('EXPORT_PROJECT');
        expect(exportAction.payload).toEqual({
            projectId: 'mock-project-id',
            projectName: 'mock-project-name'
        });
    });
});
