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
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectorHeaderComponent } from '../connector-header/connector-header.component';
import { CoreModule, TranslationService, TranslationMock } from '@alfresco/adf-core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { selectConnectorEditorSaving, selectSelectedConnector } from '../../store/connector-editor.selectors';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { AmaTitleService, CONNECTOR, CodeValidatorService, SharedModule, AmaState, ModelEditorState } from '@alfresco-dbp/modeling-shared/sdk';
import { ExtensionsModule, ComponentRegisterService } from '@alfresco/adf-extensions';
import { UpdateConnectorContentAttemptAction, ValidateConnectorAttemptAction } from '../../store/connector-editor.actions';

describe('ConnectorEditorComponent', () => {
    let fixture: ComponentFixture<ConnectorEditorComponent>;
    let component: ConnectorEditorComponent;
    let store: Store<AmaState>;

    const mockConnector = {
        type: CONNECTOR,
        id: 'mock-id',
        name: 'mock-name',
        description: 'mock-description',
        projectId: 'mock-app-id'
    };
    const content = JSON.stringify({
        id: 'mock-id',
        name: 'mock-name',
        description: 'mock-description'
    });
    const updateConnectorPayload = new UpdateConnectorContentAttemptAction(JSON.parse(content));
    let connectorEditorState = ModelEditorState.SAVED;

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
                { provide: TranslationService, useClass: TranslationMock },
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation((selector) => {
                            if (selector === selectSelectedConnector) {
                                return of(mockConnector);
                            } else if (selector === selectConnectorEditorSaving) {
                                return of(connectorEditorState);
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
        store = TestBed.inject(Store);
        component.editorContent$ = of(content);
        component.connectorId$ = of(mockConnector.id);
    });

    it('should render spinner if loading state is true', () => {
        component.loadingState$ = of(true);
        const spinner = fixture.debugElement.query(By.css('.ama-connector-editor-spinner'));

        expect(spinner).not.toBeNull();
    });

    it('should test trigger of onSave() validates and updates connector', async() => {
        spyOn(store, 'dispatch');
        const payload = {
            title: 'APP.DIALOGS.CONFIRM.SAVE.CONNECTOR',
            connectorId: mockConnector.id,
            connectorContent: JSON.parse(content),
            action: updateConnectorPayload
        };
        component.onSave();
        await expect(store.dispatch).toHaveBeenCalledWith(new ValidateConnectorAttemptAction(payload));
    });

    it('should test canDeactivate() response to be true when selectConnectorEditorSaving is in saved state', (done) => {
        spyOn(store, 'dispatch');
        component.canDeactivate().subscribe(canDeactivateResponse => {
            expect(store.dispatch).toHaveBeenCalledWith(updateConnectorPayload);
            expect(canDeactivateResponse).toBe(true);
            done();
        });
    });

    it('should test canDeactivate() response to be false when selectConnectorEditorSaving is in failed state', (done) => {
        connectorEditorState = ModelEditorState.FAILED;
        spyOn(store, 'dispatch');
        component.canDeactivate().subscribe(canDeactivateResponse => {
            expect(store.dispatch).toHaveBeenCalledWith(updateConnectorPayload);
            expect(canDeactivateResponse).toBe(false);
            done();
        });
    });

    it('should test canDeactivate() response to be undefined when selectConnectorEditorSaving is in saving state', async() => {
        connectorEditorState = ModelEditorState.SAVING;
        let canDeactivateResponse;
        spyOn(store, 'dispatch');
        component.canDeactivate().subscribe(response => {
            canDeactivateResponse = response;
        });
        await expect(store.dispatch).toHaveBeenCalledWith(updateConnectorPayload);
        await expect(canDeactivateResponse).toBe(undefined);
    });
});
