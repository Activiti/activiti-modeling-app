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

import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../../helpers/shared.module';
import { ValueTypeInputComponent } from '../../../properties-viewer/value-type-input.component';
import { PropertiesViewerIntegerInputComponent } from '../../../properties-viewer/value-type-inputs/integer-input/integer-input.component';
import { PropertiesViewerStringInputComponent } from '../../../properties-viewer/value-type-inputs/string-input/string-input.component';
import { provideInputTypeItemHandler } from '../../../properties-viewer/value-type-inputs/value-type-inputs';
import { mockJsonSchema } from '../../mocks/json-schema-editor.mocks';
import { DataModelCustomizer } from '../../services/data-model-customization';
import { JsonSchemaEditorService } from '../../services/json-schema-editor.service';

import { JsonSchemaNodeSettingsComponent } from './json-schema-node-settings.component';

describe('JsonSchemaNodeSettingsComponent', () => {
    let component: JsonSchemaNodeSettingsComponent;
    let fixture: ComponentFixture<JsonSchemaNodeSettingsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                JsonSchemaNodeSettingsComponent,
                PropertiesViewerStringInputComponent,
                PropertiesViewerIntegerInputComponent,
                ValueTypeInputComponent
            ],
            imports: [
                CommonModule,
                CoreModule,
                SharedModule,
                MatFormFieldModule,
                MatIconModule,
                MatSelectModule,
                MatInputModule,
                MatTooltipModule,
                MatButtonModule,
                MatSlideToggleModule,
                MatDialogModule,
                FormsModule,
                ReactiveFormsModule,
                NoopAnimationsModule,
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                provideMockStore({}),
                {
                    provide: JsonSchemaEditorService,
                    useValue: {
                        advancedAttr: () => ({
                            description: { name: 'Description', type: 'string' },
                            maxProperties: { name: 'Max. properties', type: 'integer' },
                            minProperties: { name: 'Min. properties', type: 'integer' }
                        }),
                        getProtectedAttributesForDataModelType: () => DataModelCustomizer.PROTECTED_ATTRIBUTES
                    }
                },
                provideInputTypeItemHandler('string', PropertiesViewerStringInputComponent),
                provideInputTypeItemHandler('integer', PropertiesViewerIntegerInputComponent),
            ]
        });

        fixture = TestBed.createComponent(JsonSchemaNodeSettingsComponent);
        component = fixture.componentInstance;
        component.value = { ...mockJsonSchema, customProp: 'customValue' };
        component.ngOnChanges();
        fixture.detectChanges();
    });

    it('should initialize values', () => {
        expect(component.customAttributesKeys).toEqual(['customProp']);
        expect(component.typeAttributes).toEqual({
            description: { name: 'Description', type: 'string' },
            maxProperties: { name: 'Max. properties', type: 'integer' },
            minProperties: { name: 'Min. properties', type: 'integer' }
        });
    });

    it('addCustomNode', () => {
        component.addCustomNode();

        expect(component.addProp).toEqual({ key: 'property_2', value: '' });
        expect(component.addingCustomProperty).toEqual(true);
    });

    it('deleteCustomNode', () => {
        component.deleteCustomNode('customProp');

        expect(component.value).toEqual(mockJsonSchema);
        expect(component.customAttributesKeys).toEqual([]);
    });

    describe('confirmAddCustomNode', () => {
        it('null property', () => {
            component.confirmAddCustomNode();

            expect(component.value).toEqual({ ...mockJsonSchema, customProp: 'customValue' });
            expect(component.customAttributesKeys).toEqual(['customProp']);
            expect(component.addProp).toEqual({ key: '', value: '' });
        });

        it('not null property', () => {
            component.addProp = { key: 'newProperty', value: '[ 1, 2, "3"]' };

            component.confirmAddCustomNode();

            expect(component.value).toEqual({ ...mockJsonSchema, customProp: 'customValue', newProperty: [1, 2, '3'] });
            expect(component.customAttributesKeys).toEqual(['customProp', 'newProperty']);
            expect(component.addProp).toEqual({ key: '', value: '' });
        });
    });

    it('initializeCustomProperty', () => {
        component.addProp = { key: 'newProperty', value: '[ 1, 2, "3"]' };

        component.initializeCustomProperty();

        expect(component.addProp).toEqual({ key: '', value: '' });
    });

    it('changeCustomProperty should parse the string as object', () => {
        component.changeCustomProperty('customProp', { target: { value: '[ 1, 2, "3"]' } });

        expect(component.value).toEqual({ ...mockJsonSchema, customProp: [1, 2, '3'] });
    });
});
