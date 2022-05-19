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
@Component({
    template: `
    <mat-form-field>
        <mat-select
            (selectionChange)="onChange()"
            [(ngModel)]="value"
            data-automation-id="variable-value"
            [disabled]="disabled"
            [placeholder]="(placeholder ? placeholder : 'SDK.VALUE') | translate">
            <mat-option *ngFor="let option of booleanOptions" [value]="option.value">{{option.label}}</mat-option>
        </mat-select>
    </mat-form-field>
    `
})

export class PropertiesViewerBooleanInputComponent {

    // eslint-disable-next-line
    @Output() change = new EventEmitter();
    @Input() value: boolean;
    @Input() disabled: boolean;
    @Input() placeholder;
    booleanOptions = [
        { value: true, label: true  },
        { value: false, label: false  }
    ];

    set options(_options: any) {
        if (_options && _options.length) {
            this.booleanOptions = [ ..._options ];
        }
    }

    onChange() {
        this.change.emit(this.value);
    }

}
