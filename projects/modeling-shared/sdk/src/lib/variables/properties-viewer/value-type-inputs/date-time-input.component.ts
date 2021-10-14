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
import moment from 'moment-es6';
import { FormControl } from '@angular/forms';
import { MAT_DATETIME_FORMATS, DatetimeAdapter } from '@mat-datetimepicker/core';
import { MomentDatetimeAdapter } from '@mat-datetimepicker/moment';
import { MomentDateAdapter } from '@alfresco/adf-core';
import { AMA_DATETIME_FORMATS, MOMENT_DATETIME_FORMAT } from '../../../helpers/primitive-types';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
    template: `
        <mat-form-field class="advanced-datetime-picker">
            <mat-label>{{(placeholder || 'SDK.VALUE') | translate}}</mat-label>
            <input (dateChange)="onChange($any($event))" [formControl]="pickerDate" [matDatetimepicker]="datetimePicker" matInput>
            <mat-datetimepicker-toggle [for]="datetimePicker" matSuffix></mat-datetimepicker-toggle>
            <mat-datetimepicker #datetimePicker [openOnFocus]="true" [timeInterval]="5" type="datetime"></mat-datetimepicker>
        </mat-form-field>
    `,
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: DatetimeAdapter, useClass: MomentDatetimeAdapter },
        { provide: MAT_DATETIME_FORMATS, useValue: AMA_DATETIME_FORMATS }
    ]
})

export class PropertiesViewerDateTimeInputComponent {

    // tslint:disable-next-line
    @Output() change = new EventEmitter();
    @Input() value: string;
    @Input() disabled: boolean;
    @Input() placeholder;

    today = new Date();

    get pickerDate(): FormControl {
        return new FormControl({ value: this.value ? moment(this.value, MOMENT_DATETIME_FORMAT) : '', disabled: this.disabled });
    }

    onChange(event: MatDatepickerInputEvent<Date>) {
        this.change.emit(moment(event.value).format(MOMENT_DATETIME_FORMAT));
    }
}
