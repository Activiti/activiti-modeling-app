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

import { ConnectorHeaderComponent } from './connector-header.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule, BasicModelCommands } from '@alfresco-dbp/modeling-shared/sdk';
import { CoreModule, TranslationService, TranslationMock } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { ConnectorCommandsService } from '../../services/commands/connector-commands.service';
import { SaveConnectorCommand } from '../../services/commands/save-connector.command';
import { DeleteConnectorCommand } from '../../services/commands/delete-connector.command';
import { DownloadConnectorCommand } from '../../services/commands/download-connector.command';

describe('ConnectorHeaderComponent', () => {
    let fixture: ComponentFixture<ConnectorHeaderComponent>;
    let component: ConnectorHeaderComponent;

    function verifyButtonClickFor(buttonId: string, actionName: string) {
        const commandService = TestBed.inject(ConnectorCommandsService);
        const emitSpy = spyOn(commandService, 'dispatchEvent');

        const buttonElement = fixture.debugElement.query(By.css(`[data-automation-id="${buttonId}"]`));
        buttonElement.triggerEventHandler('click', null);
        fixture.detectChanges();

        expect(emitSpy).toHaveBeenCalledWith(BasicModelCommands[actionName]);
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                SharedModule,
                CoreModule.forChild(),
                CommonModule,
                MatIconTestingModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                HttpClientTestingModule
            ],
            declarations: [
                ConnectorHeaderComponent
            ],
            providers: [
                ConnectorCommandsService,
                DeleteConnectorCommand,
                DownloadConnectorCommand,
                SaveConnectorCommand,
                { provide: TranslationService, useClass: TranslationMock },
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockReturnValue(of({ url: '/', name: 'Mock' })),
                        dispatch: jest.fn()
                    }
                }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConnectorHeaderComponent);
        component = fixture.componentInstance;
        component.modelId = 'mock-id';
        component.content = JSON.stringify({
            id: 'mock-id',
            name: 'mock-name',
            description: 'mock-description'
        });
        fixture.detectChanges();
    });

    it('should save event on save button click', () => {
        verifyButtonClickFor('connector-editor-save-button', 'save');
    });

    it('should disable save button when "disableSave" input is true', () => {
        component.disableSave = true;
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css('[data-automation-id="connector-editor-save-button"]:disabled'));

        expect(button).not.toBeNull();
    });

    it('should delete an connector on button click', () => {
        const dropdown = fixture.debugElement.query(By.css('[data-automation-id="connector-editor-menu-button"]'));
        dropdown.triggerEventHandler('click', null);
        fixture.detectChanges();

        verifyButtonClickFor('connector-editor-delete-button', 'delete');
    });

    it('clicking on download button should emit', () => {
        verifyButtonClickFor('connector-editor-download-button', 'download');
    });

    it('should render save as button inside menu', () => {
        const menuButton = fixture.debugElement.query(By.css('[data-automation-id="connector-editor-menu-button"]'));
        menuButton.triggerEventHandler('click', {});
        fixture.detectChanges();

        const saveAsButton = fixture.debugElement.query(By.css('[data-automation-id="connector-editor-save-as-button"]'));

        expect(saveAsButton).not.toBeNull();
        expect(saveAsButton.nativeElement.textContent).toEqual('APP.MENU.SAVE_AS');
    });
});
