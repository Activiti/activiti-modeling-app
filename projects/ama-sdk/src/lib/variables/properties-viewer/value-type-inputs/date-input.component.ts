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
import { MatDatepickerInputEvent, MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@alfresco/adf-core';
import { FormControl } from '@angular/forms';

@Component({
    template: `
        <mat-form-field>
            <input matInput [matDatepicker]="picker" [formControl]="pickerDate" (dateChange)="onChange($event)" data-automation-id="variable-value">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
    `,
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

export class PropertiesViewerDateInputComponent {

    @Output() change = new EventEmitter();
    @Input() value: string;
    @Input() disabled: boolean;

    format = 'YYYY-MM-DD';

    get pickerDate() {
        return new FormControl({ value: this.value ? moment(this.value, this.format) : '', disabled: this.disabled });
    }

    onChange(event: MatDatepickerInputEvent<Date>) {
        this.change.emit(moment(event.value).format(this.format));
    }
}
