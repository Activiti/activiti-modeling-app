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

import { TranslationService } from '@alfresco/adf-core';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldValidator, ModelFieldProperty } from '../../../../interfaces/model-creator.interface';
import { InstantErrorStateMatcher } from '../../../utils/instant-error-state-matcher';

@Component({
    selector: 'modelingsdk-entity-dialog-inputs-generator',
    templateUrl: './entity-dialog-inputs-generator.component.html',
    styleUrls: ['./entity-dialog-inputs-generator.component.scss'],
})
export class EntityDialogInputsGeneratorComponent {

    @Input()
    formGroup: FormGroup;

    @Input()
    fieldProperty: ModelFieldProperty[];

    matcher = new InstantErrorStateMatcher();

    constructor(private translationService: TranslationService) {}

    getInputFormControl(fieldKey: string): FormControl {
        return this.formGroup.get(fieldKey) as FormControl;
    }

    displayError(fieldKey: string, errorType: string): boolean {
        return this.getInputFormControl(fieldKey).hasError(errorType);
    }

    getErrorMessage(validator?: FieldValidator, label?: string) {
        if(validator) {
            if (validator.type === 'required') {
                return label ?
                    this.translationService.instant('SDK.CREATE_DIALOG.ERROR.REQUIRED', { fieldLabel: this.translationService.instant(label) }) :
                    this.translationService.instant('SDK.CREATE_DIALOG.ERROR.DEFAULT_REQUIRED');
            } else {
                return this.translationService.instant(validator.error);
            }
        } else {
            return '';
        }
    }
}
