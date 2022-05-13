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
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ValueTypeInputComponent } from '../../value-type-input.component';
import { PropertiesViewerModeledObjectInputComponent } from './modeled-object-input.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { JSONSchemaToEntityPropertyService } from '../../../../services/json-schema-to-entity-property.service';
import { PropertiesViewerStringInputComponent } from '../string-input/string-input.component';
import { ModelingJSONSchemaService } from '../../../../services/modeling-json-schema.service';
import { CodeEditorService } from '../../../../code-editor/services/code-editor-service.service';
import { provideInputTypeItemHandler } from '../value-type-inputs';
import { provideModelingJsonSchemaProvider } from '../../../../services/modeling-json-schema-provider.service';
import { RegisteredInputsModelingJsonSchemaProvider } from '../../../../services/registered-inputs-modeling-json-schema-provider.service';
import { By } from '@angular/platform-browser';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PropertiesViewerArrayInputComponent } from '../array-input/array-input.component';
import { VariableValuePipe } from '../../variable-value.pipe';
import { AllowedCharactersDirective } from '../../../../helpers/directives/allowed-characters.directive';
import { Store } from '@ngrx/store';

describe('PropertiesViewerModeledObjectInputComponent', () => {
    let component: PropertiesViewerModeledObjectInputComponent;
    let fixture: ComponentFixture<PropertiesViewerModeledObjectInputComponent>;

    const model = {
        type: 'object',
        properties: {
            name: {
                type: 'string'
            }
        },
        required: ['name']
    };

    const value = { name: 'one' };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                FormsModule,
                ReactiveFormsModule,
                MatDialogModule,
                MatFormFieldModule,
                MatInputModule,
                TranslateModule.forRoot(),
                MatChipsModule,
                MatIconModule,
                MatAutocompleteModule
            ],
            declarations: [
                PropertiesViewerModeledObjectInputComponent,
                ValueTypeInputComponent,
                PropertiesViewerStringInputComponent,
                PropertiesViewerArrayInputComponent,
                VariableValuePipe,
                AllowedCharactersDirective
            ],
            providers: [
                FormBuilder,
                JSONSchemaToEntityPropertyService,
                ModelingJSONSchemaService,
                CodeEditorService,
                provideInputTypeItemHandler('string', PropertiesViewerStringInputComponent),
                provideModelingJsonSchemaProvider(RegisteredInputsModelingJsonSchemaProvider),
                provideInputTypeItemHandler('array', PropertiesViewerArrayInputComponent),
                { provide: TranslationService, useClass: TranslationMock },
                { provide: Store, useValue: { dispatch: jest.fn() } }
            ]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertiesViewerModeledObjectInputComponent);
        component = fixture.componentInstance;
    });

    describe('model is an object', () => {
        beforeEach(() => {
            component.value = value;
            component.model = model;
            component.ngOnChanges();
            fixture.detectChanges();
        });

        it('should build the form', () => {
            expect(component.objectForm.get('name').value).toEqual('one');
        });

        it('should set the disabled status', () => {
            expect(component.objectForm.get('name').disabled).toEqual(false);
        });

        it('should emit the value when it changes', async () => {
            spyOn(component.valueChanges, 'emit');

            component.objectForm.get('name').setValue('two');

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.valueChanges.emit).toHaveBeenCalledWith({ valid: true, value: { name: 'two' } });
        });

        it('should emit null value when is invalid', async () => {
            spyOn(component.valueChanges, 'emit');

            component.objectForm.get('name').setValue(null);

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.valueChanges.emit).toHaveBeenCalledWith({ valid: false, value: null });
        });

        it('should emit invalid when form is invalid', async () => {
            spyOn(component.valid, 'emit');

            component.objectForm.get('name').setValue(null);

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.valid.emit).toHaveBeenCalledWith(false);
        });

        it('should emit valid when form is valid', async () => {
            spyOn(component.valid, 'emit');

            component.objectForm.get('name').setValue('two');

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.valid.emit).toHaveBeenCalledWith(true);
        });
    });

    describe('model is an array', () => {
        beforeEach(() => {
            component.value = ['1', '2', '3'];
            component.model = {
                type: 'array',
                items: {
                    type: 'string'
                }
            };
            component.ngOnChanges();
            fixture.detectChanges();
        });

        it('should not display the form', () => {
            const form = fixture.debugElement.query(By.css('.ama-modeled-object'));
            const primitive = fixture.debugElement.query(By.css('.ama-modeled-object-primitive'));

            expect(form).toBeNull();
            expect(component.primitiveType).toEqual(['array']);
            expect(primitive).not.toBeNull();
        });

        it('should emit value when primitive value changes', async () => {
            spyOn(component.valueChanges, 'emit');

            component.primitiveTypeChanges(['1', '2', '3', 'test']);

            expect(component.value).toEqual(['1', '2', '3', 'test']);
            expect(component.valueChanges.emit).toHaveBeenCalledWith({ valid: true, value: ['1', '2', '3', 'test'] });
        });
    });

    describe('model references a primitive type', () => {
        beforeEach(() => {
            component.value = '123456';
            component.model = {
                type: 'string'
            };
            component.ngOnChanges();
            fixture.detectChanges();
        });

        it('should not display the form', () => {
            const form = fixture.debugElement.query(By.css('.ama-modeled-object'));
            const primitive = fixture.debugElement.query(By.css('.ama-modeled-object-primitive'));

            expect(form).toBeNull();
            expect(component.primitiveType).toEqual(['string']);
            expect(primitive).not.toBeNull();
        });

        it('should emit value when primitive value changes', async () => {
            spyOn(component.valueChanges, 'emit');

            component.primitiveTypeChanges('test');

            expect(component.value).toEqual('test');
            expect(component.valueChanges.emit).toHaveBeenCalledWith({ valid: true, value: 'test' });
        });
    });
});
