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

import { Component, OnInit, HostListener, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModelFieldProperty } from '../../../../interfaces/model-creator.interface';
import { EntityDialogPayload, EntityDialogForm } from '../../../common';
import { EntityDialogContentFormService } from '../service/entity-dialog-content-form.service';

interface EditActionSubmitPayload {
    id: string;
    form: Partial<EntityDialogForm>;
    submitData?: any;
}

interface CreateActionSubmitPayload extends Partial<EntityDialogForm> {
    submitData?: any;
}

type EntityDialogContentSubmitPayload = CreateActionSubmitPayload | EditActionSubmitPayload;

export interface EntityDialogContentSubmitData {
    payload: EntityDialogContentSubmitPayload;
    navigateTo: boolean;
    callback: () => any;
}
@Component({
    selector: 'modelingsdk-entity-dialog-content',
    templateUrl: './entity-dialog-content.component.html',
    styleUrls: ['./entity-dialog-content.component.scss']
})
export class EntityDialogContentComponent implements OnInit {
    @Input()
    data: EntityDialogPayload;

    @Output()
    // eslint-disable-next-line @angular-eslint/no-output-native
    submit = new EventEmitter<EntityDialogContentSubmitData>();

    submitButton: string;
    dialogForm: FormGroup;
    prefilledFormValues: Partial<EntityDialogForm>;
    payload: EntityDialogContentSubmitPayload;

    constructor(private entityDialogContentFormService: EntityDialogContentFormService) {}

    ngOnInit() {
        this.dialogForm = this.entityDialogContentFormService.createForm(this.data.fields);

        this.setupSubmitButton();
        this.getPrefilledFormValues();
    }

    getPrefilledFormValues() {
        const values = this.data.values;

        this.prefilledFormValues = {
            name: values?.name ?? '',
            description: values?.description ?? ''
        };

        this.prefillFormValues();
        this.payload = values ? { id: values.id, form: this.prefilledFormValues } : this.prefilledFormValues;
    }

    prefillFormValues() {
        if (this.prefilledFormValues?.name) {
            this.dialogForm.get('name').setValue(this.prefilledFormValues.name);
        }

        if (this.prefilledFormValues?.description) {
            this.dialogForm.get('description').setValue(this.prefilledFormValues.description);
        }
    }

    getDialogFieldsData() {
        if(this.data?.fields?.length > 0) {
            this.data.fields.forEach((field: ModelFieldProperty) => {
                this.payload[field.key] = this.dialogForm.get(field.key).value;
            });
        }
    }

    setupSubmitButton() {
        const { values, submitText } = this.data;
        this.submitButton = values ? 'APP.DIALOGS.SAVE' : submitText;
    }

    createSubmitPayload() {
        if (this.data?.submitData) {
            this.payload.submitData = this.data.submitData;
        }
    }

    onSubmit(): void {
        this.createSubmitPayload();
        this.getDialogFieldsData();

        const navigateTo = this.data.navigateTo ?? true;

        this.submit.emit({
            payload: this.payload,
            navigateTo,
            callback: this.data.callback
        });
    }

    isValid(): boolean {
        return this.dialogForm.valid;
    }

    @HostListener('document:keydown.enter', ['$event.target'])
    keyEvent() {
        if (this.isValid()) {
            this.onSubmit();
        }
    }
}
