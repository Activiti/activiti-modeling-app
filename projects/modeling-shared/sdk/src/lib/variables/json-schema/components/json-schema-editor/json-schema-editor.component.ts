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

/* eslint-disable max-lines */

import { Component, Input, forwardRef, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ChildrenDeletedEvent, JSONSchemaDefinition, JSONSchemaEditorDialogData, TYPES } from '../../models/model';
import { JsonSchemaEditorDialogComponent } from '../json-schema-editor-dialog/json-schema-editor-dialog.component';
import { JsonSchemaEditorService } from '../../services/json-schema-editor.service';
import { JSONSchemaInfoBasics } from '../../../../api/types';
import { PropertyTypeItem } from '../../../../variables/properties-viewer/property-type-item/models';
import { Observable } from 'rxjs';
import { MODELER_NAME_REGEX } from '../../../../helpers/utils/create-entries-names';

@Component({
    selector: 'modelingsdk-json-schema-editor',
    templateUrl: './json-schema-editor.component.html',
    styleUrls: ['./json-schema-editor.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => JsonSchemaEditorComponent),
        multi: true
    }]
})
export class JsonSchemaEditorComponent implements ControlValueAccessor {

    @Input() value: JSONSchemaInfoBasics = {};
    @Input() key = 'root';
    @Input() depth = 0;
    @Input() blockedNode = false;
    @Input() required = false;
    @Input() lastChild = false;
    @Input() enableKeyEdition = false;
    @Input() displayRequired = true;
    @Input() filteredReferences: string[] = [];
    @Input() hierarchy: Observable<PropertyTypeItem[]>;
    @Input() compositionIndex = -1;
    @Output() changes = new EventEmitter<JSONSchemaInfoBasics>();
    @Output() propertyDeleted = new EventEmitter<string>();
    @Output() childrenDeleted = new EventEmitter<ChildrenDeletedEvent>();
    @Output() requiredChanges = new EventEmitter<{ key: string; value: boolean }>();
    @Output() nameChanges = new EventEmitter<{ oldName: string; newName: string }>();

    readonly typeNames = TYPES;

    properties: { key: string; definition: JSONSchemaInfoBasics }[] = [];
    definitions: JSONSchemaDefinition[] = [];
    collapsed = false;
    definitionsCollapsed = false;
    type: string[] = [];

    constructor(private jsonSchemaEditorService: JsonSchemaEditorService, private dialog: MatDialog) { }

    get regex(): RegExp {
        if (this.enableKeyEdition) {
            return /^[a-z]([-a-z0-9]{0,24}[-a-z0-9])?$/;
        } else {
            return /^(\w|\$)(\w|\$|-|_)*$/;
        }
    }

    private onChange: any = () => { };
    private onTouched: any = () => { };

    writeValue(value: JSONSchemaInfoBasics) {
        if (JSON.stringify(this.value) === '{}' || JSON.stringify(value) !== JSON.stringify(this.value)) {
            this.value = value || { type: 'object' };
            this.type = this.jsonSchemaEditorService.getTypes(this.value);
            this.initProperties();
            this.getDefinitionsInSchema();
        }
    }

    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    private initProperties() {
        this.properties = [];

        if (this.value.properties) {
            Object.keys(this.value.properties).forEach(key => this.properties.push({ key, definition: this.value.properties?.[key] }));
        }
    }

    private getDefinitionsInSchema() {
        if (this.depth === 0) {
            this.definitions = this.jsonSchemaEditorService.getDefinitions('#/$defs', this.value?.$defs);
            this.initHierarchy();
        }
    }

    private initHierarchy() {
        this.hierarchy = this.jsonSchemaEditorService.initHierarchy(this.definitions, this.filteredReferences);
    }

    onAddProperty() {
        this.value.properties = this.value.properties || {};
        const name = this.generateName(this.key, this.properties.length);
        this.value.properties[name] = {};
        this.initProperties();
        this.collapsed = false;
        this.onChanges();
    }

    onAddDefinition() {
        this.value.$defs = this.value.$defs || {};
        const name = this.generateName('definition', Object.keys(this.value.$defs).length);
        this.value.$defs[name] = { type: 'object', title: '' };
        this.getDefinitionsInSchema();
        this.definitionsCollapsed = false;
        this.onChanges();
    }

    onAddChild(type: string) {
        const accessor = type;

        if (!(<any>this.value)[accessor]) {
            (<any>this.value)[accessor] = [];
        }
        (<any>this.value)[accessor].push({ type: 'object' });

        this.collapsed = false;
        this.onChanges();
    }

    private generateName(prefix, length: number): string {
        return `${prefix}_${length}`;
    }

    onRemoveNode() {
        this.propertyDeleted.emit(this.key);
    }

    onRemoveChild(compositionType: string, index: number) {
        this.childrenDeleted.emit({ compositionType, index });
    }

    onTypeChanges(event: MatOptionSelectionChange) {
        if (event.isUserInput) {
            this.jsonSchemaEditorService.setType(event.source.value, event.source.selected, this.value);
            this.type = this.jsonSchemaEditorService.getTypes(this.value);

            if (this.type.indexOf('object') === -1) {
                delete this.value.required;
            }

            this.initProperties();
            this.onChanges();
        }
    }

    onReferenceChanges(reference: string) {
        this.value.$ref = reference;
        this.onChanges();
    }

