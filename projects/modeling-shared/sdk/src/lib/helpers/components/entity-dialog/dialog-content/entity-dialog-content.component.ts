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

import { Component, OnInit, HostListener, ViewChild, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { EntityDialogPayload, AllowedCharacters, EntityDialogForm } from '../../../common';
import { MODELER_NAME_REGEX } from '../../../utils/create-entries-names';

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
    allowedCharacters: AllowedCharacters;
    form: Partial<EntityDialogForm>;
    ENTER_KEY = 13;

    @ViewChild('entityName', { static: true })
    private entityNameField: ElementRef<HTMLElement>;

    @ViewChild('buttonSubmit', { static: true })
    private submitButtonField: ElementRef<HTMLElement>;

    ngOnInit() {
        const { values, allowedCharacters } = this.data;
        this.submitButton = values ? 'APP.DIALOGS.SAVE' : 'APP.DIALOGS.CREATE';
        this.allowedCharacters = allowedCharacters || {
            regex: MODELER_NAME_REGEX,
            error: 'APP.DIALOGS.ERROR.GENERAL_NAME_VALIDATION'
        };
        this.form = {
            name: values?.name ? values.name : '',
            description: values?.description ? values.description : ''
        };
    }

    validate(): boolean {
        return this.allowedCharacters.regex.test(this.form.name);
    }

    onSubmit(): void {
        const { values } = this.data;
        const payload: EntityDialogContentSubmitPayload =
            values ? { id: values.id, form: this.form } : this.form;

        if (this.data.submitData) {
            payload.submitData = this.data.submitData;
        }

        const navigateTo = this.data.navigateTo !== undefined ? this.data.navigateTo : true;
        this.submit.emit({
            payload,
            navigateTo,
            callback: this.data.callback
        });
    }

    @HostListener('document:keydown.enter', ['$event.target'])
    keyEvent(element: HTMLElement) {
        if (this.validate() && (element === this.entityNameField.nativeElement || element === this.submitButtonField.nativeElement)) {
            this.onSubmit();
        }
    }
}
