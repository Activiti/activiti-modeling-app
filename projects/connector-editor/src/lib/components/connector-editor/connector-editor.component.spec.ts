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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule, TranslationService, TranslationMock } from '@alfresco/adf-core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { selectConnectorEditorSaving } from '../../store/connector-editor.selectors';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CONNECTOR, SharedModule, AmaState, ModelEditorState, CONNECTOR_MODEL_ENTITY_SELECTORS } from '@alfresco-dbp/modeling-shared/sdk';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { UpdateConnectorContentAttemptAction } from '../../store/connector-editor.actions';
import { SaveConnectorCommand } from '../../services/commands/save-connector.command';
import { ActivatedRoute } from '@angular/router';
import { DeleteConnectorCommand } from '../../services/commands/delete-connector.command';
import { SaveAsConnectorCommand } from '../../services/commands/save-as-connector.command';
import { DownloadConnectorCommand } from '../../services/commands/download-connector.command';
import { ValidateConnectorCommand } from '../../services/commands/validate-connector.command';

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
    const updateConnectorPayload = new UpdateConnectorContentAttemptAction({modelId: 'mock-id', modelContent: JSON.parse(content)});
    let connectorEditorState = ModelEditorState.SAVED;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule,
                CoreModule.forChild(),
                ExtensionsModule,
                MatIconModule,
                MatTabsModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                RouterTestingModule
            ],
            declarations: [
                ConnectorEditorComponent,
            ],
            providers: [
                DeleteConnectorCommand,
                DownloadConnectorCommand,
                SaveConnectorCommand,
                SaveAsConnectorCommand,
                ValidateConnectorCommand,
                {
                    provide: ActivatedRoute,
                    useValue: { params: of({}), snapshot: {url: ''} }
                },
                { provide: TranslationService, useClass: TranslationMock },
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation((selector) => {
                            if (selector === selectConnectorEditorSaving) {
                                return of(connectorEditorState);
                            }

                            return of({});
                        }),
                        dispatch: jest.fn()
                    }
                },
                {
                    provide: CONNECTOR_MODEL_ENTITY_SELECTORS,
                    useValue: {
                        selectModelContentById: jest.fn().mockImplementation(() => of()),
                        selectModelDraftContentById: jest.fn().mockImplementation(() => of()),
                        selectModelDraftStateExists: jest.fn().mockImplementation(() => of())
                    }
                }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ConnectorEditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        store = TestBed.inject(Store);
        component.editorContent$ = of(content);
        component.modelId = mockConnector.id;
    });

    it('should render spinner if loading state is true', () => {
        component.loadingState$ = of(true);
        const spinner = fixture.debugElement.query(By.css('.ama-connector-editor-spinner'));

        expect(spinner).not.toBeNull();
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
