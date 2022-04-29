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

import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { JSONSchemaInfoBasics } from '../../../../api/types';

export interface EnumExtendedProperties {
    nullSelectionAllowed: boolean;
    values: string | any[];
}

/* cspell: disable */
@Component({
    template: `
    <mat-form-field>
        <mat-select
            (selectionChange)="onChange()"
            [(ngModel)]="value"
            [placeholder]="(placeholder ? placeholder : 'SDK.VALUE') | translate"
            data-automation-id="variable-value"
            [disabled]="disabled">

            <mat-option *ngIf="extendedProperties?.nullSelectionAllowed" [value]="null">
                {{'SDK.VARIABLE_MAPPING.NONE' | translate}}
            </mat-option>

            <mat-option *ngFor="let item of items" [value]="item">
                {{ item | variablevalue }}
            </mat-option>
        </mat-select>
    </mat-form-field>
    `
})
/* cspell: enable */

export class PropertiesViewerEnumInputComponent implements OnInit {

    // eslint-disable-next-line
    @Output() change = new EventEmitter();
    @Input() value: any;
    @Input() disabled: boolean;
    @Input() placeholder;
    @Input() model: JSONSchemaInfoBasics;
    @Input() extendedProperties: EnumExtendedProperties = {
        nullSelectionAllowed: true,
        values: null
    };

    items = [];

    ngOnInit(): void {
        if (this.model?.enum) {
            this.items = this.model.enum;
        } else if (this.extendedProperties?.values) {
            if (!Array.isArray(this.extendedProperties.values)) {
                const itemString = typeof this.extendedProperties?.values === 'string' ? this.extendedProperties.values : JSON.stringify(this.extendedProperties.values);
                this.items = itemString.split(',').map(element => element.trim());
            } else {
                this.items = this.extendedProperties.values;
            }
        }
    }

    onChange() {
        this.change.emit(this.value);
    }
}
