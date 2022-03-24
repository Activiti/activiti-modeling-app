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
import { ProjectNavigationComponent } from './project-navigation.component';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService, TranslationMock, CoreModule, AppConfigService } from '@alfresco/adf-core';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { AmaState, MODEL_CREATORS, ModelCreator, ModelCreatorDialogParams, OpenEntityDialogAction, CONNECTOR, OPEN_DIALOG } from '@alfresco-dbp/modeling-shared/sdk';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

describe('ProjectNavigationComponent', () => {
    let fixture: ComponentFixture<ProjectNavigationComponent>;
    let store: Store<AmaState>;
    let element: DebugElement;

    describe('For tests when extended is false', () => {
        beforeEach(() => {

            const processCreator: ModelCreator = {
                icon: 'device_hub',
                name: 'Processes',
                type: 'process',
                order: 1,
                dialog: <ModelCreatorDialogParams>{}
            };

            const connectorCreator: ModelCreator = {
                icon: 'device_hub',
                name: 'Connector',
                type: CONNECTOR,
                order: 1,
                dialog: <ModelCreatorDialogParams>{}
            };

            TestBed.configureTestingModule({
                imports: [
                    TranslateModule.forRoot(),
                    CoreModule.forChild(),
                    NoopAnimationsModule,
                    MatIconModule,
                    MatMenuModule,
                    MatToolbarModule
                ],
                providers: [
                    { provide: TranslationService, useClass: TranslationMock },
                    { provide: MODEL_CREATORS, useValue: [processCreator, connectorCreator ]},
                    {
                        provide: Store,
                        useValue: {
                            select() { return of(); }, dispatch: jest.fn()
                        }
                    },
                    AppConfigService
            ],
                schemas: [NO_ERRORS_SCHEMA],
                declarations: [ProjectNavigationComponent]
            });
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(ProjectNavigationComponent);
            element = fixture.debugElement;
            fixture.detectChanges();
            store = TestBed.inject(Store);
        });

        it('click on menu button should open a entity dialog', () => {
            const dispatchSpy = spyOn(store, 'dispatch');
            const createButton = element.query(By.css('[data-automation-id="create-button"]'));
            createButton.triggerEventHandler('click', { stopPropagation: jest.fn() });
            fixture.detectChanges();

            const action: OpenEntityDialogAction =  dispatchSpy.calls.argsFor(0)[0];

            expect(store.dispatch).toHaveBeenCalled();
            expect(action.type).toBe(OPEN_DIALOG);
        });

        it('if expanded is false, should load the  collapsedProjectTree template', () => {
            const icons = element.query(By.css('ama-project-tree-icons'));
            const appTree = element.query(By.css('ama-project-tree'));
            expect(icons === null).toBeFalsy();
            expect(appTree === null).toBeTruthy();
        });
    });

    describe('For tests when expanded is true', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TranslateModule.forRoot(), CoreModule, NoopAnimationsModule, MatIconModule, MatMenuModule, MatToolbarModule],
                providers: [
                    { provide: TranslationService, useClass: TranslationMock },
                    {
                        provide: MODEL_CREATORS,
                        multi: true,
                        useValue: {
                            icon: 'device_hub',
                            name: 'Processes',
                            order: 1,
                            dialog: {}
                        }
                    },
                    {
                        provide: Store,
                        useValue: { select() { return of(true); }, dispatch: jest.fn()}
                    }
            ],
                schemas: [NO_ERRORS_SCHEMA],
                declarations: [ProjectNavigationComponent]
            });

            fixture = TestBed.createComponent(ProjectNavigationComponent);
            element = fixture.debugElement;
            fixture.detectChanges();
            store = TestBed.inject(Store);
        });

        it('if expanded is false, should load the  collapsedProjectTree template', () => {
            const icons = element.query(By.css('ama-project-tree-icons'));
            const appTree = element.query(By.css('ama-project-tree'));
            expect(icons === null).toBeTruthy();
            expect(appTree === null).toBeFalsy();
        });
    });
});
