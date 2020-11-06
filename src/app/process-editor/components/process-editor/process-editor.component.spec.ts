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
import { ProcessEditorComponent } from './process-editor.component';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule, AmaState, ProcessModelerServiceToken, AmaTitleService, ProcessModelerService, ModelEditorState } from '@alfresco-dbp/modeling-shared/sdk';
import { CoreModule, TranslationService, TranslationMock } from '@alfresco/adf-core';
import { mockProcessModel } from '../../store/process.mock';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProcessDiagramLoaderService } from '../../services/process-diagram-loader.service';
import { UpdateProcessAttemptAction, ValidateProcessAttemptAction } from '../../store/process-editor.actions';
import { selectProcessEditorSaving } from '../../store/process-editor.selectors';

describe('ProcessEditorComponent', () => {
    let fixture: ComponentFixture<ProcessEditorComponent>;
    let component: ProcessEditorComponent;
    let store: Store<AmaState>;
    let processModelerService: ProcessModelerService;
    const content = 'mockProcessContent';
    let processEditorState = ModelEditorState.SAVED;
    const updateProcessPayload = new UpdateProcessAttemptAction({
        processId: mockProcessModel.id,
        content: content,
        metadata: { name: mockProcessModel.name, description: mockProcessModel.description }
    });
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule,
                CoreModule.forRoot(),
                MatIconModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                HttpClientTestingModule
            ],
            providers: [
                AmaTitleService,
                ProcessDiagramLoaderService,
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
                                $parent: { name: mockProcessModel.name },
                                name: mockProcessModel.name,
                                get: (param) => {
                                    const data = { documentation: mockProcessModel.description };
                                    return data[param];
                                }
                            }
                        })
                    }
                }
            ],
            declarations: [ProcessEditorComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessEditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.process$ = of(mockProcessModel);
        component.content$ = of('mockProcessContent');
        store = TestBed.inject(Store);
        processModelerService = TestBed.inject(ProcessModelerServiceToken);
    });

    afterEach(() => fixture.destroy());

    it('should test trigger of onSave() validates and updates process', async() => {
        spyOn(store, 'dispatch');
        const payload = new ValidateProcessAttemptAction({
                title: 'APP.DIALOGS.CONFIRM.SAVE.PROCESS',
                processId: mockProcessModel.id,
                content: content,
                extensions: mockProcessModel.extensions,
                action: updateProcessPayload
            });
        component.onSave();
        await expect(store.dispatch).toHaveBeenCalledWith(payload);
        await expect(processModelerService.getRootProcessElement).toHaveBeenCalled();
    });

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
});
