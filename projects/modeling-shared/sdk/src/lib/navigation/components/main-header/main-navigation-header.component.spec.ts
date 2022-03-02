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

import { TranslationMock, TranslationService } from '@alfresco/adf-core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MainNavigationHeaderComponent } from './main-navigation-header.component';

describe('MainNavigationHeaderComponent', () => {
    let fixture: ComponentFixture<MainNavigationHeaderComponent>;
    let component: MainNavigationHeaderComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                MainNavigationHeaderComponent
            ],
            imports: [
                TranslateModule.forRoot(),
                RouterTestingModule.withRoutes([])
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                {
                    provide: Router,
                    useValue: {
                       url: '/dashboard/projects'
                    }
                }
            ]
        });

        TestBed.compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MainNavigationHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    it('should show the header as My Projects on routing to /projects', () => {
        expect(component.headerLabel).toEqual('NEW_STUDIO_DASHBOARD.NAVIGATION.ALL_PROJECTS.HEADER_LABEL');
    });
});
