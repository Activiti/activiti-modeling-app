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
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, of } from 'rxjs';
import { VariablesComponent } from './variables.component';
import { CodeValidatorService } from './../code-editor/services/code-validator.service';
import { By } from '@angular/platform-browser';
import { INPUT_TYPE_ITEM_HANDLER } from './properties-viewer/value-type-inputs/value-type-inputs';

describe('VariablesComponent', () => {
    let fixture: ComponentFixture<VariablesComponent>;
    let component: VariablesComponent;

    const mockDialog = {
        close: jest.fn()
    };

    const mockData = {
        properties: '{}',
        propertiesUpdate$: new Subject()
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: CodeValidatorService, useValue: {validator: jest.fn()}},
                { provide: Store, useValue: { dispatch: jest.fn(), select: jest.fn().mockReturnValue(of())}},
                { provide: MatDialogRef, useValue: mockDialog },
                { provide: MAT_DIALOG_DATA, useValue: mockData },
                { provide: INPUT_TYPE_ITEM_HANDLER, useValue: [] }
            ],
            declarations: [VariablesComponent],
            imports: [FormsModule, NoopAnimationsModule, MatDialogModule, TranslateModule.forRoot()],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(VariablesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should have save button', () => {
        const button = fixture.nativeElement.querySelector('.save-btn');
        expect (button === null).toBeFalsy();
        expect(button.innerHTML.trim()).toEqual('APP.DIALOGS.UPDATE');
    });

    it('subject should next as expected when saved button is clicked', () => {
        spyOn(component.data.propertiesUpdate$, 'next');

        const data = {
            '123': {
                'id': '123',
                'name': 'test',
                'type': 'string',
                'required': false,
                'value': ''
            }
        };

        const result = {
            '123' : {
                'id': '123',
                'name': 'test',
                'type': 'string',
                'required': false,
                'value': ''
            }
        };

        component.editorContent = JSON.stringify(data, null, 2);
        const button = fixture.nativeElement.querySelector('.save-btn');
        button.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        expect(component.data.propertiesUpdate$.next).toHaveBeenCalledWith(result);
    });

    it('should set default value for json variable', () => {
        spyOn(component.data.propertiesUpdate$, 'next');

        const data = {
            '123': {
                'id': '123',
                'name': 'test',
                'type': 'json',
                'required': false,
            }
        };

        const expectedResult = {
            '123' : {
                'id': '123',
                'name': 'test',
                'type': 'json',
                'required': false,
                'value': {}
            }
        };

        component.editorContent = JSON.stringify(data, null, 2);
        const button = fixture.nativeElement.querySelector('.save-btn');
        button.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        expect(component.data.propertiesUpdate$.next).toHaveBeenCalledWith(expectedResult);
    });

    it('should validate unique variable names', () => {
        const data = {
            '123': {
                'id': '123',
                'name': 'test',
                'type': 'string',
                'required': false,
                'value': ''
            },
            '1234': {
                'id': '1234',
                'name': 'test',
                'type': 'string',
                'required': false,
                'value': ''
            }
        };

        component.editorContent = JSON.stringify(data, null, 2);
        const button = fixture.nativeElement.querySelector('.save-btn');
        button.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        expect(component.isSaveDisabled()).toBe(false);

        const validVariables = component.validateDuplicateVariable(JSON.parse(component.editorContent));
        expect(validVariables).toEqual(false);

        fixture.detectChanges();
        const errorMessageLabel = fixture.nativeElement.querySelector('.error-message');
        expect(errorMessageLabel).toBeDefined();
    });

    it('should clear filter input on click of clearFilterInput button', async () => {
        component.filterValue = 'var1';

        fixture.detectChanges();
        await fixture.whenStable();

        const clearFilterButton: HTMLElement = fixture.nativeElement.querySelector('[data-automation-id="variable-clear-filter"]');
        clearFilterButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.filterValue).toEqual('');
    });

    it('should set filterValue from input', () => {
        const input = fixture.debugElement.query(By.css('[data-automation-id="variable-filter"]'));
        input.triggerEventHandler('input', { target: { value: 'string'}});
        fixture.detectChanges();

        expect(component.filterValue).toEqual('string');
    });
});
