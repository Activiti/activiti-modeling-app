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

import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CardItemTypeService, CardViewUpdateService, MomentDateAdapter, CardViewDatetimeItemModel, CardViewItem } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { AmaState, selectSelectedProcess, AMA_DATETIME_FORMATS, MOMENT_DATETIME_FORMAT,
    EntityProperty, ANGULAR_DATETIME_DISPLAY_FORMAT, ProcessExtensionsModel } from '@alfresco-dbp/modeling-shared/sdk';
import { filter, take, debounceTime, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import moment from 'moment-es6';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import { DatetimeAdapter, MAT_DATETIME_FORMATS } from '@mat-datetimepicker/core';
import { MomentDatetimeAdapter } from '@mat-datetimepicker/moment';
import { DueDateItemModel } from './due-date-item.model';

@Component({
    selector: 'ama-process-due-date',
    templateUrl: './due-date-item.component.html',
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

    onDestroy$: Subject<void> = new Subject<void>();

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
            processVariable: new FormControl(undefined, []),
            useProcessVariable: new FormControl(false, []),
        });

        this.dueDateForm.valueChanges
            .pipe(
                debounceTime(500),
                takeUntil(this.onDestroy$)
            )
            .subscribe(() => {
                this.updateDueDate();
            });
    }

    updateDueDate() {
        let dueDateValue: string;

        if (this.useProcessVariable.value) {
            dueDateValue = this.processVariable.value ? '${' + this.processVariable.value + '}' : undefined;
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
            } else {
                this.properties[0].value = moment(dateDefinitionValue, MOMENT_DATETIME_FORMAT).toDate();
            }
        }
    }

    extractProcessVariable(processVariableDefinition: string) {
        const processVariable = processVariableDefinition.substr(2, processVariableDefinition.length - 3);
        this.processVariable.setValue(processVariable);
        this.useProcessVariable.setValue(true);
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    get processVariable(): AbstractControl {
        return this.dueDateForm.get('processVariable');
    }

    get useProcessVariable(): AbstractControl {
        return this.dueDateForm.get('useProcessVariable');
    }

}
