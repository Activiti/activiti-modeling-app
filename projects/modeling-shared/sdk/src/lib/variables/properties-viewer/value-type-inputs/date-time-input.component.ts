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
import { FormControl } from '@angular/forms';
import { MAT_DATETIME_FORMATS, DatetimeAdapter } from '@mat-datetimepicker/core';
import { MomentDatetimeAdapter } from '@mat-datetimepicker/moment';
import { MomentDateAdapter } from '@alfresco/adf-core';
import { AMA_DATETIME_FORMATS, MOMENT_DATETIME_FORMAT } from '../../../helpers/primitive-types';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
    template: `
        <mat-form-field *ngIf="!currentDateTime || !extendedProperties?.allowExpressions" class="advanced-datetime-picker">
            <div class='ama-datepicker-date-input'>
                    <input matInput
                        [matDatetimepicker]="datetimePicker"
                        [formControl]="pickerDate"
                        (dateChange)="onChange($any($event))"
                        data-automation-id="variable-value"
                        [placeholder]="(placeholder ? placeholder : 'SDK.VALUE') | translate">
                    <mat-icon *ngIf="clearButton  && !disabled" (click)="onDateClear($event)" class="ama-datepicker-date-clear-button">
                        clear
                    </mat-icon>
            </div>
            <mat-datetimepicker-toggle [for]="datetimePicker" matSuffix></mat-datetimepicker-toggle>
            <mat-datetimepicker #datetimePicker [openOnFocus]="true" [timeInterval]="5" type="datetime"></mat-datetimepicker>
        </mat-form-field>
        <mat-checkbox *ngIf="!clearButton && extendedProperties?.allowExpressions"
            data-automation-id="current-datetime-checkbox"
            [disabled]="disabled"
            [(ngModel)]="currentDateTime"
            (change)=(onChange($event))
            color="primary">
                {{'SDK.VARIABLE_TYPE_INPUT.DATE_TIME.CURRENT_DATE_TIME' | translate}}
        </mat-checkbox>
    `,
    styles: ['.ama-datepicker-date-input {display: flex; justify-content: space-between; width: 100%;}',
        '.ama-datepicker-date-clear-button {font-size: 16px; height: 16px; opacity: 0.5; cursor: pointer;}'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: DatetimeAdapter, useClass: MomentDatetimeAdapter },
        { provide: MAT_DATETIME_FORMATS, useValue: AMA_DATETIME_FORMATS }
    ]
})

export class PropertiesViewerDateTimeInputComponent implements OnChanges {

    // eslint-disable-next-line
    @Output() change = new EventEmitter();
    @Input() value: string;
    @Input() disabled: boolean;
    @Input() placeholder;
    @Input() extendedProperties: { allowExpressions: boolean } = { allowExpressions: true };

    today = new Date();
    currentDateTime = false;
    clearButton = false;

    ngOnChanges() {
        this.showCheckboxOrDatepicker();
    }

    showCheckboxOrDatepicker() {
        this.currentDateTime = this.value === '${now()}' ? true : false;
        this.clearButton = this.value ? !this.currentDateTime : false;
    }

    onDateClear(event: Event) {
        this.change.emit('');
        this.clearButton = false;
        this.value = null;
        event.stopPropagation();
    }

    get pickerDate(): FormControl {
        return new FormControl({ value: this.value ? moment(this.value, MOMENT_DATETIME_FORMAT) : '', disabled: this.disabled });
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
            res = moment(event.value).format(MOMENT_DATETIME_FORMAT);
            this.currentDateTime = false;
            this.clearButton = true;
        }
        this.change.emit(res);
    }
}
