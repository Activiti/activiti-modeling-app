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
const isEqual = require('lodash/isEqual');

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
    schema: JSONSchemaInfoBasics = {};
    @Input()
    accessor: string[] = ['root'];
    @Output()
    changed = new EventEmitter<{ node: JSONSchemaInfoBasics; customAttributesDeleted: string[], typeAttributes: JSONTypePropertiesDefinition }>();

    typeAttributes: JSONTypePropertiesDefinition;
    private typeAttributesKeys: string[];
    customAttributesKeys: string[] = [];
    private customAttributesDeleted = [];

    addingCustomProperty = false;
    addProp: { key: string; value: any } = { key: '', value: '' };

    node: any;

    constructor(private jsonSchemaEditorService: JsonSchemaEditorService) { }

    ngOnChanges(): void {
        this.node = { ...this.value || {} };
        this.typeAttributes = this.jsonSchemaEditorService.advancedAttr(this.dataModelType, this.schema, this.accessor) || {};

        this.jsonSchemaEditorService.getProtectedAttributesForDataModelType(this.dataModelType, this.schema, this.accessor).forEach(attribute => delete this.node[attribute]);

        this.typeAttributesKeys = Object.keys(this.typeAttributes);

        this.typeAttributesKeys.forEach(attr => this.node[attr] = this.node[attr] || null);

        Object.keys(this.node).forEach(key => {
            if (this.typeAttributesKeys.indexOf(key) === -1) {
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
        delete this.node[item];
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
            this.node[this.addProp.key] = value;

            const deletedIndex = this.customAttributesDeleted.indexOf(this.addProp.key);
            if (deletedIndex >= 0) {
                this.customAttributesDeleted.splice(deletedIndex, 1);
            }
        }
        this.initializeCustomProperty();
        this.onChange();
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

        this.node[key] = value;
        this.onChange();
    }

    onChange() {
        if (!isEqual(this.node, this.getPreviousNodeStatus())) {
            this.cleanNullTypeAttributes(this.node);

            this.changed.emit({
                node: this.node,
                customAttributesDeleted: this.customAttributesDeleted,
                typeAttributes: this.typeAttributes
            });
        }
    }

    private getPreviousNodeStatus(): JSONSchemaInfoBasics {
        const node = { ...this.value || {} };
        this.jsonSchemaEditorService.getProtectedAttributesForDataModelType(this.dataModelType, this.schema, this.accessor).forEach(attribute => delete node[attribute]);
        this.typeAttributesKeys.forEach(attr => this.node[attr] = node[attr] || null);
        return node;
    }

    previewNode() {
        const node = Object.assign({}, this.node);

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
