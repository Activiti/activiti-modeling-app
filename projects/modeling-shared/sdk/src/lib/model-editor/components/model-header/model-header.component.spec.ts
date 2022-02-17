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

import { CoreModule, TranslationMock, TranslationService } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { SharedModule } from '../../../helpers/shared.module';
import { BasicModelCommands } from '../../commands/commands.interface';
import { CommandButtonPriority, ShowCommandButton } from '../../services/command.model';
import { ModelCommandsService } from '../../services/model-commands.service';
import { MODEL_COMMAND_SERVICE_TOKEN } from '../model-editor/model-editors.token';
import { ModelHeaderComponent } from './model-header.component';

describe('ModelHeaderComponent', () => {
    const mockTestCommand = {execute() {}};

    const mockPrimaryButtons: ShowCommandButton[] = [
        {
            commandName: BasicModelCommands.save,
            title: 'Save',
            icon: 'save',
            priority: CommandButtonPriority.PRIMARY,
            isSvgIcon: false,
            action: mockTestCommand,
            disabled$: of(false),
            visible$: of(true)
        },
        {
            commandName: BasicModelCommands.validate,
            title: 'Validate',
            icon: 'done',
            priority: CommandButtonPriority.PRIMARY,
            isSvgIcon: false,
            action: mockTestCommand,
            disabled$: of(true),
            visible$: of(true)
        },
        {
            commandName: <BasicModelCommands> 'hidden-primary',
            title: 'Hidden primary',
            icon: 'delete',
            priority: CommandButtonPriority.PRIMARY,
            isSvgIcon: false,
            action: mockTestCommand,
            disabled$: of(false),
            visible$: of(false)
        }
    ];
    const mockSecondaryButtons = [
        {
            commandName: BasicModelCommands.delete,
            title: 'Delete',
            icon: 'delete',
            priority: CommandButtonPriority.SECONDARY,
            isSvgIcon: false,
            action: mockTestCommand,
            disabled$: of(false),
            visible$: of(false)
        },
        {
            commandName: <BasicModelCommands> 'hidden-secondary',
            title: 'Hidden secondary',
            icon: 'delete',
            priority: CommandButtonPriority.SECONDARY,
            isSvgIcon: false,
            action: mockTestCommand,
            disabled$: of(false),
            visible$: of(false)
        }
    ];

    const modelCommand =  {
        getCommandButtons: jest.fn().mockImplementation(command => {
            if (command === CommandButtonPriority.PRIMARY) {
                return mockPrimaryButtons;
            }
            return mockSecondaryButtons;
        }),
        setDisable: jest.fn().mockImplementation(() => of()),
        dispatchEvent: jest.fn().mockImplementation((value) => of()),
    };

    let fixture: ComponentFixture<ModelHeaderComponent>;
    let component: ModelHeaderComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                SharedModule,
                CoreModule,
                CommonModule,
                MatIconModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                MatIconTestingModule
            ],
            declarations: [
                ModelHeaderComponent
            ],
            providers: [
                ModelCommandsService,
                {
                    provide: MODEL_COMMAND_SERVICE_TOKEN,
                    useValue: modelCommand
                },
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
        fixture = TestBed.createComponent(ModelHeaderComponent);
        component = fixture.componentInstance;
        component.modelName = 'test';
        fixture.detectChanges();
    });

    it('should dispatch action event on primary button click', () => {
        const emitSpy = spyOn(modelCommand, 'dispatchEvent');
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css('[data-automation-id="test-editor-save-button"]'));
        button.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(emitSpy).toHaveBeenCalledWith(mockPrimaryButtons[0].commandName);
    });

    it('should disable the button when disabled is set to true', () => {
        const button = fixture.debugElement.query(By.css('[data-automation-id="test-editor-validate-button"]:disabled'));
        fixture.detectChanges();
        expect(button).not.toBeNull();
    });

    it('should hide the button when visibility is set to false', () => {
        const primaryHiddenButton = fixture.debugElement.query(By.css('[data-automation-id="test-editor-hidden-primary-button"]'));
        const secondaryHiddenButton = fixture.debugElement.query(By.css('[data-automation-id="test-editor-hidden-secondary-button"]'));
        fixture.detectChanges();
        expect(primaryHiddenButton).toBeNull();
        expect(secondaryHiddenButton).toBeNull();
    });

    it('should hide the menu button when all secondary buttons visibility is set to false', () => {
        const menuButton = fixture.debugElement.query(By.css('[data-automation-id="test-editor-menu-button"]'));
        fixture.detectChanges();
        expect(menuButton).toBeNull();
    });
});
