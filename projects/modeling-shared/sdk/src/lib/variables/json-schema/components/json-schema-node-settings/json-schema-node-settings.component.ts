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

import { Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';
import { JSONSchemaInfoBasics } from '../../../../api/types';
import { JSONTypePropertiesDefinition } from '../../models/model';
import { JsonSchemaEditorService } from '../../services/json-schema-editor.service';

@Component({
    selector: 'modelingsdk-json-schema-node-settings',
    templateUrl: './json-schema-node-settings.component.html',
    styleUrls: ['./json-schema-node-settings.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class JsonSchemaNodeSettingsComponent implements OnChanges {

    @Input()
    value: JSONSchemaInfoBasics = {};
    @Input()
    dataModelType: string;
    @Input()
    allowCustomAttributes = true;
    @Input()
    allowAttributesPreview = true;
    @Input()
    schema: JSONSchemaInfoBasics;
    @Input()
    accessor: string[];
    @Output()
    changed = new EventEmitter<JSONSchemaInfoBasics>();

    typeAttributes: JSONTypePropertiesDefinition;
    private typeAttributesKeys: string[];
    private protectedAttributes: string[];
    customAttributesKeys: string[] = [];
    private customAttributesDeleted = [];

    addingCustomProperty = false;
    addProp: { key: string; value: any } = { key: '', value: '' };

    private initialValue: string;

    constructor(private jsonSchemaEditorService: JsonSchemaEditorService) { }

    ngOnChanges(): void {
        if (!this.schema) {
            this.schema = this.value;
            this.accessor = ['root'];
        }

        this.typeAttributes = this.jsonSchemaEditorService.advancedAttr(this.dataModelType, this.schema, this.accessor) || {};
        this.typeAttributesKeys = Object.keys(this.typeAttributes);
        this.cleanNullTypeAttributes(this.value);

        this.initialValue = JSON.stringify(this.value);

        this.customAttributesKeys = [];
        this.protectedAttributes = this.jsonSchemaEditorService.getProtectedAttributesForDataModelType(this.dataModelType, this.schema, this.accessor);

        Object.keys(this.value).forEach(key => {
            if (this.typeAttributesKeys.indexOf(key) === -1 && this.protectedAttributes.indexOf(key) === -1) {
                this.customAttributesKeys.push(key);
            }
        });
    }

    addCustomNode() {
        this.addProp.key = 'property_' + (this.customAttributesKeys.length + 1);
        this.addProp.value = '';
        this.addingCustomProperty = true;
    }

    deleteCustomNode(item: string) {
        this.customAttributesKeys.splice(this.customAttributesKeys.indexOf(item), 1);
        delete this.value[item];
        this.customAttributesDeleted.push(item);
    }

    confirmAddCustomNode() {
        if (!this.isNull(this.addProp.value)) {
            this.customAttributesKeys.push(this.addProp.key);
            let value;
            try {
                value = JSON.parse(this.addProp.value);
            } catch (error) {
                value = this.addProp.value;
            }
            this.value[this.addProp.key] = value;

            const deletedIndex = this.customAttributesDeleted.indexOf(this.addProp.key);
            if (deletedIndex >= 0) {
                this.customAttributesDeleted.splice(deletedIndex, 1);
            }
        }
        this.initializeCustomProperty();
    }

    initializeCustomProperty() {
        this.addProp = { key: '', value: '' };
        this.addingCustomProperty = false;
    }

    changeCustomProperty(key: string, event: any) {
        let value;
        try {
            value = JSON.parse(event.target.value);
        } catch (error) {
            value = event.target.value;
        }

        this.value[key] = value;
    }

    onChange(focus: boolean) {
        if (!focus) {
            this.cleanNullTypeAttributes(this.value);
            const currentValue = JSON.stringify(this.value);
            if (currentValue !== this.initialValue) {
                this.initialValue = currentValue;
                this.changed.emit(this.value);
            }
        }
    }

    previewNode() {
        const node = Object.assign({}, this.value);
        this.protectedAttributes.forEach(key => delete node[key]);
        this.cleanNullTypeAttributes(node);

        return JSON.stringify(node, null, 4);
    }

    private cleanNullTypeAttributes(node: JSONSchemaInfoBasics) {
        this.typeAttributesKeys.forEach(key => {
            if (this.isNull(node[key])) {
                delete node[key];
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
}
