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

import { Component, Input } from '@angular/core';
import { VariablesService } from '../../../variables.service';
import { PropertiesViewerModelValidatedInputComponent } from '../../model-validated-input.component';

@Component({
    templateUrl: './integer-input.component.html'
})

export class PropertiesViewerIntegerInputComponent extends PropertiesViewerModelValidatedInputComponent {

    @Input() step: number = null;
    regexInput = /^[0-9]*$/;

    constructor(variablesService: VariablesService) {
        super(variablesService);
    }

    protected computeModel() {
        if (this.model?.multipleOf) {
            this.step = this.model.multipleOf;
        }
    }

    protected transformValueToBeEmitted(value: any) {
        const inputValue = parseInt(value, 10);
        return isNaN(inputValue) ? null : inputValue;
    }
}
