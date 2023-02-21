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

import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { InstantErrorStateMatcher } from '../../helpers/utils/instant-error-state-matcher';
import { FormRendererField } from '../models/form-renderer-field.interface';
import { FormFieldsRendererService } from '../service/form-fields-renderer.service';
import { debounceTime, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
    selector: 'modelingsdk-form-fields-renderer',
    templateUrl: './form-fields-renderer.smart-component.html',
    styleUrls: ['./form-fields-renderer.smart-component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldsRendererSmartComponent implements OnChanges {

    @Input()
    formFields: FormRendererField[] = [];

    @Input()
    formDebounceTime = 300;

    @Output()
    valueChanges: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    validationChanges: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output()
    loadingState: EventEmitter<boolean> = new EventEmitter<boolean>(false);

    formGroup: FormGroup;
    matcher = new InstantErrorStateMatcher();
    formValid: boolean;
    formChangesSubscription: Subscription;

    constructor(private readonly formFieldsRendererService: FormFieldsRendererService) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes?.formFields.currentValue) {
            this.createForm();
        }
    }

    private createForm() {
        this.formChangesSubscription?.unsubscribe();
        this.formGroup = this.formFieldsRendererService.createForm(this.formFields);
        this.formValid = this.formGroup.valid;
        this.validationChanges.emit(this.formValid);

        this.formChangesSubscription = this.formGroup.valueChanges
            .pipe(
                tap(() => this.loadingState.emit(true)),
                debounceTime(this.formDebounceTime)
            )
            .subscribe((formValues: any) => {
                this.emitFormValidation();
                this.emitFormPayload(formValues);
                this.loadingState.emit(false);
            });
    }

    private emitFormPayload(formValues: any) {
        this.convertStringToNumberForNumberFields(formValues);
        this.valueChanges.emit(formValues);
    }

    /**
     * An input of type number returns string as value
     * The string value needs to be converted to a number
     * in the payload.
     */
    private convertStringToNumberForNumberFields(formValues: any) {
        const numberFields = this.formFields.filter((field: FormRendererField) => field.type === 'number');
        numberFields.forEach((numberField: FormRendererField) => {
            if (formValues[numberField.key]) {
                const valueAsNumber = Number(formValues[numberField.key]);
                formValues[numberField.key] = isNaN(valueAsNumber) ? formValues[numberField.key] : valueAsNumber;
            }
        });
    }

    private emitFormValidation() {
        if (this.formGroup.valid !== this.formValid) {
            this.formValid = this.formGroup.valid;
            this.validationChanges.emit(this.formGroup.valid);
        }
    }

    getInputFormControl(fieldKey: string): FormControl {
        return this.formGroup.get(fieldKey) as FormControl;
    }
}
