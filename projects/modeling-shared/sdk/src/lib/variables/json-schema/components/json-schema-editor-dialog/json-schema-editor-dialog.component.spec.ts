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
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { mockJsonSchema } from '../../mocks/json-schema-editor.mocks';
import { JsonSchemaEditorDialogComponent } from './json-schema-editor-dialog.component';

describe('JsonSchemaEditorDialogComponent', () => {
    let component: JsonSchemaEditorDialogComponent;
    let fixture: ComponentFixture<JsonSchemaEditorDialogComponent>;

    const mockDialog = {
        close: jasmine.createSpy('close'),
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                JsonSchemaEditorDialogComponent
            ],
            imports: [
                MatButtonModule,
                MatDialogModule,
                NoopAnimationsModule,
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
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
                }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        });

        fixture = TestBed.createComponent(JsonSchemaEditorDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('onCancel', () => {
        component.onCancel();

        expect(mockDialog.close).toHaveBeenCalled();
    });

    it('onSave', () => {
        component.changes = {
            node: {
                customProp: 'customValue',
                undefinedProperty: undefined,
                nullProperty: null, emptyProperty: ''
            },
            customAttributesDeleted: []
        };

        component.onSave();

        expect(mockDialog.close).toHaveBeenCalledWith({
            customAttributesDeleted: [],
            node: { customProp: 'customValue', undefinedProperty: undefined, nullProperty: null, emptyProperty: '' }
        });
    });
});
