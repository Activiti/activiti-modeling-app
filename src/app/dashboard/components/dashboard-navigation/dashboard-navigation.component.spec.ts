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

import { DashboardNavigationComponent } from './dashboard-navigation.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule, MatIconModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslationMock, TranslationService, AppConfigService } from '@alfresco/adf-core';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { UploadProjectAttemptAction, UPLOAD_PROJECT_ATTEMPT } from '../../store/actions/projects';
import { AmaState } from 'ama-sdk';

describe ('Dashboard navigation Component', () => {
    let component: DashboardNavigationComponent;
    let fixture: ComponentFixture<DashboardNavigationComponent>;
    let store: Store<AmaState>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                MatTooltipModule,
                MatIconModule,
                NoopAnimationsModule,
                RouterTestingModule
            ],
            declarations: [
                DashboardNavigationComponent
            ],
            providers: [
                {
                    provide: Store,
                    useValue: {dispatch: jest.fn(), select: jest.fn().mockReturnValue(of({}))}
                },
                { provide: TranslationService, useClass: TranslationMock },
                { provide: AppConfigService, useValue: {get: jest.fn('navigation').mockRejectedValue('{}')} }
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardNavigationComponent);
        store = TestBed.get(Store);
        component = fixture.componentInstance;
        component.ngOnInit();
    });

    it('clicking on upload button should dispatch a UploadProjectAttemptAction, and the fileInput should be cleaned', () => {
        const button = fixture.nativeElement.querySelector('.app-upload-btn');
        spyOn(component.fileInput.nativeElement, 'click');
        spyOn(store, 'dispatch');
        button.click();
        fixture.detectChanges();
        expect(component.fileInput.nativeElement.click).toHaveBeenCalled();

        component.fileInput.nativeElement.dispatchEvent(new Event('change'));
        fixture.detectChanges();
        expect(store.dispatch).toHaveBeenCalled();

        const uploadAction: UploadProjectAttemptAction = store.dispatch.calls.argsFor(0)[0];
        const file = store.dispatch.calls.argsFor(0)[1];
        expect(uploadAction.type).toBe(UPLOAD_PROJECT_ATTEMPT);
        expect(uploadAction.file).toBe(file);

        expect(component.fileInput.nativeElement.value).toBe('');
    });

});
