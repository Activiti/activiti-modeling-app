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
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { JSONSchemaInfoBasics } from '../../../../api/types';
import { SharedModule } from '../../../../helpers/shared.module';
import { ModelingJSONSchemaService } from '../../../../services/modeling-json-schema.service';
import { expectedDefinitions, expectedProperties, hierarchy, mockJsonSchema } from '../../mocks/json-schema-editor.mocks';
import { DisplayAddMenuPipe } from '../../pipes/display-add-menu/display-add-menu.pipe';
import { IsAnyTypePipe } from '../../pipes/is-any-type-pipe/is-any-type.pipe';
import { IsNotTypePipe } from '../../pipes/is-not-type-pipe/is-not-type.pipe';
import { RequiredPipe } from '../../pipes/required-pipe/required.pipe';
import { JsonSchemaEditorDialogComponent } from '../json-schema-editor-dialog/json-schema-editor-dialog.component';
import { AccessorPipe } from './accessor.pipe';
import { JsonSchemaEditorComponent } from './json-schema-editor.component';

describe('JsonSchemaEditorComponent', () => {
    let component: JsonSchemaEditorComponent;
    let fixture: ComponentFixture<JsonSchemaEditorComponent>;
    let dialog: MatDialog;

    let mockSchema: JSONSchemaInfoBasics;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                JsonSchemaEditorComponent,
                JsonSchemaEditorDialogComponent,
                RequiredPipe,
                IsAnyTypePipe,
                IsNotTypePipe,
                DisplayAddMenuPipe,
                AccessorPipe
            ],
            imports: [
                CommonModule,
                MatCheckboxModule,
                MatFormFieldModule,
                MatIconModule,
                MatSelectModule,
                MatInputModule,
                MatTooltipModule,
                MatButtonModule,
                MatSlideToggleModule,
                MatMenuModule,
                FormsModule,
                ReactiveFormsModule,
                MatDialogModule,
                NoopAnimationsModule,
                TranslateModule.forRoot(),
                SharedModule
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                {
                    provide: ModelingJSONSchemaService,
                    useValue: {
                        getPropertyTypeItems: () => of(hierarchy)
                    }
                },
                provideMockStore({}),
            ]
        });

        fixture = TestBed.createComponent(JsonSchemaEditorComponent);
        component = fixture.componentInstance;

        component.writeValue({ type: 'object' });
        fixture.detectChanges();

        dialog = TestBed.inject(MatDialog);

        mockSchema = deepCopy(mockJsonSchema);
        spyOn(component.changes, 'emit');
    });

    it('should init properties from JSON schema', () => {
        component.writeValue(mockSchema);

        expect(component.properties).toEqual(expectedProperties);
    });

    it('should init type', () => {
        expect(component.type).toEqual(['object']);
    });

    describe('getDefinitionsInSchema', () => {

        it('should getDefinitionsInSchema when depth is 0', () => {
            const definitions = [{ accessor: '#/$defs/mock', key: 'mock', definition: { type: 'number' } }];
            component.depth = 0;
            component.definitions = definitions;

            component.writeValue(mockSchema);
            expect(component.definitions).toEqual(expectedDefinitions);
        });

        it('should not retrieve definitions when depth is not 0', () => {
            const definitions = [{ accessor: '#/$defs/mock', key: 'mock', definition: { type: 'number' } }];
            component.depth = 1;
            component.definitions = definitions;

            component.writeValue(mockSchema);

            expect(component.definitions).toEqual(definitions);
        });

    });

    it('onAddProperty', () => {

        const expectedProperty = { key: 'root_0', definition: {} };
        const expectedValue = { type: 'object', properties: { [expectedProperty.key]: expectedProperty.definition } };

        component.collapsed = true;
        component.onAddProperty();

        expect(component.value).toEqual(expectedValue);
        expect(component.collapsed).toEqual(false);
        expect(component.properties).toEqual([expectedProperty]);
        expect(component.changes.emit).toHaveBeenCalledWith(expectedValue);
    });

    it('onAddDefinition', () => {

        const expectedDefinition = { key: 'definition_0', accessor: '#/$defs/definition_0', definition: { type: 'object', title: '' } };
        const expectedValue = { type: 'object', $defs: { [expectedDefinition.key]: expectedDefinition.definition } };

        component.definitionsCollapsed = true;
        component.onAddDefinition();

        expect(component.value).toEqual(expectedValue);
        expect(component.definitionsCollapsed).toEqual(false);
        expect(component.definitions).toEqual([expectedDefinition]);
        expect(component.changes.emit).toHaveBeenCalledWith(expectedValue);
    });

    it('onAddChild', () => {
        component.writeValue({ anyOf: [] });

        const expectedValue = { anyOf: [{ type: 'object' }] };

        component.collapsed = true;
        component.onAddChild('anyOf');

        expect(component.collapsed).toEqual(false);
        expect(component.value).toEqual(expectedValue);
        expect(component.changes.emit).toHaveBeenCalledWith(expectedValue);
    });

    it('onRemoveNode', () => {
        spyOn(component.propertyDeleted, 'emit');

        component.onRemoveNode();

        expect(component.propertyDeleted.emit).toHaveBeenCalledWith('root');
    });

    describe('onTypeChanges', () => {
        beforeEach(() => {
            component.writeValue({ anyOf: [], type: 'object', properties: { prop: { type: 'string' } } });
        });

        it('select type', () => {

            const event = { isUserInput: true, source: { value: 'enum', selected: true } };
            const expectedValue = { anyOf: [], type: 'object', properties: { prop: { type: 'string' } }, enum: [] };
            const expectedProps = [{ key: 'prop', definition: { type: 'string' } }];

            component.onTypeChanges(event as any);

            expect(component.value).toEqual(expectedValue);
            expect(component.properties).toEqual(expectedProps);
            expect(component.changes.emit).toHaveBeenCalledWith(expectedValue);
        });

        it('deselect type', () => {

            const event = { isUserInput: true, source: { value: 'object', selected: false } };
            const expectedValue = { anyOf: [] };
            const expectedProps: any[] = [];

            component.onTypeChanges(event as any);

            expect(component.value).toEqual(expectedValue);
            expect(component.properties).toEqual(expectedProps);
            expect(component.changes.emit).toHaveBeenCalledWith(expectedValue);
        });
    });

    it('onPropertyDeleted', () => {
        const expectedValue = deepCopy(mockJsonSchema);
        delete (<any>expectedValue.properties)['appId'];
        expectedValue.required = ['name', 'createDate'];
        const expectedProps = deepCopy(expectedProperties);
        expectedProps.splice(1, 1);

        component.writeValue(mockSchema);

        component.onPropertyDeleted('appId');

        expect(component.value).toEqual(expectedValue);
        expect(component.properties).toEqual(expectedProps);
        expect(component.changes.emit).toHaveBeenCalledWith(expectedValue);
    });

    it('onDefinitionDeleted', () => {

        const expectedValue = deepCopy(mockJsonSchema);
        delete (<any>expectedValue.$defs)['date'];
        const expectedDefs: any[] = [];

        component.writeValue(mockSchema);

        component.onDefinitionDeleted('date');

        expect(component.value).toEqual(expectedValue);
        expect(component.definitions).toEqual(expectedDefs);
        expect(component.changes.emit).toHaveBeenCalledWith(expectedValue);
    });

    it('onCheck', () => {
        const expectedValue = { key: 'root', value: true };
        spyOn(component.requiredChanges, 'emit');

        component.onCheck({ checked: true } as any);

        expect(component.requiredChanges.emit).toHaveBeenCalledWith(expectedValue);
    });

    describe('onRequiredChanges', () => {
        it('uncheck', () => {
            component.writeValue(mockSchema);
            const expectedValue = deepCopy(mockJsonSchema);
            expectedValue.required = ['name', 'createDate'];

            component.onRequiredChanges({ key: 'appId', value: false });

            expect(component.value).toEqual(expectedValue);
            expect(component.changes.emit).toHaveBeenCalledWith(expectedValue);
        });

        it('check', () => {
            const schema = deepCopy(mockJsonSchema);
            schema.required = ['name', 'createDate'];
            component.writeValue({ ...mockSchema, required: ['name', 'createDate'] });

            component.onRequiredChanges({ key: 'appId', value: true });

            expect(component.value).toEqual({ ...mockSchema, required: ['name', 'createDate', 'appId'] });
            expect(component.changes.emit).toHaveBeenCalledWith({ ...mockSchema, required: ['name', 'createDate', 'appId'] });
        });
    });

    it('onChangeName', () => {
        component.writeValue(mockSchema);
        spyOn(component.nameChanges, 'emit');

        component.onChangeName({ target: { value: 'appIdentifier' } });

        expect(component.key = 'appIdentifier');
        expect(component.nameChanges.emit).toHaveBeenCalledWith({ oldName: 'root', newName: 'appIdentifier' });
        expect(component.changes.emit).toHaveBeenCalledWith(mockSchema);
    });

    it('onNameChanges', () => {
        component.writeValue(mockSchema);
        const expectedValue = deepCopy(mockJsonSchema);
        (<any>expectedValue.properties)['appIdentifier'] = expectedValue.properties.appId;
        delete (<any>expectedValue.properties)['appId'];
        expectedValue.required = ['name', 'appIdentifier', 'createDate'];

        const expectedProps = deepCopy(expectedProperties);
        expectedProps[1].key = 'appIdentifier';

        component.onNameChanges({ oldName: 'appId', newName: 'appIdentifier' });

        expect(component.value).toEqual(expectedValue);
        expect(component.properties).toEqual(expectedProps);
        expect(component.changes.emit).toHaveBeenCalledWith(expectedValue);
    });

    it('onDefinitionNameChanges', () => {
        component.writeValue(mockSchema);
        const expectedValue = deepCopy(mockJsonSchema);
        (<any>expectedValue.$defs)['datetime'] = expectedValue.$defs.date;
        delete (<any>expectedValue.$defs)['date'];

        const expectedDefs = deepCopy(expectedDefinitions);
        expectedDefs[0].key = 'datetime';
        expectedDefs[0].accessor = '#/$defs/datetime';

        component.onDefinitionNameChanges({ oldName: 'date', newName: 'datetime' });

        expect(component.value).toEqual(expectedValue);
        expect(component.definitions).toEqual(expectedDefs);
        expect(component.changes.emit).toHaveBeenCalledWith(expectedValue);
    });

    it('onChanges', () => {
        component.onChanges();

        expect(component.changes.emit).toHaveBeenCalledWith({ type: 'object' });
    });

    describe('onSettings', () => {
        it('should open the dialog', () => {
            spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of({}) } as any);
            const expectedArguments = {
                data: {
                    value: { type: 'object' },
                    allowAttributesPreview: true,
                    allowCustomAttributes: true,
                    accessor: ['root'],
                    schema: { type: 'object' }
                },
                minWidth: '520px'
            };

            component.onSettings();

            expect(dialog.open).toHaveBeenCalledWith(JsonSchemaEditorDialogComponent, expectedArguments);
        });
    });

    describe('hierarchy', () => {

        let spy;

        beforeEach(async () => {
            spy = spyOn<any>(component, 'initHierarchy');
            await fixture.whenStable();
        });

        it('should get hierarchy for depth 0', () => {
            component.depth = 0;

            component.writeValue({ description: 'should call init hierarchy' });

            expect(spy).toHaveBeenCalled();
        });

        it('should get hierarchy for depth greater than 0', () => {
            component.depth = 1;

            component.writeValue({ description: 'should not call init hierarchy' });

            expect(spy).not.toHaveBeenCalled();
        });
    });

});

function deepCopy(obj: any): any {
    let copy;

    if (null == obj || 'object' !== typeof obj) {
        return obj;
    }

    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    if (obj instanceof Array) {
        copy = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepCopy(obj[i]);
        }
        return copy;
    }

    if (obj instanceof Object) {
        copy = {};
        for (const attr in obj) {
            // eslint-disable-next-line no-prototype-builtins
            if (obj.hasOwnProperty(attr)) {
                (<any>copy)[attr] = deepCopy(obj[attr]);
            }
        }
        return copy;
    }
}
