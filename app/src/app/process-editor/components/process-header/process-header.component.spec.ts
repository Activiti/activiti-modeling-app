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
import { ProcessHeaderComponent } from './process-header.component';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule, AmaState, OpenConfirmDialogAction, ProcessModelerServiceToken, AmaTitleService } from '@alfresco-dbp/modeling-shared/sdk';
import { CoreModule, TranslationService, TranslationMock } from '@alfresco/adf-core';
import { By } from '@angular/platform-browser';
import { mockProcessModel } from '../../store/process.mock';
import { Store } from '@ngrx/store';
import { of, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DeleteProcessAttemptAction, DownloadProcessAction, ValidateProcessAttemptAction, DownloadProcessSVGImageAction } from '../../store/process-editor.actions';
import { Actions } from '@ngrx/effects';

describe('ProcessHeaderComponent', () => {
    let fixture: ComponentFixture<ProcessHeaderComponent>;
    let component: ProcessHeaderComponent;
    let store: Store<AmaState>;
    const mockAction = new Subject();

    beforeEach(async(() => {
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
                AmaTitleService,
                { provide: TranslationService, useClass: TranslationMock },
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockReturnValue(of({})),
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
                },
                {
                    provide: Actions,
                    useValue: mockAction
                }
            ],
            declarations: [ProcessHeaderComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.process = mockProcessModel;
        component.content = 'mockProcessContent';
        store = TestBed.inject(Store);
    });

    it('should render breadcrumbs', () => {
        const breadcrumbs = fixture.debugElement.query(By.css('modelingsdk-header-breadcrumbs'));
        expect(breadcrumbs).not.toBeNull();
    });

    it('should test download button', () => {
        spyOn(store, 'dispatch');

        const button = fixture.debugElement.query(By.css('[data-automation-id="process-editor-download-button"]'));
        button.triggerEventHandler('click', {});
        fixture.detectChanges();

        const payload = new ValidateProcessAttemptAction({
            title: 'APP.DIALOGS.CONFIRM.DOWNLOAD.PROCESS',
            processId: mockProcessModel.id,
            content: component.content,
            extensions: mockProcessModel.extensions,
            action: new DownloadProcessAction(mockProcessModel)
        });

        expect(store.dispatch).toHaveBeenCalledWith(payload);
    });

    it('should test delete button', () => {
        spyOn(store, 'dispatch');

        const menuButton = fixture.debugElement.query(By.css('[data-automation-id="process-editor-menu-button"]'));
        menuButton.triggerEventHandler('click', {});
        fixture.detectChanges();

        const deleteButton = fixture.debugElement.query(By.css('[data-automation-id="process-editor-delete-button"]'));
        deleteButton.triggerEventHandler('click', {});
        fixture.detectChanges();

        const payload = new OpenConfirmDialogAction({
            dialogData: {
                title: 'APP.DIALOGS.CONFIRM.DELETE.PROCESS'
            },
            action: new DeleteProcessAttemptAction(mockProcessModel.id)
        });

        expect(store.dispatch).toHaveBeenCalledWith(payload);
    });

    it('should download process image as svg', async () => {
        spyOn(store, 'dispatch');
        spyOn(component, 'isDiagramTabSelected').and.returnValue(true);

        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('[data-automation-id="process-editor-download-svg-button"]'));
        button.triggerEventHandler('click', {});
        fixture.detectChanges();

        const payload = new ValidateProcessAttemptAction({
            title: 'APP.DIALOGS.CONFIRM.DOWNLOAD.IMAGE',
            processId: mockProcessModel.id,
            content: component.content,
            extensions: mockProcessModel.extensions,
            action: new DownloadProcessSVGImageAction(mockProcessModel)
        });

        expect(store.dispatch).toHaveBeenCalledWith(payload);
    });

    it('should hide download image as svg if is not on diagram tab', () => {
        const isDiagramTabSelectSpy = spyOn(component, 'isDiagramTabSelected').and.returnValue(true);
        fixture.detectChanges();
        let button = fixture.debugElement.query(By.css('[data-automation-id="process-editor-download-svg-button"]'));
        expect(button).toBeDefined();

        isDiagramTabSelectSpy.and.returnValue(false);
        fixture.detectChanges();
        button = fixture.debugElement.query(By.css('[data-automation-id="process-editor-download-svg-button"]'));
        expect(button).toBeNull();
    });

    it('should emit save event emitter on click of save button ', () => {
        const emitSpy = spyOn(component.save, 'emit');
        fixture.detectChanges();
        const saveButton = fixture.debugElement.query(By.css('[data-automation-id="process-editor-save-button"]'));
        saveButton.triggerEventHandler('click', {});
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should render save as button inside menu', () => {
        const menuButton = fixture.debugElement.query(By.css('[data-automation-id="process-editor-menu-button"]'));
        menuButton.triggerEventHandler('click', {});
        fixture.detectChanges();

        const saveAsButton = fixture.debugElement.query(By.css('[data-automation-id="process-editor-save-as-button"]'));

        expect(saveAsButton).not.toBeNull();
        expect(saveAsButton.nativeElement.textContent).toEqual('APP.MENU.SAVE_AS');
    });
});
