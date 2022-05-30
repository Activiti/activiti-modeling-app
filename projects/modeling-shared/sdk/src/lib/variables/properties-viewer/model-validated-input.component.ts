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

import { Component, Output, EventEmitter, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JSONSchemaInfoBasics } from '../../api/types';
import { InstantErrorStateMatcher } from '../../helpers/utils/instant-error-state-matcher';
import { VariablesService } from '../variables.service';

@Component({ template: '' })
export abstract class PropertiesViewerModelValidatedInputComponent implements OnInit, OnChanges, OnDestroy {
    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() change = new EventEmitter();
    @Input() value: any;
    @Input() disabled = false;
    @Input() model: JSONSchemaInfoBasics;
    @Input() placeholder: string;
    @Input() required = false;

    validatedInput: FormControl;
    matcher = new InstantErrorStateMatcher();

    onDestroy$ = new Subject<boolean>();

    previousValue = null;

    constructor(private variablesService: VariablesService) { }

    ngOnInit(): void {
        this.createFormControlIfNeeded();
        this.handleModel();
    }

    ngOnChanges() {
        this.createFormControlIfNeeded();

        this.previousValue = this.validatedInput.value;

        this.validatedInput.setValue(this.value);

        this.handleModel();
    }

    private createFormControlIfNeeded() {
        if (!this.validatedInput) {
            this.validatedInput = new FormControl({ value: this.value, disabled: this.disabled || this.model?.readOnly });
            this.validatedInput.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(value => {
                if (this.validatedInput.valid && this.previousValue !== value && typeof value === 'string') {
                    this.change.emit(this.transformValueToBeEmitted(value));
                }
            });
        }
    }

    protected abstract transformValueToBeEmitted(value: any);

    private handleModel() {
        this.validatedInput.setValidators(this.variablesService.getValidatorsFromModel(this.model, this.required));

        this.computeModel();
    }

    protected abstract computeModel();

    ngOnDestroy(): void {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
