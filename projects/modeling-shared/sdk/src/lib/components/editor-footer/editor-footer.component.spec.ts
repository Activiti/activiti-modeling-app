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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorFooterComponent } from './editor-footer.component';
import { Store } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule, TranslationService, TranslationMock } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { LogHistoryComponent } from './log-history/log-history.component';
import { LogHistoryEntryComponent } from './log-history/log-history-entry/log-history-entry.component';
import { selectToolbarInProgress } from '../../store/app.selectors';
import { AppFooterService } from '../../services/app-footer.service';
import { SharedModule } from '../../helpers/shared.module';
import { EDITOR_FOOTER_SERVICE_TOKEN } from '../../services/editor-footer.service.interface';
import { provideLogFilter } from '../../helpers/utils/log-filters';

describe('EditorFooterComponent', () => {

    let fixture: ComponentFixture<EditorFooterComponent>;

    let progress = true;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                SharedModule,
                TranslateModule.forRoot(),
                CoreModule.forChild(),
                CommonModule,
                MatIconModule,
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
                { provide: EDITOR_FOOTER_SERVICE_TOKEN, useClass: AppFooterService },
                provideLogFilter({
                    key: '*',
                    displayName: 'SDK.ALL'
                })
            ]
        });

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
