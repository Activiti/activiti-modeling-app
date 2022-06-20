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

import { AppConfigService, TranslationMock, TranslationService } from '@alfresco/adf-core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { Router, RouterEvent } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of, ReplaySubject } from 'rxjs';
import { LayoutService } from '../../../services/layout.service';
import { AmaState } from '../../../store/app.state';
import { MainNavigationHeaderComponent } from './main-navigation-header.component';

describe('MainNavigationHeaderComponent', () => {
    let fixture: ComponentFixture<MainNavigationHeaderComponent>;
    let store: Store<AmaState>;
    let routerEventReplaySubject: ReplaySubject<RouterEvent>;
    const mockNavigationData = {
        process: [
            {
                label: 'label_1',
                title: 'title_1',
                disabled: false,
                route: {
                    url: '/dashboard/favorite-projects'
                }
            },
            {
                label: 'label_2',
                title: 'title_2',
                disabled: false,
                route: {
                    url: '/dashboard/projects'
                },
                actions: [
                    {
                        actionName: 'create',
                        title: 'CREATE',
                        handler: 'create_handler',
                        icon: 'add'
                    }
                ]
            },
        ]
    };

    beforeEach(() => {
        routerEventReplaySubject = new ReplaySubject<RouterEvent>(1);
        TestBed.configureTestingModule({
            declarations: [
                MainNavigationHeaderComponent
            ],
            imports: [
                TranslateModule.forRoot(),
                RouterTestingModule.withRoutes([]),
                MatIconModule
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                {
                    provide: Router,
                    useValue: {
                        url: '/dashboard/projects',
                        events: routerEventReplaySubject.asObservable()
                    }
                },
                {
                    provide: Store,
                    useValue: {
                        dispatch: jest.fn().mockReturnValue(of({}))
                    }
                },
                { provide: AppConfigService, useValue: { get() { return mockNavigationData; } } },
                LayoutService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        TestBed.compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MainNavigationHeaderComponent);
        fixture.detectChanges();
        store = TestBed.inject(Store);
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    it('should show the header as My Projects on routing to /projects', () => {
        const title = fixture.debugElement.query(By.css('.studio-project-list-header-title'));
        expect(title.nativeElement.textContent).toEqual(' label_2 ');
    });

    it('should dispatch correct action on click of action button', () => {
        spyOn(store, 'dispatch');
        const createButton = fixture.debugElement.query(By.css('.studio-create-button'));
        createButton.triggerEventHandler('click', {});
        fixture.detectChanges();

        expect(store.dispatch).toHaveBeenCalledWith({'type': 'create_handler'});
    });
});
