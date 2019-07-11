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

import { ConnectorEditorComponent } from './connector-editor.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MatIconModule, MatTabsModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectorHeaderComponent } from '../connector-header/connector-header.component';
import { CoreModule, TranslationService, TranslationMock } from '@alfresco/adf-core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { selectSelectedConnector, selectSelectedConnectorContent } from '../../store/connector-editor.selectors';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { AmaTitleService, CONNECTOR, CodeValidatorService, AjvInjectionToken, SharedModule, EditorHelperService } from 'ama-sdk';
import { ExtensionsModule, ComponentRegisterService } from '@alfresco/adf-extensions';

describe('ConnectorEditorComponent', () => {
    let fixture: ComponentFixture<ConnectorEditorComponent>;
    let component: ConnectorEditorComponent;

    const ajv = { validate: jest.fn() };
    const mockConnector = {
        type: CONNECTOR,
        id: 'mock-id',
        name: 'mock-name',
        description: 'mock-description',
        projectId: 'mock-app-id'
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule,
                CoreModule.forRoot(),
                ExtensionsModule,
                MatIconModule,
                MatTabsModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                RouterTestingModule
            ],
            declarations: [
                ConnectorEditorComponent,
                ConnectorHeaderComponent
            ],
            providers: [
                ComponentRegisterService,
                AmaTitleService,
                CodeValidatorService,
                EditorHelperService,
                { provide: TranslationService, useClass: TranslationMock },
                { provide: AjvInjectionToken, useValue: ajv },
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation((selector) => {
                            if (selector === selectSelectedConnector) {
                                return of(mockConnector);
                            } else if (selector === selectSelectedConnectorContent) {
                                return of({});
                            }

                            return of({});
                        }),
                        dispatch: jest.fn()
                    }
                }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConnectorEditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should render component', () => {
        expect(component).not.toBeNull();
    });

    it('should render spinner if loading state is true', () => {
        component.loadingState$ = of(true);
        const spinner = fixture.debugElement.query(By.css('.ama-connector-editor-spinner'));

        expect(spinner).not.toBeNull();
    });
});
