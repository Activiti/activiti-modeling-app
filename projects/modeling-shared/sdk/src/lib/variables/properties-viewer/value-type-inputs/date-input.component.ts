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
import moment from 'moment-es6';
import { MomentDateAdapter } from '@alfresco/adf-core';
import { FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
    template: `
            <mat-form-field *ngIf="!currentDate || !extendedProperties?.allowExpressions">
                <div class='ama-datepicker-date-input'>
                    <input matInput
                        [matDatepicker]="picker"
                        [formControl]="pickerDate"
                        (dateChange)="onChange($event)"
                        data-automation-id="variable-value"
                        [placeholder]="(placeholder ? placeholder : 'SDK.VALUE') | translate">
                    <mat-icon *ngIf="clearButton && !disabled" (click)="onDateClear($event)" class="ama-datepicker-date-clear-button">
                        clear
                    </mat-icon>
                </div>
                <mat-datepicker #picker></mat-datepicker>
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            </mat-form-field>
        <mat-checkbox *ngIf="!clearButton && extendedProperties?.allowExpressions"
            data-automation-id="current-date-checkbox"
            [disabled]="disabled"
            [(ngModel)]="currentDate"
            (change)="onChange($event)"
            color="primary">{{'SDK.VARIABLE_TYPE_INPUT.DATE.CURRENT_DATE' | translate}}</mat-checkbox>
    `,
    styles: ['.ama-datepicker-date-input {display: flex; justify-content: space-between; width: 100%;}',
        '.ama-datepicker-date-clear-button {font-size: 16px; height: 16px; opacity: 0.5; cursor: pointer;}'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        {
            provide: MAT_DATE_FORMATS,
            useValue: {
                parse: {
                    dateInput: 'YYYY-MM-DD',
                },
                display: {
                    dateInput: 'YYYY-MM-DD',
                    monthYearLabel: 'YYYY-MM-DD',
                    dateA11yLabel: 'YYYY-MM-DD',
                    monthYearA11yLabel: 'YYYY-MM-DD',
                },
            }
        },
    ]
})

export class PropertiesViewerDateInputComponent implements OnChanges {

    // eslint-disable-next-line
    @Output() change = new EventEmitter();
    @Input() value: string;
    @Input() disabled: boolean;
    @Input() placeholder;
    @Input() extendedProperties: { allowExpressions: boolean } = { allowExpressions: true };

    format = 'YYYY-MM-DD';
    currentDate = false;
    clearButton = false;

    ngOnChanges() {
        this.showCheckboxOrDatepicker();
    }

    showCheckboxOrDatepicker() {
        this.currentDate = this.value === '${now()}' ? true : false;
        this.clearButton = this.value ? !this.currentDate : false;
    }

    onDateClear(event: Event) {
        this.change.emit('');
        this.clearButton = false;
        this.value = null;
        event.stopPropagation();
    }

    get pickerDate() {
        return new FormControl({ value: this.value ? moment(this.value, this.format) : '', disabled: this.disabled });
    }

    onChange(event: MatDatepickerInputEvent<Date> | MatCheckboxChange) {
        let res = '';
        if (event instanceof MatCheckboxChange) {
            if (event.checked) {
                res = '${now()}';
            } else {
                res = '';
                this.clearButton = false;
            }
        } else {
            res = moment(event.value).format(this.format);
            this.currentDate = false;
            this.clearButton = true;
        }
        this.change.emit(res);
    }
}
