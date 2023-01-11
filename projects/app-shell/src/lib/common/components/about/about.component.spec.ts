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

import { AboutModule, AboutPanelDirective, setupTestBed } from '@alfresco/adf-core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DEV_MODE_TOKEN } from './dev-mode.tokens';
import { By } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AboutComponent } from './about.component';
import { ENVIRONMENT_SERVICE_TOKEN } from '@alfresco-dbp/adf-candidates/core/environment';
import { FeatureDirective } from '@alfresco-dbp/adf-candidates/core/environment/directives/feature/feature.directive';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const mockEnvironmentService = {
        isProduction: () => false,
        isFeatureActive: () => true,
        describeFeatures: () => []
    };

describe('AboutComponent', () => {
    let component: AboutComponent;
    let fixture: ComponentFixture<AboutComponent>;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            AboutModule,
            NoopAnimationsModule,
            HttpClientTestingModule,
            MatIconModule,
            MatDialogModule
        ],
        declarations: [
            AboutComponent,
            FeatureDirective,
            AboutPanelDirective
        ],
        providers: [
            { provide: DEV_MODE_TOKEN, useValue: true },
            { provide: ENVIRONMENT_SERVICE_TOKEN, useValue: mockEnvironmentService }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AboutComponent);
        component = fixture.componentInstance;
    });

    it('should display environment info', () => {
        fixture.detectChanges();
        const environmentInfoElement = fixture.debugElement.query(By.css('[data-automation-id="ama-about-environment-info"]'));

        expect(environmentInfoElement).toBeTruthy();
    });

    it('should display close button', () => {
        fixture.detectChanges();
        const closeButton = fixture.debugElement.query(By.css('button'));

        expect(closeButton).toBeTruthy();
        expect(closeButton.nativeElement.textContent.trim()).toBe('APP.DIALOGS.CLOSE');
    });

    describe('dev mode', () => {

        beforeEach(() => {
            component.dev = true;
            fixture.detectChanges();
        });

        it('should display proper number of info panels', () => {
            const panelTitleElements = fixture.debugElement.queryAll(By.css('mat-panel-title'));

            expect(panelTitleElements).toBeTruthy();
            expect(panelTitleElements.length).toBe(3);
        });

        it('should display server settings', () => {
            const serverSettingsPanelTitleElement = fixture.debugElement.queryAll(By.css('mat-panel-title'))[0];

            expect(serverSettingsPanelTitleElement).toBeTruthy();
            expect(serverSettingsPanelTitleElement.nativeElement.textContent.trim()).toBe('ABOUT.SERVER_SETTINGS.TITLE');
        });

        it('should display packages', () => {
            const packagesPanelTitleElement = fixture.debugElement.queryAll(By.css('mat-panel-title'))[1];

            expect(packagesPanelTitleElement).toBeTruthy();
            expect(packagesPanelTitleElement.nativeElement.textContent.trim()).toBe('ABOUT.PACKAGES.TITLE');
        });

        it('should display version', () => {
            const versionPanelTitleElement = fixture.debugElement.queryAll(By.css('mat-panel-title'))[2];

            expect(versionPanelTitleElement).toBeTruthy();
            expect(versionPanelTitleElement.nativeElement.textContent.trim()).toBe('ABOUT.VERSION');
        });
    });

    describe('prod mode', () => {

        beforeEach(() => {
            component.dev = false;
            fixture.detectChanges();
        });

        it('should display proper number of info panels', () => {
            const panelTitleElements = fixture.debugElement.queryAll(By.css('mat-panel-title'));

            expect(panelTitleElements).toBeTruthy();
            expect(panelTitleElements.length).toBe(1);
        });

        it('should display version', () => {
            const versionPanelTitleElement = fixture.debugElement.queryAll(By.css('mat-panel-title'))[0];

            expect(versionPanelTitleElement).toBeTruthy();
            expect(versionPanelTitleElement.nativeElement.textContent.trim()).toBe('ABOUT.VERSION');
        });
    });
});
