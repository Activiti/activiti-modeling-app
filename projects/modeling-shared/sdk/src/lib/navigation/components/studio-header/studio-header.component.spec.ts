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
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { By } from '@angular/platform-browser';
import { Router, RouterEvent } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of, ReplaySubject } from 'rxjs';
import { LayoutService } from '../../../services/layout.service';
import { OpenInfoDialogAction } from '../../../store/app.actions';
import { AmaState } from '../../../store/app.state';
import { ValidateProjectAttemptAction } from '../../../store/project.actions';
import { StudioHeaderComponent } from './studio-header.component';

describe('StudioHeaderComponent', () => {
    let fixture: ComponentFixture<StudioHeaderComponent>;
    let store: Store<AmaState>;
    let routerEventReplaySubject: ReplaySubject<RouterEvent>;
    let component: StudioHeaderComponent;

    beforeEach(() => {
        routerEventReplaySubject = new ReplaySubject<RouterEvent>(1);
        TestBed.configureTestingModule({
            declarations: [
                StudioHeaderComponent
            ],
            imports: [
                TranslateModule.forRoot(),
                RouterTestingModule.withRoutes([]),
                MatIconModule,
                MatMenuModule
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                {
                    provide: Router,
                    useValue: {
                        url: '',
                        events: routerEventReplaySubject.asObservable()
                    }
                },
                {
                    provide: Store,
                    useValue: {
                        dispatch: jest.fn().mockReturnValue(of({})),
                        select: jest.fn().mockImplementation((selector) => {
                            if (selector === 'selectProject') {
                                return of();
                            } else if (selector === 'selectAnyModelInDirtyState') {
                                return of(true);
                            }
                            return of({});
                        }),
                    }
                },
                LayoutService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        TestBed.compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StudioHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        store = TestBed.inject(Store);
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    it('should display unsaved dialog when the models are in dirty state', () => {
        spyOn(store, 'dispatch');

        const validateButton = fixture.debugElement.query(By.css('.ama-studio-project-header-action-validate'));
        validateButton.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(store.dispatch).toHaveBeenCalledWith(new OpenInfoDialogAction({dialogData: {
            title: 'SDK.PROJECT_HEADER.UNSAVED_DIALOG_TITLE',
            messages: ['SDK.PROJECT_HEADER.UNSAVED_VALIDATE_MESSAGE']
        }}));
    });

    it('should show validation dialog when models are not dirty', () => {
        component.isAnyModelInDirtyState = false;
        const validateButton = fixture.debugElement.query(By.css('.ama-studio-project-header-action-validate'));
        validateButton.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(store.dispatch).toHaveBeenCalledWith(new ValidateProjectAttemptAction(undefined));
    });

});
