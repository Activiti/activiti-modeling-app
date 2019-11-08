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
import { MatDatepickerInputEvent, DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import { FormControl } from '@angular/forms';
import { MAT_DATETIME_FORMATS, DatetimeAdapter } from '@mat-datetimepicker/core';
import { MomentDatetimeAdapter } from '@mat-datetimepicker/moment';
import { MomentDateAdapter } from '@alfresco/adf-core';

@Component({
    template: `
        <mat-form-field>
            <input (dateChange)="onChange($event)" [formControl]="pickerDate" [matDatetimepicker]="datetimePicker" matInput>
            <mat-datetimepicker-toggle [for]="datetimePicker" matSuffix></mat-datetimepicker-toggle>
            <mat-datetimepicker #datetimePicker openOnFocus="true" timeInterval="5" type="datetime"></mat-datetimepicker>
        </mat-form-field>
    `,
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        { provide: DatetimeAdapter, useClass: MomentDatetimeAdapter },
        {
            provide: MAT_DATETIME_FORMATS,
            useValue: {
                parse: {
                    dateInput: 'L',
                    monthInput: 'MMMM',
                    timeInput: 'HH:mm:ss',
                    datetimeInput: 'YYYY-MM-DD HH:mm:ss'
                },
                display: {
                    dateInput: 'L',
                    monthInput: 'MMMM',
                    datetimeInput: 'YYYY-MM-DD HH:mm:ss',
                    timeInput: 'LTS',
                    monthYearLabel: 'MMM YYYY',
                    dateA11yLabel: 'HH:mm:ss',
                    monthYearA11yLabel: 'MMMM YYYY',
                    popupHeaderDateLabel: 'ddd, DD MMM'
                }
            }
        }
    ]
})

export class PropertiesViewerDateTimeInputComponent {

    @Output() change = new EventEmitter();
    @Input() value: string;

    today = new Date();
    /* cspell: disable-next-line */
    format = 'YYYY-MM-DDTHH:mm:ssZ';

    get pickerDate(): FormControl {
        return new FormControl(this.value ? moment(this.value, this.format) : '');
    }

    onChange(event: MatDatepickerInputEvent<Date>) {
        this.change.emit(moment(event.value).format(this.format));
    }
}
