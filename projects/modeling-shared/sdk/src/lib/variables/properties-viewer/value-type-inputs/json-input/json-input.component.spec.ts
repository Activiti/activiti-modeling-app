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

import { TranslateModule } from '@ngx-translate/core';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ValueTypeInputComponent } from '../../value-type-input.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { JSONSchemaToEntityPropertyService } from '../../../../services/json-schema-to-entity-property.service';
import { PropertiesViewerStringInputComponent } from '../string-input/string-input.component';
import { ModelingJSONSchemaService } from '../../../../services/modeling-json-schema.service';
import { CodeEditorService } from '../../../../code-editor/services/code-editor-service.service';
import { provideInputTypeItemHandler } from '../value-type-inputs';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PropertiesViewerArrayInputComponent } from '../array-input/array-input.component';
import { VariableValuePipe } from '../../variable-value.pipe';
import { AllowedCharactersDirective } from '../../../../helpers/directives/allowed-characters.directive';
import { Store } from '@ngrx/store';
import { PropertiesViewerJsonInputComponent } from './json-input.component';
import { UseModeledObjectPipe } from './use-modeled-object.pipe';
import { RegisteredInputsModelingJsonSchemaProvider } from '../../../../services/registered-inputs-modeling-json-schema-provider.service';
import { provideModelingJsonSchemaProvider } from '../../../../services/modeling-json-schema-provider.service';

describe('PropertiesViewerJsonInputComponent', () => {
    let component: PropertiesViewerJsonInputComponent;
    let fixture: ComponentFixture<PropertiesViewerJsonInputComponent>;

    beforeEach(async(() => {
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
                AllowedCharactersDirective,
                UseModeledObjectPipe
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
        }).compileComponents();
    }));

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
    });

    describe('should emit the modeled object stringified when is valid', () => {
        beforeEach(() => {
            spyOn(component.change, 'emit');
            component.onValidChanges(true);
        });

        it('object', () => {
            component.onModeledObjectChanges({ a: 'b' });
            expect(component.change.emit).toHaveBeenCalledWith({ a: 'b' });
        });

        it('integer', () => {
            component.onModeledObjectChanges(1);
            expect(component.change.emit).toHaveBeenCalledWith(1);
        });

        it('string', () => {
            component.onModeledObjectChanges('a');
            expect(component.change.emit).toHaveBeenCalledWith('a');
        });

        it('boolean', () => {
            component.onModeledObjectChanges(true);
            expect(component.change.emit).toHaveBeenCalledWith(true);
        });

        it('array', () => {
            component.onModeledObjectChanges([1, 2, 3]);
            expect(component.change.emit).toHaveBeenCalledWith([1, 2, 3]);
        });
    });
});
