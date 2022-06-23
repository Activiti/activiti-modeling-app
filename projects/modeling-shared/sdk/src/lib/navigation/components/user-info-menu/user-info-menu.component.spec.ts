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

import { AppConfigService, InitialUsernamePipe, TranslationMock, TranslationService, UserAccessService } from '@alfresco/adf-core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { UserInfoMenuComponent } from './user-info-menu.component';

describe('UserInfoMenuComponent', () => {

    let fixture: ComponentFixture<UserInfoMenuComponent>;
    let userAccessService: UserAccessService;

    function clickOnUserMenu() {
        const menu = fixture.debugElement.query(By.css('.ama-user-initials'));
        menu.triggerEventHandler('click', null);
        fixture.detectChanges();
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                TranslateModule.forRoot(),
                HttpClientTestingModule,
                MatMenuModule
            ],
            declarations: [
                UserInfoMenuComponent,
                InitialUsernamePipe
            ],
            providers: [
                UserAccessService,
                AppConfigService,
                {
                    provide: Router,
                    useValue: { navigate: jest.fn() }
                },
                {
                    provide: Store,
                    useValue: {
                        dispatch: () => {},
                        select: () => of({})
                    }
                },
                {
                    provide: TranslationService,
                    useClass: TranslationMock
                },
                MatDialog,
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
        TestBed.compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserInfoMenuComponent);
        userAccessService = TestBed.inject(UserAccessService);
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    it('should display admin option in user menu if user is admin', () => {
        spyOn(userAccessService, 'hasGlobalAccess').and.returnValue(true);
        clickOnUserMenu();
        const adminOption = fixture.debugElement.query(By.css('.ama-user-menu-admin'));

        expect(adminOption).not.toBeNull();
    });

    it('should not display admin option when the user is not admin', () => {
        spyOn(userAccessService, 'hasGlobalAccess').and.returnValue(false);
        clickOnUserMenu();
        const adminOption = fixture.debugElement.query(By.css('.ama-user-menu-admin'));

        expect(adminOption).toBeNull();
    });

});