    onPropertyDeleted(propertyName: string) {
        if (this.value.properties) {
            delete this.value.properties[propertyName];
            this.initProperties();

            if (this.value.required) {
                const pos = this.value.required.indexOf(propertyName);
                if (pos >= 0) {
                    this.value.required.splice(pos, 1);
                    if (this.value.required.length === 0) {
                        delete this.value['required'];
                    }
                }
            }
        }
        this.onChanges();
    }

    onChildrenDeleted(event: ChildrenDeletedEvent) {
        if (this.value[event.compositionType]) {
            this.value[event.compositionType].splice(event.index, 1);
        }

        this.onChanges();
    }

    onDefinitionDeleted(definitionName: string) {
        if (this.value.$defs) {
            delete this.value.$defs[definitionName];
        }
        this.getDefinitionsInSchema();
        this.onChanges();
    }

    onCheck(checkboxChange: MatCheckboxChange) {
        this.requiredChanges.emit({ key: this.key, value: checkboxChange.checked });
    }

    onRequiredChanges(change: { key: string; value: boolean }) {
        if (change.value) {
            if (this.value.required && this.value.required.indexOf(change.key) === -1) {
                this.value.required.push(change.key);
            } else {
                this.value.required = [change.key];
            }
        } else {
            if (this.value.required && this.value.required.indexOf(change.key) !== -1) {
                this.value.required.splice(this.value.required.indexOf(change.key), 1);
                if (this.value.required.length === 0) {
                    delete this.value.required;
                }
            }
        }
        this.onChanges();
    }

    onChangeName(e: any) {
        const newName: string = e.target.value;
        const oldName = this.key;
        if (newName !== oldName) {
            this.key = newName;
            if (!this.enableKeyEdition || this.isValid(newName)) {
                this.nameChanges.emit({ oldName, newName });
                this.onChanges();
            }
        }
    }

    onNameChanges(changes: { oldName: string; newName: string }) {
        if (this.value.type === 'object' && this.value.properties) {
            const newProperties = {};
            Object.keys(this.value.properties).forEach(key => {
                if (key !== changes.oldName) {
                    newProperties[key] = this.value.properties[key];
                } else {
                    newProperties[changes.newName] = this.value.properties[changes.oldName];
                }
            });
            this.value.properties = newProperties;

            const property = this.properties.find(prop => prop.key === changes.oldName);
            if (property) {
                property.key = changes.newName;
            }

            if (this.value.required && (this.value.required?.indexOf(changes.oldName) >= 0)) {
                this.value.required[this.value.required?.indexOf(changes.oldName)] = changes.newName;
            }
        }
        this.onChanges();
    }

    onDefinitionNameChanges(changes: { oldName: string; newName: string }) {
        if (this.value.$defs) {
            const newDefinitions = {};
            Object.keys(this.value.$defs).forEach(key => {
                if (key !== changes.oldName) {
                    newDefinitions[key] = this.value.$defs[key];
                } else {
                    newDefinitions[changes.newName] = this.value.$defs[changes.oldName];
                }
            });
            this.value.$defs = newDefinitions;

            const definition = this.definitions.find(def => def.key === changes.oldName);
            if (definition) {
                definition.key = changes.newName;
                definition.accessor = definition.accessor.substring(0, definition.accessor.lastIndexOf('/') + 1) + changes.newName;
            }
        }
        this.onChanges();
    }

    onDefinitionChanges(index: number, value: JSONSchemaInfoBasics) {
        this.value.$defs[this.definitions[index].key] = value;
        this.getDefinitionsInSchema();
        this.onChanges();
    }

    onChangeTitle(e: any) {
        const newTitle: string = e.target.value;
        if (this.isNull(newTitle)) {
            delete this.value.title;
        } else {
            this.value.title = newTitle;
        }
        this.onChanges();
    }

    onChanges() {
        this.onTouched(this.value);
        this.onChange(this.value);
        this.changes.emit(this.value);
    }

    onSettings() {
        const typeAttributes = this.jsonSchemaEditorService.advancedAttr(this.value);

        const data: JSONSchemaEditorDialogData = {
            typeAttributes,
            value: this.value
        };

        const dialogRef = this.dialog.open(JsonSchemaEditorDialogComponent, {
            data,
            minWidth: '520px'
        });

        dialogRef.afterClosed().subscribe((result: { node: JSONSchemaInfoBasics; customAttributesDeleted: string[] }) => {
            if (result) {
                Object.assign(this.value, result.node);
                Object.keys(typeAttributes).filter(key => this.isNull((<any>result.node)[key])).forEach(key => delete (<any>this.value)[key]);
                result.customAttributesDeleted.forEach(key => delete (<any>this.value)[key]);
                this.onChanges();
            }
        });
    }

    private isNull(ele: any): boolean {
        if (typeof ele === 'string') {
            return !ele || ele.trim().length === 0;
        } else {
            return ele === undefined || ele === null;
        }
    }

    isValid(name: string): boolean {
        return MODELER_NAME_REGEX.test(name);
    }

    get lastTypeNotEmpty(): string {
        if (!this.isEmpty(this.value.oneOf)) {
            return 'oneOf';
        }
        if (!this.isEmpty(this.value.anyOf)) {
            return 'anyOf';
        }
        if (!this.isEmpty(this.value.allOf)) {
            return 'allOf';
        }
        if (this.value.items) {
            return 'array';
        }

        return 'object';
    }

    private isEmpty(array: JSONSchemaInfoBasics[]): boolean {
        return array?.length === 0 || array?.length === undefined;
    }
}
