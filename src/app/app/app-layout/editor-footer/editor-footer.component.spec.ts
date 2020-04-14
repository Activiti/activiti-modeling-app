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
import { EditorFooterComponent } from './editor-footer.component';
import { Store } from '@ngrx/store';
import { SharedModule, provideLogFilter } from '@alfresco-dbp/modeling-shared/sdk';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule, TranslationService, TranslationMock } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EDITOR_FOOTER_SERVICE_TOKEN } from './editor-footer.service.interface';
import { AppFooterService } from '../../../common/services/app-footer.service';
import { selectToolbarInProgress } from '../../../store/selectors/app.selectors';
import { By } from '@angular/platform-browser';
import { LogHistoryComponent } from '../logging/components/log-history/log-history.component';
import { LogHistoryEntryComponent } from '../logging/components/log-history/log-history-entry/log-history-entry.component';
import { of } from 'rxjs';

 describe('EditorFooterComponent', () => {

    let fixture: ComponentFixture<EditorFooterComponent>;

    let progress = true;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                SharedModule,
                CoreModule,
                CommonModule,
                MatIconModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule
            ],
            declarations: [
                EditorFooterComponent,
                LogHistoryComponent,
                LogHistoryEntryComponent
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation((selector) => {
                            if (selector === selectToolbarInProgress) {
                                return of(progress);
                            }
                            return of([]);
                        }),
                        dispatch: jest.fn()
                    }
                },
                AppFooterService,
                { provide: EDITOR_FOOTER_SERVICE_TOKEN, useClass: AppFooterService },
                provideLogFilter({
                    key: '*',
                    displayName: 'SDK.ALL'
            })
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorFooterComponent);
        fixture.detectChanges();
    });

    afterEach(() => {
        progress = !progress;
    });

    it('should display loading progress if store progress flag is true', () => {
        const loading = fixture.debugElement.query(By.css('.loading-indicator'));
        expect(loading).toBeDefined();
    });

    it('should display loading progress if store progress flag is false', () => {
        fixture.detectChanges();
        const loading = fixture.debugElement.query(By.css('.loading-indicator'));
        expect(loading).toBeNull();
    });
 });
