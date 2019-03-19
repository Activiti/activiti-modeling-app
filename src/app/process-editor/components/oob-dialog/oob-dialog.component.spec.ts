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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { OobDialogComponent } from './oob-dialog.component';
import { AmaState } from 'ama-sdk/src/public_api';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatDialogRef } from '@angular/material';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';


describe('OobDialogComponent', () => {
    let component: OobDialogComponent;
    let fixture: ComponentFixture<OobDialogComponent>;
    let store: Store<AmaState>;

    const mockDialog = {
        close: jest.fn()
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), NoopAnimationsModule, MatDialogModule],
            declarations: [OobDialogComponent],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                { provide: Store, useValue: { dispatch: jest.fn() } },
                { provide: MatDialogRef, useValue: mockDialog }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OobDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        store = TestBed.get(Store);
    });

    it('should render component', () => {
        expect(component).not.toBeNull();
    });

    it('should render input placeholders', () => {
        const nameField = fixture.debugElement.query(By.css('[data-automation-id="name-field"]'));
        const instanceField = fixture.debugElement.query(By.css('[data-automation-id="instance-field"]'));
        expect(nameField.nativeElement.placeholder).toBe('APP.PROCESS_EDITOR.OOB_DIALOG.NAME');
        expect(instanceField.nativeElement.placeholder).toBe('APP.PROCESS_EDITOR.OOB_DIALOG.INSTANCE');
    });

    // it('should test submit button on create entity', () => {
    //     spyOn(store, 'dispatch');

    //     const submitBtn = fixture.debugElement.query(By.css('[data-automation-id="submit-button"]'));

    //     component.form.name = 'test-name';
    //     component.form.description = 'test-desc';
    //     fixture.detectChanges();

    //     submitBtn.triggerEventHandler('click', null);

    //     expect(store.dispatch).toHaveBeenCalledWith(new mockDialogData.action(component.form));
    // });

    // it('should render input values', () => {
    //     const mockValues = { id: 'id', name: 'name', description: 'desc' };
    //     component.data = { ...mockDialogData, values: mockValues };
    //     component.ngOnInit();
    //     fixture.detectChanges();

    //     expect(component.form.name).toBe(mockValues.name);
    //     expect(component.form.description).toBe(mockValues.description);
    // });

    // it('should test submit button on edit', () => {
    //     const mockValues = { id: 'id', name: 'name', description: 'desc' };
    //     component.data = { ...mockDialogData, values: mockValues };
    //     spyOn(store, 'dispatch');

    //     const submitBtn = fixture.debugElement.query(By.css('[data-automation-id="submit-button"]'));
    //     submitBtn.triggerEventHandler('click', null);

    //     expect(store.dispatch).toHaveBeenCalledWith(new mockDialogData.action({ id: mockValues.id, form: component.form }));
    // });

});
