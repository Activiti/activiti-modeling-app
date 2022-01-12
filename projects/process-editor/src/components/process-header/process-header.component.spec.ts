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
import { SharedModule, AmaState, BasicModelCommands } from '@alfresco-dbp/modeling-shared/sdk';
import { CoreModule, TranslationService, TranslationMock } from '@alfresco/adf-core';
import { By } from '@angular/platform-browser';
import { mockProcessModel } from '../../store/process.mock';
import { Store } from '@ngrx/store';
import { of, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ValidateProcessAttemptAction, DownloadProcessSVGImageAction } from '../../store/process-editor.actions';
import { Actions } from '@ngrx/effects';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { ProcessCommandsService } from '../../services/commands/process-commands.service';
import { SaveProcessCommand } from '../../services/commands/save-process.command';
import { DeleteProcessCommand } from '../../services/commands/delete-process.command';
import { ValidateProcessCommand } from '../../services/commands/validate-process.command';
import { DownloadProcessCommand } from '../../services/commands/download-process.command';
import { SaveAsProcessCommand } from '../../services/commands/save-as-process.command';

describe('ProcessHeaderComponent', () => {
    let fixture: ComponentFixture<ProcessHeaderComponent>;
    let component: ProcessHeaderComponent;
    let store: Store<AmaState>;
    const mockAction = new Subject();

    function verifyButtonClickFor(buttonId: string, actionName: string) {
        const commandService = TestBed.inject(ProcessCommandsService);
        const emitSpy = spyOn(commandService, 'dispatchEvent');

        const buttonElement = fixture.debugElement.query(By.css(`[data-automation-id="${buttonId}"]`));
        buttonElement.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(emitSpy).toHaveBeenCalledWith(BasicModelCommands[actionName]);
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule,
                CoreModule.forChild(),
                MatIconModule,
                MatIconTestingModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                HttpClientTestingModule
            ],
            providers: [
                DeleteProcessCommand,
                SaveProcessCommand,
                ValidateProcessCommand,
                DownloadProcessCommand,
                SaveAsProcessCommand,
                ProcessCommandsService,
                { provide: TranslationService, useClass: TranslationMock },
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockReturnValue(of({})),
                        dispatch: jest.fn()
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
        component.modelId = mockProcessModel.id;
        component.modelMetadata = mockProcessModel;
        component.content = 'mockProcessContent';
        store = TestBed.inject(Store);
    });

    it('should render breadcrumbs', () => {
        const breadcrumbs = fixture.debugElement.query(By.css('modelingsdk-header-breadcrumbs'));
        expect(breadcrumbs).not.toBeNull();
    });

    it('should test download button', () => {
        verifyButtonClickFor('process-editor-download-button', 'download');
    });

    it('should test delete button', () => {
        const menuButton = fixture.debugElement.query(By.css('[data-automation-id="process-editor-menu-button"]'));
        menuButton.triggerEventHandler('click', {});
        fixture.detectChanges();

        verifyButtonClickFor('process-editor-delete-button', 'delete');
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
            modelId: mockProcessModel.id,
            modelContent: component.content,
            modelMetadata: mockProcessModel,
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

    it('should dispatch save on save click', () => {
        verifyButtonClickFor('process-editor-save-button', 'save');
    });

    it('should render save as button inside menu', () => {
        const menuButton = fixture.debugElement.query(By.css('[data-automation-id="process-editor-menu-button"]'));
        menuButton.triggerEventHandler('click', {});
        fixture.detectChanges();

        const saveAsButton = fixture.debugElement.query(By.css('[data-automation-id="process-editor-save-as-button"]'));

        expect(saveAsButton).not.toBeNull();
        expect(saveAsButton.nativeElement.textContent).toEqual('APP.MENU.SAVE_AS');
    });

    it('should test validate button', () => {
        verifyButtonClickFor('process-editor-validate-button', 'validate');
    });

    it('should emit save as event when clicked', () => {
        const menuButton = fixture.debugElement.query(By.css('[data-automation-id="process-editor-menu-button"]'));
        menuButton.triggerEventHandler('click', {});
        fixture.detectChanges();

        verifyButtonClickFor('process-editor-save-as-button', 'saveAs');
    });
});
