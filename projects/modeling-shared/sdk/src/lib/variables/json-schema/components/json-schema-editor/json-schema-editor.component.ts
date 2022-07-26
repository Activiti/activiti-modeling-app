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

import { Component, Input, forwardRef, Output, EventEmitter, ViewEncapsulation, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import {
    ChildrenDeletedEvent,
    JsonNodeCustomization,
    JSONSchemaDefinition,
    JSONSchemaEditorDialogData,
    JSONSchemaTypeDropdownDefinition
} from '../../models/model';
import { JsonSchemaEditorDialogComponent } from '../json-schema-editor-dialog/json-schema-editor-dialog.component';
import { JsonSchemaEditorService } from '../../services/json-schema-editor.service';
import { JSONSchemaInfoBasics } from '../../../../api/types';
import { PropertyTypeItem } from '../../../../variables/properties-viewer/property-type-item/models';
import { Observable } from 'rxjs';
import { MODELER_NAME_REGEX } from '../../../../helpers/utils/create-entries-names';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
const isEqual = require('lodash/isEqual');
const cloneDeep = require('lodash/cloneDeep');

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
export class JsonSchemaEditorComponent implements ControlValueAccessor, OnChanges {

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
    @Input() enableSettingsDialog = true;
    @Input() allowInLineDefinitions = true;
    @Input() dataModelType: string;
    @Input() accessor: any[];
    @Input() nodeSelectedAccessor: any[];
    @Input() allowCustomAttributes = true;
    @Input() allowAttributesPreview = true;
    @Input() schema: JSONSchemaInfoBasics;
    @Output() changes = new EventEmitter<JSONSchemaInfoBasics>();
    @Output() propertyDeleted = new EventEmitter<string>();
    @Output() childrenDeleted = new EventEmitter<ChildrenDeletedEvent>();
    @Output() requiredChanges = new EventEmitter<{ key: string; value: boolean }>();
    @Output() nameChanges = new EventEmitter<{ oldName: string; newName: string }>();
    @Output() selected = new EventEmitter<any[]>();

    @ViewChild('rootNode', { static: true })
    rootNode: HTMLDivElement;

    properties: { key: string; definition: JSONSchemaInfoBasics }[] = [];
    definitions: JSONSchemaDefinition[] = [];
    collapsed = false;
    definitionsCollapsed = false;
    type: string[] = [];
    typeNames: JSONSchemaTypeDropdownDefinition;
    nodeSelected = false;
    customizations: JsonNodeCustomization;
    customHierarchy: Observable<PropertyTypeItem[]>;
    label: string;

    constructor(
        private jsonSchemaEditorService: JsonSchemaEditorService,
        private dialog: MatDialog,
        private translateService: TranslateService) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['nodeSelectedAccessor']) {
            this.nodeSelected = isEqual(this.accessor, this.nodeSelectedAccessor);
        }

        if (this.changesTriggerCustomization(changes)) {
            this.customizeNode();
        }
    }

    private changesTriggerCustomization(changes: SimpleChanges) {
        const schemaChanges = changes['schema'] &&
            !changes['schema'].isFirstChange() &&
            JSON.stringify(changes['schema'].previousValue) !== JSON.stringify(changes['schema'].currentValue);

        const accessorChanges = changes['accessor'] &&
            !changes['accessor'].isFirstChange() &&
            JSON.stringify(changes['accessor'].previousValue) !== JSON.stringify(changes['accessor'].currentValue);

        const dataModelTypeChanges = changes['dataModelType'] &&
            !changes['dataModelType'].isFirstChange() &&
            JSON.stringify(changes['dataModelType'].previousValue) !== JSON.stringify(changes['dataModelType'].currentValue);

        return schemaChanges || accessorChanges || dataModelTypeChanges;
    }

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
            this.customizeNode();
        }

        if (!this.schema || this.depth === 0) {
            this.schema = cloneDeep(this.value);
        }
        if (!this.accessor || this.depth === 0) {
            this.accessor = [this.key];
        }
        this.nodeSelected = isEqual(this.accessor, this.nodeSelectedAccessor);
    }

    private customizeNode() {
        this.customizations = this.jsonSchemaEditorService.getNodeCustomizationsForDataModelType(this.dataModelType, this.schema, this.accessor);
        this.typeNames = this.customizations.type.definitions;
        this.customHierarchy = this.getCustomHierarchy(this.hierarchy, this.customizations.type.references);

        if (this.customizations.key?.value) {
            this.label = this.translateService.instant(this.customizations.key.value);
        }

        if (this.customizations.required?.value) {
            this.required = this.customizations.required.value;
        }

        if (this.customizations.title?.value) {
            this.value.title = this.customizations.title.value;
        }

        if (this.customizations.type?.value) {
            this.type = this.customizations.type.value;
        }
    }

    private getCustomHierarchy(hierarchy: Observable<PropertyTypeItem[]>, references: { whiteList?: string[], blacklist?: string[] }): Observable<PropertyTypeItem[]> {
        return hierarchy.pipe(map(initialHierarchy => {
            const result: PropertyTypeItem[] = [...initialHierarchy];

            if (references?.whiteList) {
                this.filterReferencesStartingWith(result, references.whiteList, true);
            }

            if (references?.blacklist) {
                this.filterReferencesStartingWith(result, references.blacklist, false);
            }

            return result.filter(item => item.children?.length > 0 || item.value?.$ref);
        }));
    }

    private filterReferencesStartingWith(hierarchy: PropertyTypeItem[], filteredReferences: string[], whiteList: boolean) {
        if (filteredReferences && hierarchy) {
            if (whiteList) {
                for (let hierarchyIndex = hierarchy.length - 1; hierarchyIndex >= 0; hierarchyIndex--) {
                    const item = hierarchy[hierarchyIndex];

                    if (item.children && item.children.length > 0) {
                        this.filterReferencesStartingWith(item.children, filteredReferences, whiteList);
                    } else if (item.value?.$ref) {
                        const reference = item.value?.$ref;
                        if (!filteredReferences.some(filter => reference.startsWith(filter))) {
                            hierarchy.splice(hierarchyIndex, 1);
                        }
                    }
                }
            } else {
                for (let hierarchyIndex = 0; hierarchyIndex < hierarchy.length; hierarchyIndex++) {
                    const item = hierarchy[hierarchyIndex];

                    if (item.children && item.children.length > 0) {
                        this.filterReferencesStartingWith(item.children, filteredReferences, whiteList);
                    } else if (item.value?.$ref) {
                        const reference = item.value?.$ref;
                        if (filteredReferences.some(filter => reference.startsWith(filter))) {
                            hierarchy.splice(hierarchyIndex, 1);
                        }
                    }
                }
            }
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
        this.value.properties[name] = this.jsonSchemaEditorService.addPropertyForDataModelType(this.dataModelType, this.schema, this.accessor);
        this.initProperties();
        this.collapsed = false;
        this.onChanges();
    }

    onAddDefinition() {
        this.value.$defs = this.value.$defs || {};
        const name = this.generateName('definition', Object.keys(this.value.$defs).length);
        this.value.$defs[name] = this.jsonSchemaEditorService.addDefinitionForDataModelType(this.dataModelType, this.schema, this.accessor);
        this.getDefinitionsInSchema();
        this.definitionsCollapsed = false;
        this.onChanges();
    }

    onAddChild(type: string) {
        const accessor = type;

        if (!(<any>this.value)[accessor]) {
            (<any>this.value)[accessor] = [];
        }
        (<any>this.value)[accessor].push(this.jsonSchemaEditorService.addChildForDataModelType(this.dataModelType, this.schema, this.accessor, type));

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
            this.jsonSchemaEditorService.setType(event.source.value, event.source.selected, this.value, this.dataModelType, this.schema, this.accessor);
            this.type = this.jsonSchemaEditorService.getTypes(this.value);

            if (this.type.indexOf('object') === -1) {
                delete this.value.required;
            }

            this.initProperties();
            this.customizeNode();
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
        const data: JSONSchemaEditorDialogData = {
            value: this.value,
            dataModelType: this.dataModelType,
            allowCustomAttributes: this.allowCustomAttributes,
            allowAttributesPreview: this.allowAttributesPreview,
            schema: this.schema,
            accessor: this.accessor
        };

        const dialogRef = this.dialog.open(JsonSchemaEditorDialogComponent, {
            data,
            minWidth: '520px'
        });

        dialogRef.afterClosed().subscribe((result: JSONSchemaInfoBasics) => {
            if (result) {
                this.value = result;
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

    focused(focused: boolean) {
        if (focused) {
            this.selectItem(this.accessor);
        }
    }

    selectItem(accessor: any[]) {
        this.selected.emit(accessor);
    }
}
