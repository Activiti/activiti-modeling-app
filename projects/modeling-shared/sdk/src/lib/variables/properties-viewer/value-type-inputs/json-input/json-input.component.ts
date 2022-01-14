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

import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { EntityProperty, JSONSchemaInfoBasics } from '../../../../api/types';
import { ModeledObjectChanges } from '../modeled-object/modeled-object-input.component';

@Component({
    templateUrl: './json-input.component.html'
})
export class PropertiesViewerJsonInputComponent implements OnChanges {
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
        if (this.value && this.contentChanges()) {
            if (typeof this.value !== 'string') {
                this.stringValue = this.stringifyValue();
            } else {
                this.stringValue = this.value;
            }
        }
    }

    private contentChanges(): boolean {
        let check = this.stringValue;
        try {
            check = this.stringifyValue();
        } catch (error) { }
        return this.stringValue !== check;
    }

    private stringifyValue(): string {
        return JSON.stringify(this.value, null, 4);
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

    private emitValue() {
        if (this.valid && this.value) {
            this.change.emit(this.value);
        } else {
            this.change.emit(null);
        }
    }
}
