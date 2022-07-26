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

import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EntityProperty } from '../../../../api/types';
import { PropertyTypeItem } from '../../../properties-viewer/property-type-item/models';
const cloneDeep = require('lodash/cloneDeep');

@Component({
    selector: 'modelingsdk-reference-selector',
    templateUrl: './reference-selector.component.html',
    styleUrls: ['./reference-selector.component.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ReferenceSelectorComponent), multi: true }
    ]
})
export class ReferenceSelectorComponent implements ControlValueAccessor {

    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() change = new EventEmitter();
    @Input() reference: string;
    @Input() hierarchy: PropertyTypeItem[];

    property: EntityProperty = {
        id: 'property',
        name: 'property',
        type: 'json',
        model: {
            $ref: undefined
        }
    };

    private onChange: any = () => { };
    private onTouched: any = () => { };

    writeValue(ref: string): void {
        this.reference = ref;
        this.property = cloneDeep(this.property);
        this.property.model.$ref = this.reference;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    onPropertyChanges(property: EntityProperty) {
        this.reference = property.model?.$ref;
        this.onChange(this.reference);
        this.onTouched(this.reference);
        this.change.emit(this.reference);
    }
}
