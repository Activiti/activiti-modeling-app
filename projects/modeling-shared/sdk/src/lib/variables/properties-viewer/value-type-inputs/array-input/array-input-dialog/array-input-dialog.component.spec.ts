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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { ArrayInputDialogComponent } from './array-input-dialog.component';
import { PropertiesViewerModeledObjectInputComponent } from '../../modeled-object/modeled-object-input.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValueTypeInputComponent } from '../../../value-type-input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PropertiesViewerStringInputComponent } from '../../string-input/string-input.component';
import { provideInputTypeItemHandler } from '../../value-type-inputs';
import { CodeEditorService } from '../../../../../code-editor/services/code-editor-service.service';
import { JSONSchemaToEntityPropertyService } from '../../../../../services/json-schema-to-entity-property.service';
import { ModelingJSONSchemaService } from './../../../../../services/modeling-json-schema.service';
import { provideModelingJsonSchemaProvider } from '../../../../../services/modeling-json-schema-provider.service';
import { RegisteredInputsModelingJsonSchemaProvider } from '../../../../../services/registered-inputs-modeling-json-schema-provider.service';

describe('ArrayInputDialogComponent', () => {
    let fixture: ComponentFixture<ArrayInputDialogComponent>;
    let component: ArrayInputDialogComponent;

    const model = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        },
        required: ['name']
    };

    const mockDialogDataEdit = {
        title: 'SDK.VARIABLE_TYPE_INPUT.ARRAY_INPUT.EDIT_VALUE',
        model: model,
        disabled: false,
        value: { name: 'one' }
    };

    const mockDialogDataCreate = {
        title: 'SDK.VARIABLE_TYPE_INPUT.ARRAY_INPUT.VALUE_TO_ADD_TO_ARRAY',
        model: model,
        disabled: false
    };

    const mockDialog = {
        close: jest.fn()
    };

    function setUpTestBed(customMockDialogData) {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                FormsModule,
                ReactiveFormsModule,
                MatDialogModule,
                MatFormFieldModule,
                MatInputModule,
                TranslateModule.forRoot()],
            declarations: [ArrayInputDialogComponent, PropertiesViewerModeledObjectInputComponent, ValueTypeInputComponent, PropertiesViewerStringInputComponent],
            providers: [
                FormBuilder,
                JSONSchemaToEntityPropertyService,
                ModelingJSONSchemaService,
                CodeEditorService,
                provideInputTypeItemHandler('string', PropertiesViewerStringInputComponent),
                provideModelingJsonSchemaProvider(RegisteredInputsModelingJsonSchemaProvider),
                { provide: MatDialogRef, useValue: mockDialog },
                { provide: MAT_DIALOG_DATA, useValue: customMockDialogData },
                { provide: TranslationService, useClass: TranslationMock }
            ]
        });
    }

    describe('Creating', () => {
        beforeEach(() => {
            setUpTestBed(mockDialogDataCreate);
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(ArrayInputDialogComponent);
            component = fixture.componentInstance;
            component.ngOnInit();
            fixture.detectChanges();
        });

        it('should be invalid when creating', () => {
            expect(component.valid).toEqual(false);
        });

        it('should value be empty when creating', () => {
            expect(component.value).toEqual({});
        });

        it('should update the value when changes', () => {
            component.onValueChanges({ value: { name: 'two' }, valid: true });
            expect(component.value).toEqual({ name: 'two' });
        });

        it('should update valid status when changes', () => {
            component.onValidChanges(true);
            expect(component.valid).toEqual(true);
        });
    });

    describe('Editing', () => {
        beforeEach(() => {
            setUpTestBed(mockDialogDataEdit);
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(ArrayInputDialogComponent);
            component = fixture.componentInstance;
            component.ngOnInit();
            fixture.detectChanges();
        });

        it('should be invalid when creating', () => {
            expect(component.valid).toEqual(true);
        });

        it('should value be set when editing', () => {
            expect(component.value).toEqual({ name: 'one' });
        });

        it('should update the value when changes', () => {
            component.onValueChanges({ value: { name: 'two' }, valid: true });
            expect(component.value).toEqual({ name: 'two' });
        });

        it('should update valid status when changes', () => {
            component.onValidChanges(false);
            expect(component.valid).toEqual(false);
        });
    });
});
