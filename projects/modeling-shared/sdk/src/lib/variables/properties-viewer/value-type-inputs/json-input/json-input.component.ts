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

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { EntityProperty, JSONSchemaInfoBasics } from '../../../../api/types';
import { ModelingJSONSchemaService } from '../../../../services/modeling-json-schema.service';
import { ModeledObjectChanges } from '../modeled-object/modeled-object-input.component';

@Component({
    templateUrl: './json-input.component.html'
})
export class PropertiesViewerJsonInputComponent implements OnChanges {
    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() change = new EventEmitter();
    @Input() value: any;
    @Input() disabled = false;
    @Input() placeholder: string;
    @Input() model: JSONSchemaInfoBasics;
    @Input() autocompletionContext: EntityProperty[] = [];
    @Input() extendedProperties = {
        enableExpressionEditor: false
    };

    valid = true;

    stringValue = '';

    onModeledObjectChanges(value: ModeledObjectChanges) {
        this.value = value.value;
        this.valid = value.valid;
        this.emitValue();
    }

    onValidChanges(valid: boolean) {
        this.valid = valid;
    }

    ngOnChanges(): void {
        if (this.contentChanges()) {
            this.stringValue = this.getStringValue(this.value);
        }
    }

    private getStringValue(value: unknown) {
        if (!value) {
            return '';
        }

        if (typeof value !== 'string') {
            return this.stringifyValue(value);
        }

        return value;
    }

    private contentChanges(): boolean {
        let check = this.stringValue;
        try {
            check = this.stringifyValue(this.value);
        } catch (error) { }
        return this.stringValue !== check;
    }

    private stringifyValue(value: unknown): string {
        try {
            return JSON.stringify(value, null, 4);
        } catch (e) { }

        return '';
    }

    onChange(value: string) {
        this.stringValue = value;
        if (value) {
            try {
                this.value = JSON.parse(value);
            } catch (e) {
                this.value = value;
            }
        } else {
            this.value = value;
        }
        this.emitValue();
    }

    private getValueForEmit() {
        if (!this.value) {
            return '';
        }

        if (this.valid && this.value) {
            return this.value;
        }

        return null;
    }

    private emitValue() {
        const value = this.getValueForEmit();

        this.change.emit(value);
    }

    get isPrimitiveJSONInput() {
        return !this.model || Object.keys(this.model).length === 0 || this.model.$ref === ModelingJSONSchemaService.PRIMITIVE_DEFINITIONS_PATH + '/json';
    }
}
