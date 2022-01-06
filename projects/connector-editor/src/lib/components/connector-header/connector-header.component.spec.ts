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
import { AmaState, OpenConfirmDialogAction, SharedModule, BasicModelCommands } from '@alfresco-dbp/modeling-shared/sdk';
import { CoreModule, TranslationService, TranslationMock } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DeleteConnectorAttemptAction, ValidateConnectorAttemptAction, DownloadConnectorAction } from '../../store/connector-editor.actions';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { ConnectorCommandsService } from '../../services/commands/connector-commands.service';
import { SaveConnectorCommand } from '../../services/commands/save-connector.command';

describe('ConnectorHeaderComponent', () => {
    let fixture: ComponentFixture<ConnectorHeaderComponent>;
    let component: ConnectorHeaderComponent;
    let store: Store<AmaState>;

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
        store = TestBed.inject(Store);
        fixture.detectChanges();
    });

    it('should save event on save button click', () => {
        const commandService = TestBed.inject(ConnectorCommandsService);
        const emitSpy = spyOn(commandService, 'dispatchEvent');
        const button = fixture.debugElement.query(By.css('[data-automation-id="connector-editor-save-button"]'));
        button.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(emitSpy).toHaveBeenCalledWith(BasicModelCommands.save);
    });

    it('should disable save button when "disableSave" input is true', () => {
        component.disableSave = true;
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css('[data-automation-id="connector-editor-save-button"]:disabled'));

        expect(button).not.toBeNull();
    });

    it('should delete an connector on button click', () => {
        spyOn(store, 'dispatch');

        const dropdown = fixture.debugElement.query(By.css('[data-automation-id="connector-editor-menu-button"]'));
        dropdown.triggerEventHandler('click', null);

        const deleteButton = fixture.debugElement.query(By.css('[data-automation-id="connector-editor-delete-button"]'));
        deleteButton.triggerEventHandler('click', null);

        const payload = new OpenConfirmDialogAction({
            dialogData: {
                title: 'APP.DIALOGS.CONFIRM.DELETE.CONNECTOR'
            },
            action: new DeleteConnectorAttemptAction(component.modelId)
        });

        expect(store.dispatch).toHaveBeenCalledWith(payload);
    });

    it('clicking on download button should emit', () => {
        spyOn(store, 'dispatch');

        const button = fixture.debugElement.query(By.css('[data-automation-id="connector-editor-download-button"]'));
        button.triggerEventHandler('click', null);
        fixture.detectChanges();

        const payload = {
            title: 'APP.DIALOGS.CONFIRM.DOWNLOAD.CONNECTOR',
            modelId: component.modelId,
            modelContent: JSON.parse(component.content),
            action: new DownloadConnectorAction()
        };
        expect(store.dispatch).toHaveBeenCalledWith(new ValidateConnectorAttemptAction(payload));
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
