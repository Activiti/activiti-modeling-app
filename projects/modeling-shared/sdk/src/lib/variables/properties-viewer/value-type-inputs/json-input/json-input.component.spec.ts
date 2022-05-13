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

import { TranslationMock, TranslationService } from '@alfresco/adf-core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { CodeEditorService } from '../../../../code-editor/services/code-editor-service.service';
import { AllowedCharactersDirective } from '../../../../helpers/directives/allowed-characters.directive';
import { JSONSchemaToEntityPropertyService } from '../../../../services/json-schema-to-entity-property.service';
import { provideModelingJsonSchemaProvider } from '../../../../services/modeling-json-schema-provider.service';
import { ModelingJSONSchemaService } from '../../../../services/modeling-json-schema.service';
import { RegisteredInputsModelingJsonSchemaProvider } from '../../../../services/registered-inputs-modeling-json-schema-provider.service';
import { ValueTypeInputComponent } from '../../value-type-input.component';
import { VariableValuePipe } from '../../variable-value.pipe';
import { PropertiesViewerArrayInputComponent } from '../array-input/array-input.component';
import { PropertiesViewerStringInputComponent } from '../string-input/string-input.component';
import { provideInputTypeItemHandler } from '../value-type-inputs';
import { PropertiesViewerJsonInputComponent } from './json-input.component';

describe('PropertiesViewerJsonInputComponent', () => {
    let component: PropertiesViewerJsonInputComponent;
    let fixture: ComponentFixture<PropertiesViewerJsonInputComponent>;

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
                PropertiesViewerJsonInputComponent,
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
                { provide: TranslationService, useClass: TranslationMock },
                { provide: Store, useValue: { dispatch: jest.fn() } },
                provideModelingJsonSchemaProvider(RegisteredInputsModelingJsonSchemaProvider)
            ]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertiesViewerJsonInputComponent);
        component = fixture.componentInstance;
    });

    describe('should emit null when value is not valid', () => {
        beforeEach(() => {
            spyOn(component.change, 'emit');
            component.onValidChanges(false);
        });

        it('object', () => {
            component.onChange('{ "a": "b" }');
            expect(component.change.emit).toHaveBeenCalledWith(null);
        });

        it('integer', () => {
            component.onChange('1');
            expect(component.change.emit).toHaveBeenCalledWith(null);
        });

        it('string', () => {
            component.onChange('a');
            expect(component.change.emit).toHaveBeenCalledWith(null);
        });

        it('boolean', () => {
            component.onChange('true');
            expect(component.change.emit).toHaveBeenCalledWith(null);
        });

        it('array', () => {
            component.onChange('[1, 2, 3]');
            expect(component.change.emit).toHaveBeenCalledWith(null);
        });
    });

    describe('should emit the object stringified when value is valid', () => {
        beforeEach(() => {
            spyOn(component.change, 'emit');
            component.onValidChanges(true);

        });

        it('object', () => {
            component.onChange('{ "a": "b" }');
            expect(component.change.emit).toHaveBeenCalledWith({ a: 'b' });
        });

        it('integer', () => {
            component.onChange('1');
            expect(component.change.emit).toHaveBeenCalledWith(1);
        });

        it('string', () => {
            component.onChange('a');
            expect(component.change.emit).toHaveBeenCalledWith('a');
        });

        it('boolean', () => {
            component.onChange('true');
            expect(component.change.emit).toHaveBeenCalledWith(true);
        });

        it('array', () => {
            component.onChange('[1, 2, 3]');
            expect(component.change.emit).toHaveBeenCalledWith([1, 2, 3]);
        });

        it('undefined', () => {
            component.onChange(undefined);
            expect(component.change.emit).toHaveBeenCalledWith('');
        });
    });

    describe('should emit the modeled object stringified when is valid', () => {
        beforeEach(() => {
            spyOn(component.change, 'emit');
            component.onValidChanges(true);
        });

        it('object', () => {
            component.onModeledObjectChanges({ valid: true, value: { a: 'b' } });
            expect(component.change.emit).toHaveBeenCalledWith({ a: 'b' });
        });

        it('integer', () => {
            component.onModeledObjectChanges({ valid: true, value: 1 });
            expect(component.change.emit).toHaveBeenCalledWith(1);
        });

        it('string', () => {
            component.onModeledObjectChanges({ valid: true, value: 'a' });
            expect(component.change.emit).toHaveBeenCalledWith('a');
        });

        it('boolean', () => {
            component.onModeledObjectChanges({ valid: true, value: true });
            expect(component.change.emit).toHaveBeenCalledWith(true);
        });

        it('array', () => {
            component.onModeledObjectChanges({ valid: true, value: [1, 2, 3] });
            expect(component.change.emit).toHaveBeenCalledWith([1, 2, 3]);
        });
    });

    it('should not use the modeled object if model is referencing the primitive JSON schema', () => {
        component.model = null;
        expect(component.isPrimitiveJSONInput).toEqual(true);

        component.model = {};
        expect(component.isPrimitiveJSONInput).toEqual(true);

        component.model = { $ref: '#/$defs/primitive/file' };
        expect(component.isPrimitiveJSONInput).toEqual(false);

        component.model = { $ref: '#/$defs/primitive/json' };
        expect(component.isPrimitiveJSONInput).toEqual(true);
    });

    describe('should transform to string', () => {
        it('null', () => {
            component.value = null;
            component.ngOnChanges();

            expect(component.stringValue).toBe('');
        });

        it('number', () => {
            component.value = 123;
            component.ngOnChanges();

            expect(component.stringValue).toBe('123');
        });

        it('string', () => {
            component.value = 'a';
            component.ngOnChanges();

            expect(component.stringValue).toBe('a');
        });

        it('boolean', () => {
            component.value = true;
            component.ngOnChanges();

            expect(component.stringValue).toBe('true');
        });
    });
});
