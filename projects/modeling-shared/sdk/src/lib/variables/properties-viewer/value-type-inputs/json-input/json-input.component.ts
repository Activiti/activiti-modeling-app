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

import { Component, Output, EventEmitter, Input } from '@angular/core';
import { EntityProperty, JSONSchemaInfoBasics } from '../../../../api/types';

@Component({
    templateUrl: './json-input.component.html'
})
export class PropertiesViewerJsonInputComponent {
    @Output() change = new EventEmitter();
    @Input() value: string;
    @Input() disabled = false;
    @Input() placeholder: string;
    @Input() model: JSONSchemaInfoBasics;
    @Input() autocompletionContext: EntityProperty[] = [];
    @Input() extendedProperties = {
        enableExpressionEditor: false
    };

    valid = true;

    onModeledObjectChanges(value: any) {
        if (value && typeof value !== 'string') {
            this.value = JSON.stringify(value, null, 4);
        } else {
            this.value = value;
        }
        this.emitValue();
    }

    onValidChanges(valid: boolean) {
        this.valid = valid;
    }

    onChange(value: string) {
        this.value = value;
        this.emitValue();
    }

    private emitValue() {
        if (this.valid && this.value && this.value.trim()) {
            this.change.emit(this.value);
        } else {
            this.change.emit(null);
        }
    }
}
