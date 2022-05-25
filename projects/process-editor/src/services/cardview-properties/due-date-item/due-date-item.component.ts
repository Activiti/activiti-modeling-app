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

import { Component, Input, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CardItemTypeService, CardViewUpdateService, MomentDateAdapter, CardViewDatetimeItemModel, CardViewItem } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import {
    AmaState, selectSelectedProcess, AMA_DATETIME_FORMATS, MOMENT_DATETIME_FORMAT,
    EntityProperty, ANGULAR_DATETIME_DISPLAY_FORMAT, ProcessExtensionsModel, ISO_8601_TIME_DURATION_REGEX
} from '@alfresco-dbp/modeling-shared/sdk';
import { filter, take, debounceTime, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import moment from 'moment-es6';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DatetimeAdapter, MAT_DATETIME_FORMATS } from '@mat-datetimepicker/core';
import { MomentDatetimeAdapter } from '@mat-datetimepicker/moment';
import { DueDateItemModel } from './due-date-item.model';

export enum DueDateType {
    ProcessVariable = 'ProcessVariable',
    StaticDate = 'StaticDate',
    TimeDuration = 'TimeDuration',
}

@Component({
    selector: 'ama-process-due-date',
    templateUrl: './due-date-item.component.html',
    styleUrls: ['./due-date-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        CardItemTypeService,
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: DatetimeAdapter, useClass: MomentDatetimeAdapter },
        { provide: MAT_DATETIME_FORMATS, useValue: AMA_DATETIME_FORMATS }
    ]
})
export class CardViewDueDateItemComponent implements OnInit, OnDestroy {

    @Input() property: DueDateItemModel;

    processVariables: EntityProperty[] = [];
    dueDateForm: FormGroup;
    today = new Date();
    properties: CardViewItem[] = [];
    dueDateType = DueDateType;

    onDestroy$: Subject<void> = new Subject<void>();

    get timeDurationForm(): FormGroup {
        return this.dueDateForm.get('timeDuration') as FormGroup;
    }

    get processVariable(): FormControl {
        return this.dueDateForm.get('processVariable') as FormControl;
    }

    get selectedDueDateType(): FormControl {
        return this.dueDateForm.get('selectedDueDateType') as FormControl;
    }

    constructor(private cardViewUpdateService: CardViewUpdateService,
        private store: Store<AmaState>,
        private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.initProcessVariables();
        this.buildForm();
        this.extractDate(this.property.value);
    }

    initProcessVariables() {
        this.store.select(selectSelectedProcess).pipe(
            filter((process) => !!process),
            take(1)
        ).subscribe((process) => {
            this.processVariables = <EntityProperty[]>Object.values(new ProcessExtensionsModel(process.extensions).getProperties(this.property.data.processId))
                .filter((processVariable: EntityProperty) => processVariable.type === 'datetime');
        });
    }

    buildForm() {
        this.dueDateForm = this.formBuilder.group({
            processVariable: [undefined],
            selectedDueDateType: [this.dueDateType.StaticDate],
            timeDuration: this.formBuilder.group({
                minutes: [''],
                hours: [''],
                days: [''],
                months: [''],
            }),
        });

        this.dueDateForm.valueChanges
            .pipe(
                debounceTime(300),
                takeUntil(this.onDestroy$)
            )
            .subscribe(() => {
                this.updateDueDate();
            });
    }

    updateDueDate() {
        let dueDateValue: string;

        switch (this.selectedDueDateType.value) {
            case this.dueDateType.ProcessVariable:
                dueDateValue = this.processVariable.value ? '${' + this.processVariable.value + '}' : undefined;
                break;
            case this.dueDateType.TimeDuration:
                dueDateValue = this.mapTimeDurationFormToDueDateValue();
                break;
            case this.dueDateType.StaticDate:
                dueDateValue = this.properties && this.properties.length > 0 ? this.properties[0].value : dueDateValue;
                break;

            default:
                break;
        }

        this.cardViewUpdateService.update(this.property, dueDateValue);
    }

    extractDate(dateDefinitionValue: string) {
        this.properties = [
            new CardViewDatetimeItemModel({
                label: '',
                value: '',
                key: this.property.key,
                format: ANGULAR_DATETIME_DISPLAY_FORMAT,
                editable: true,
                default: '',
                data: this.property.data
            })
        ];

        if (dateDefinitionValue) {
            if (dateDefinitionValue.includes('$')) {
                this.extractProcessVariable(dateDefinitionValue);
                this.selectedDueDateType.setValue(this.dueDateType.ProcessVariable, { emitEvent: false });
            } else if (ISO_8601_TIME_DURATION_REGEX.test(dateDefinitionValue)) {
                this.extractTimeDuration(dateDefinitionValue);
                this.selectedDueDateType.setValue(this.dueDateType.TimeDuration, { emitEvent: false });
            } else {
                this.properties[0].value = moment(dateDefinitionValue, MOMENT_DATETIME_FORMAT).toDate();
                this.selectedDueDateType.setValue(this.dueDateType.StaticDate, { emitEvent: false });
            }
        }
    }

    extractProcessVariable(processVariableDefinition: string) {
        const processVariable = processVariableDefinition.substr(2, processVariableDefinition.length - 3);
        this.processVariable.setValue(processVariable);
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    private mapTimeDurationFormToDueDateValue(): string {
        const {
            months,
            days,
            hours,
            minutes,
        } = this.timeDurationForm.value;

        const isoMonths = months ? `${months}M` : '';
        const isoDays = days ? `${days}D` : '';
        const isoHours = hours ? `${hours}H` : '';
        const isoMinutes = minutes ? `${minutes}M` : '';

        const hasAnyTime = isoMinutes || isoHours;
        const hasAnyDays = isoDays || isoMonths;

        if (hasAnyTime || hasAnyDays) {
            return `P${isoMonths}${isoDays}${hasAnyTime ? 'T' : ''}${isoHours}${isoMinutes}`;
        }

        return '';
    }

    private extractTimeDuration(iso8601TimeDurationValue: string): void {
        const [datePart, timePart] = iso8601TimeDurationValue.split('T');
        let months = '';
        let days = '';
        let minutes = '';
        let hours = '';

        if (datePart) {
            const monthsValue = datePart.match(/(\d*)M/);
            months = monthsValue?.length > 0 ? monthsValue[1] : '';

            const daysValue = datePart.match(/(\d*)D/);
            days = daysValue?.length > 0 ? daysValue[1] : '';
        }

        if (timePart) {
            const minutesValue = timePart.match(/(\d*)M/);
            minutes = minutesValue?.length > 0 ? minutesValue[1] : '';

            const hoursValue = timePart.match(/(\d*)H/);
            hours = hoursValue?.length > 0 ? hoursValue[1] : '';
        }

        this.timeDurationForm.patchValue({
            months,
            days,
            minutes,
            hours
        }, { emitEvent: false });
    }
}
