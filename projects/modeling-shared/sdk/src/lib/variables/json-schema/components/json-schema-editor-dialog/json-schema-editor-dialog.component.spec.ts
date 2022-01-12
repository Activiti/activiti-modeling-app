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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { mockJsonSchema } from '../../mocks/json-schema-editor.mocks';
import { JsonSchemaEditorDialogComponent } from './json-schema-editor-dialog.component';
import { provideMockStore } from '@ngrx/store/testing';
import { provideInputTypeItemHandler } from '../../../properties-viewer/value-type-inputs/value-type-inputs';
import { PropertiesViewerStringInputComponent } from '../../../properties-viewer/value-type-inputs/string-input/string-input.component';
import { PropertiesViewerIntegerInputComponent } from '../../../properties-viewer/value-type-inputs/integer-input/integer-input.component';
import { ValueTypeInputComponent } from '../../../properties-viewer/value-type-input.component';
import { SharedModule } from '../../../../helpers/shared.module';

describe('JsonSchemaEditorDialogComponent', () => {
    let component: JsonSchemaEditorDialogComponent;
    let fixture: ComponentFixture<JsonSchemaEditorDialogComponent>;

    const mockDialog = {
        close: jasmine.createSpy('close'),
    };

    const emptyAttributesNode = { description: null, maxProperties: null, minProperties: null };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                JsonSchemaEditorDialogComponent,
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
                { provide: MatDialogRef, useValue: mockDialog },
                {
                    provide: MAT_DIALOG_DATA, useValue: {
                        value: { ...mockJsonSchema, customProp: 'customValue' },
                        typeAttributes: {
                            description: { name: 'Description', type: 'string' },
                            maxProperties: { name: 'Max. properties', type: 'integer' },
                            minProperties: { name: 'Min. properties', type: 'integer' }
                        }
                    }
                },
                provideInputTypeItemHandler('string', PropertiesViewerStringInputComponent),
                provideInputTypeItemHandler('integer', PropertiesViewerIntegerInputComponent),
            ]
        });

        fixture = TestBed.createComponent(JsonSchemaEditorDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should initialize values', () => {
        expect(component.node).toEqual({ ...emptyAttributesNode, customProp: 'customValue' });
        expect(component.customAttributesKeys).toEqual(['customProp']);
    });

    it('addCustomNode', () => {
        component.addCustomNode();

        expect(component.addProp).toEqual({ key: 'property_2', value: '' });
        expect(component.addingCustomProperty).toEqual(true);
    });

    it('deleteCustomNode', () => {
        component.deleteCustomNode('customProp');

        expect(component.node).toEqual(emptyAttributesNode);
        expect(component.customAttributesKeys).toEqual([]);
    });

    describe('confirmAddCustomNode', () => {
        it('null property', () => {
            component.confirmAddCustomNode();

            expect(component.node).toEqual({ ...emptyAttributesNode, customProp: 'customValue' });
            expect(component.customAttributesKeys).toEqual(['customProp']);
            expect(component.addProp).toEqual({ key: '', value: '' });
        });

        it('not null property', () => {
            component.addProp = { key: 'newProperty', value: '[ 1, 2, "3"]' };

            component.confirmAddCustomNode();

            expect(component.node).toEqual({ ...emptyAttributesNode, customProp: 'customValue', newProperty: [1, 2, '3'] });
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

        expect(component.node).toEqual({ ...emptyAttributesNode, customProp: [1, 2, '3'] });
    });

    it('onCancel', () => {
        component.onCancel();

        expect(mockDialog.close).toHaveBeenCalled();
    });

    it('onSave', () => {
        component.node = { customProp: 'customValue', undefinedProperty: undefined, nullProperty: null, emptyProperty: '' };

        component.onSave();

        expect(mockDialog.close).toHaveBeenCalledWith({
            customAttributesDeleted: [],
            node: { customProp: 'customValue', undefinedProperty: undefined, nullProperty: null, emptyProperty: '' }
        });
    });
});
