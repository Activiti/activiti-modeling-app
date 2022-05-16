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

import { Component, Output, EventEmitter, Input, ViewChild, ElementRef, OnChanges, ViewEncapsulation } from '@angular/core';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { ValueTypeInputComponent } from '../../value-type-input.component';
import { MatDialog } from '@angular/material/dialog';
import { ArrayInputDialogComponent } from './array-input-dialog/array-input-dialog.component';
import { ElementVariable, JSONSchemaInfoBasics } from '../../../../api/types';
import { JSONSchemaToEntityPropertyService } from '../../../../services/json-schema-to-entity-property.service';

export interface ArrayInputExtendedProperties {
    regexInput?: RegExp;
    autocompleteEnabled?: boolean;
    autocompleteValues?: string[];
    truncate?: number;
    values?: string;
    getDefaultAutocompleteValues(): string[];
    getFilteredAutocompleteValues(item: string): string[];
}

@Component({
    templateUrl: './array-input.component.html',
    styleUrls: ['./array-input.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PropertiesViewerArrayInputComponent implements OnChanges {

    // eslint-disable-next-line
    @Output() change = new EventEmitter();
    @Input() value: any[];
    @Input() disabled: boolean;
    @Input() placeholder: string;
    @Input() extendedProperties: ArrayInputExtendedProperties;
    @Input() model: JSONSchemaInfoBasics;
    @Input() autocompletionContext: ElementVariable[] = [];

    arrayCtrl = new FormControl();
    filteredItems: Observable<any[]>;
    regexInput = /.*/;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    @ViewChild('stringInput', { static: false }) stringInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

    @ViewChild('primitiveInput', { static: false }) primitiveInput: ValueTypeInputComponent;

    data: any[] = [];
    type: 'string' | 'primitive' | 'object' = 'string';

    primitiveValue: any;
    primitiveType: string;

    constructor(
        private dialog: MatDialog,
        private jsonService: JSONSchemaToEntityPropertyService
    ) { }

    ngOnChanges() {
        this.data = [];

        if (this.value) {
            this.data = [].concat(this.value);
        }

        if (!this.model && !this.extendedProperties?.values) {
            this.model = { type: 'array', items: { type: 'string' } };
        }

        if (!this.extendedProperties) {
            this.extendedProperties = {
                autocompleteEnabled: false,
                getDefaultAutocompleteValues: null,
                getFilteredAutocompleteValues: null
            };
        }

        this.setType();

        if (this.extendedProperties.regexInput) {
            this.regexInput = this.extendedProperties.regexInput;
        }

        if (this.type === 'string' && this.extendedProperties.autocompleteEnabled) {
            if (!this.extendedProperties.getDefaultAutocompleteValues) {
                this.extendedProperties.getDefaultAutocompleteValues = () =>
                    this.extendedProperties.autocompleteValues || [];
            }
            if (!this.extendedProperties.getFilteredAutocompleteValues) {
                this.extendedProperties.getFilteredAutocompleteValues = (item: string) =>
                    this.extendedProperties.getDefaultAutocompleteValues().filter(element =>
                        element && element.toLowerCase().startsWith(item.toLowerCase())
                    );
            }

            this.filteredItems = this.arrayCtrl.valueChanges.pipe(
                startWith(null),
                map((item: string) => item ? this.extendedProperties.getFilteredAutocompleteValues(item) : this.extendedProperties.getDefaultAutocompleteValues())
            );
        }
    }

    setType() {
        if (this.model?.items) {
            const modelPrimitiveType = this.jsonService.getPrimitiveTypes(this.model.items);
            if (modelPrimitiveType.length === 1 && modelPrimitiveType[0] !== 'json') {
                this.type = modelPrimitiveType[0] === 'string' ? 'string' : 'primitive';
            } else {
                this.type = 'object';
            }
        } else {
            this.type = this.extendedProperties?.values === 'string' ? 'string' : 'primitive';
            this.primitiveType = this.extendedProperties?.values;
        }
    }

    add(event: MatChipInputEvent): void {
        if (!this.matAutocomplete.isOpen) {
            const input = event.input;
            const value = event.value;

            if ((value || '').trim()) {
                this.data.push(value);
            }

            if (input) {
                input.value = '';
            }
            this.onChange();
        }
    }

    remove(item: any): void {
        const index = this.data.indexOf(item);

        if (index >= 0) {
            this.data.splice(index, 1);
        }

        this.onChange();
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        this.data.push(event.option.viewValue);
        this.stringInput.nativeElement.value = '';
        this.arrayCtrl.setValue(null);
        this.onChange();
    }

    onChange() {
        this.change.emit([].concat(this.data));
    }

    addPrimitive() {
        this.data.push(this.primitiveValue);
        this.primitiveValue = null;
        this.primitiveInput.resetInput();
        this.onChange();
    }

    addObject() {
        const dialogRef = this.dialog.open(ArrayInputDialogComponent, {
            width: '600px',
            data: {
                title: this.placeholder || 'SDK.VARIABLE_TYPE_INPUT.ARRAY_INPUT.VALUE_TO_ADD_TO_ARRAY',
                model: this.model?.items,
                autocompletionContext: this.autocompletionContext,
                disabled: this.disabled
            }
        });

        dialogRef.afterClosed().subscribe(value => {
            if (value) {
                this.data.push(value);
                this.onChange();
            }
        });
    }

    editObject(item: any, index: number) {
        const dialogRef = this.dialog.open(ArrayInputDialogComponent, {
            width: '600px',
            data: {
                title: this.placeholder || 'SDK.VARIABLE_TYPE_INPUT.ARRAY_INPUT.EDIT_VALUE',
                model: this.model?.items,
                autocompletionContext: this.autocompletionContext,
                disabled: this.disabled,
                value: item
            }
        });

        dialogRef.afterClosed().subscribe(value => {
            if (value) {
                this.data[index] = value;
                this.onChange();
            }
        });
    }
}
