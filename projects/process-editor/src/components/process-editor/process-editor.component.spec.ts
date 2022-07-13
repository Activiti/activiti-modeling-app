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
import { ProcessEditorComponent } from './process-editor.component';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule, AmaState, ProcessModelerServiceToken, ModelEditorState } from '@alfresco-dbp/modeling-shared/sdk';
import { CoreModule, TranslationService, TranslationMock } from '@alfresco/adf-core';
import { mockProcessModel } from '../../store/process.mock';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UpdateProcessAttemptAction } from '../../store/process-editor.actions';
import { PROCESS_MODEL_ENTITY_SELECTORS, selectProcessEditorSaving } from '../../store/process-editor.selectors';
import { SaveProcessCommand } from '../../services/commands/save-process.command';
import { DeleteProcessCommand } from '../../services/commands/delete-process.command';
import { ValidateProcessCommand } from '../../services/commands/validate-process.command';
import { DownloadProcessCommand } from '../../services/commands/download-process.command';
import { SaveAsProcessCommand } from '../../services/commands/save-as-process.command';
import { DownloadProcessSVGImageCommand } from '../../services/commands/download-process-svg-image.command';
import { By } from '@angular/platform-browser';

describe('ProcessEditorComponent', () => {
    let fixture: ComponentFixture<ProcessEditorComponent>;
    let component: ProcessEditorComponent;
    let store: Store<AmaState>;
    const content = 'mockProcessContent';
    let processEditorState = ModelEditorState.SAVED;
    const updateProcessPayload = new UpdateProcessAttemptAction({
        modelId: mockProcessModel.id,
        modelContent: content,
        modelMetadata: {
            ...mockProcessModel,
            name: mockProcessModel.name,
            description: mockProcessModel.description,
            category: mockProcessModel.category
        }
    });
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule,
                CoreModule.forChild(),
                MatIconModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                HttpClientTestingModule
            ],
            providers: [
                SaveProcessCommand,
                DeleteProcessCommand,
                ValidateProcessCommand,
                DownloadProcessCommand,
                SaveAsProcessCommand,
                DownloadProcessSVGImageCommand,
                { provide: TranslationService, useClass: TranslationMock },
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation((selector) => {
                            if (selector === selectProcessEditorSaving) {
                                return of(processEditorState);
                            } else {
                                return of({});
                            }
                        }),
                        dispatch: jest.fn()
                    }
                },
                {
                    provide: ProcessModelerServiceToken,
                    useValue: {
                        getRootProcessElement: jest.fn().mockReturnValue({
                            businessObject: {
                                $parent: {
                                    name: mockProcessModel.name,
                                    targetNamespace: mockProcessModel.category,
                                    get(key: string) {
                                        return this[key];
                                    }
                                },
                                name: mockProcessModel.name,
                                get: (param) => {
                                    const data = { documentation: mockProcessModel.description };
                                    return data[param];
                                }
                            }
                        })
                    }
                },
                {
                    provide: PROCESS_MODEL_ENTITY_SELECTORS,
                    useValue: {
                        selectModelContentById: jest.fn().mockImplementation(() => of()),
                        selectModelMetadataById: jest.fn().mockImplementation(() => of()),
                        selectModelDraftContentById: jest.fn().mockImplementation(() => of()),
                        selectModelDraftMetadataById: jest.fn().mockImplementation(() => of()),
                        selectModelDraftStateExists: jest.fn().mockImplementation(() => of())
                    }
                }
            ],
            declarations: [ProcessEditorComponent]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessEditorComponent);
        component = fixture.componentInstance;
        component.modelId = mockProcessModel.id;
        fixture.detectChanges();
        component.modelMetadata$ = of(mockProcessModel);
        component.editorContent$ = of('mockProcessContent');
        store = TestBed.inject(Store);
    });

    afterEach(() => fixture.destroy());

    it('should test canDeactivate() response to be true when selectProcessEditorSaving is in saved state', (done) => {
        spyOn(store, 'dispatch');
        component.canDeactivate().subscribe(canDeactivateResponse => {
            expect(store.dispatch).toHaveBeenCalledWith(updateProcessPayload);
            expect(canDeactivateResponse).toBe(true);
            done();
        });
    });

    it('should test canDeactivate() response to be false when selectProcessEditorSaving is in failed state', (done) => {
        processEditorState = ModelEditorState.FAILED;
        spyOn(store, 'dispatch');
        component.canDeactivate().subscribe(canDeactivateResponse => {
            expect(store.dispatch).toHaveBeenCalledWith(updateProcessPayload);
            expect(canDeactivateResponse).toBe(false);
            done();
        });
    });

    it('should test canDeactivate() response to be undefined when selectProcessEditorSaving is in saving state', async() => {
        processEditorState = ModelEditorState.SAVING;
        let canDeactivateResponse;
        spyOn(store, 'dispatch');
        component.canDeactivate().subscribe(response => {
            canDeactivateResponse = response;
        });
        await expect(store.dispatch).toHaveBeenCalledWith(updateProcessPayload);
        await expect(canDeactivateResponse).toBe(undefined);
    });

    it('should test canDeactivate() response to be undefined when selectProcessEditorSaving is in initial state', async() => {
        processEditorState = ModelEditorState.INITIAL;
        let canDeactivateResponse;
        spyOn(store, 'dispatch');
        component.canDeactivate().subscribe(response => {
            canDeactivateResponse = response;
        });
        await expect(store.dispatch).toHaveBeenCalledWith(updateProcessPayload);
        await expect(canDeactivateResponse).toBe(undefined);
    });

    it('should not display process modeler actions when in different editors tab', async() => {
        component.selectedTabIndex = 1;
        fixture.detectChanges();
        await fixture.whenStable();

        const modelerActions = fixture.debugElement.query(By.css('.ama-process-modeler-actions'));
        expect(modelerActions).toBeNull();
    });
});
