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

import { Component, OnInit, HostListener, EventEmitter, Input, Output, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FormRendererField } from '../../../../form-fields-renderer/models/form-renderer-field.interface';
import { EntityDialogPayload, EntityDialogForm } from '../../../common';

interface EditActionSubmitPayload {
    id?: string;
    form?: Partial<EntityDialogForm>;
    submitData?: any;
}

interface CreateActionSubmitPayload extends Partial<EntityDialogForm> {
    submitData?: any;
}

type EntityDialogContentSubmitPayload = CreateActionSubmitPayload & EditActionSubmitPayload;

export interface EntityDialogContentSubmitData {
    payload: EntityDialogContentSubmitPayload;
    navigateTo: boolean;
    callback: () => any;
}
@Component({
    selector: 'modelingsdk-entity-dialog-content',
    templateUrl: './entity-dialog-content.component.html',
    styleUrls: ['./entity-dialog-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntityDialogContentComponent implements OnInit {
    @Input()
    data: EntityDialogPayload;

    @Output()
    // eslint-disable-next-line @angular-eslint/no-output-native
    submit = new EventEmitter<EntityDialogContentSubmitData>();

    submitButton: string;
    formDebounceTime = 0;

    private payload: EntityDialogContentSubmitPayload = {};
    private valid: boolean;
    private loadingFields = false;

    constructor(private readonly changeDetector: ChangeDetectorRef) {}

    ngOnInit(): void {
        if (this.data?.fields$) {
            this.assignAsyncFields();
        }

        this.defineSubmitButtonText();
        this.setupDefaultPayload();
    }

    onValueChanges(valuesChanged: any): void {
        if(this.data?.fields?.length) {
            this.data.fields.forEach((field: FormRendererField) => {
                const value = valuesChanged[field.key];
                if (this.isDataValue(field.key)) {
                    this.payload.form[field.key] = value;
                } else {
                    this.payload[field.key] = value;
                }
            });
        }
    }

    onValidationChanges(validationChanged: boolean): void {
        this.valid = validationChanged;
    }

    onSubmit(): void {
        const navigateTo = this.data.navigateTo ?? true;

        this.submit.emit({
            payload: this.payload,
            navigateTo,
            callback: this.data.callback
        });
    }

    assignAsyncFields(): void {
        this.loadingFields = true;
        this.data.fields$.pipe(
            catchError((error) => {
                this.handleError();
                return throwError(error);
            })
        ).subscribe((fields: FormRendererField[]) => {
            this.data.fields = fields;
            this.loadingFields = false;
            this.changeDetector.detectChanges();
        });
    }

    private handleError(): void {
        this.submit.emit({ payload: {}, navigateTo: false, callback: () => {} });
    }

    private isDataValue(key: any): boolean {
        return this.data.values && key in this.data.values;
    }

    private defineSubmitButtonText(): void {
        const { values, submitText } = this.data;
        this.submitButton = values ? 'APP.DIALOGS.SAVE' : submitText;
    }

    private setupDefaultPayload(): void {
        if (this.data?.submitData) {
            this.payload.submitData = this.data.submitData;
        }

        if (this.data?.values?.id) {
            this.payload.id = this.data.values.id;
            this.payload.form = {};
        }
    }

    isValid(): boolean {
        return this.valid;
    }

    fieldsLoaded(): boolean {
        return !this.loadingFields;
    }

    isDisabled(): boolean {
        return !this.isValid() || !this.fieldsLoaded();
    }

    @HostListener('document:keydown.enter', ['$event.target'])
    keyEvent(): void {
        if (!this.isDisabled()) {
            this.onSubmit();
        }
    }
}
