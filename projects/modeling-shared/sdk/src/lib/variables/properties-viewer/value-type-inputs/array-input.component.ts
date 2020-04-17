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

import { Component, Output, EventEmitter, Input, OnInit, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

@Component({
    template: `
    <mat-form-field class="variable-array">
        <mat-chip-list #chipArray >
            <mat-chip *ngFor="let item of value" [selectable]="false"
                    [removable]="!disabled" (removed)="remove(item)">
            {{item}}
            <mat-icon matChipRemove *ngIf="!disabled">cancel</mat-icon>
            </mat-chip>
            <input [matChipInputFor]="chipArray" #arrayInput
                placeholder="{{(placeholder ? placeholder : 'SDK.VALUE') | translate }}"
                [formControl]="arrayCtrl"
                [matAutocomplete]="auto"
                [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                [matChipInputAddOnBlur]="true"
                (matChipInputTokenEnd)="add($event)"
                [attr.disabled]="disabled"
                [modelingsdk-allowed-characters]="regexInput">
        </mat-chip-list>
        <mat-autocomplete #auto="matAutocomplete" (optionSelected)="selected($event)">
            <mat-option *ngFor="let item of filteredItems | async" [value]="item">
            {{item}}
            </mat-option>
        </mat-autocomplete>
    </mat-form-field>
    `
})

export class PropertiesViewerArrayInputComponent implements OnInit, OnChanges {

    // tslint:disable-next-line
    @Output() change = new EventEmitter();
    @Input() value: any[];
    @Input() disabled: boolean;
    @Input() placeholder: string;
    @Input() extendedProperties: {
        regexInput?: RegExp;
        autocompleteEnabled?: boolean;
        getValueFromInput(input): any;
        getDefaultAutocompleteValues(): any[];
        getFilteredAutocompleteValues(item): any[];
    };
    arrayCtrl = new FormControl();
    filteredItems: Observable<any[]>;
    regexInput = /.*/;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    @ViewChild('arrayInput') arrayInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;

    data: any[] = [];

    ngOnInit() {
        if (this.value) {
            this.data = [].concat(this.value);
        }

        if (!this.extendedProperties || !this.extendedProperties.getValueFromInput) {
            this.extendedProperties = {
                autocompleteEnabled: false,
                getValueFromInput(input) {
                    return input;
                },
                getDefaultAutocompleteValues() {
                    return [];
                },
                getFilteredAutocompleteValues(item) {
                    return [];
                }
            };
        } else if (this.extendedProperties.regexInput) {
            this.regexInput = this.extendedProperties.regexInput;
        }

        if (this.extendedProperties.autocompleteEnabled) {
            this.filteredItems = this.arrayCtrl.valueChanges.pipe(
                startWith(null),
                map((item: any) => item ? this.extendedProperties.getFilteredAutocompleteValues(item) : this.extendedProperties.getDefaultAutocompleteValues()));
        }
    }

    ngOnChanges() {
        if (this.value) {
            this.data = [].concat(this.value);
        }
    }

    add(event: MatChipInputEvent): void {
        if (!this.matAutocomplete.isOpen) {
            const input = event.input;
            const value = event.value;

            if ((value || '').trim()) {
                this.data.push(this.extendedProperties.getValueFromInput(value));
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
        this.arrayInput.nativeElement.value = '';
        this.arrayCtrl.setValue(null);
    }

    onChange() {
        this.change.emit([].concat(this.data));
    }
}
