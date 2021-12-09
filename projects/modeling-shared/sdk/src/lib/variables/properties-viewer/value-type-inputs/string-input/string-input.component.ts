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
    templateUrl: './string-input.component.html'
})

export class PropertiesViewerStringInputComponent extends PropertiesViewerModelValidatedInputComponent {

    @Input() readonly: boolean;
    useTextArea = false;

    constructor(variablesService: VariablesService) {
        super(variablesService);
    }

    protected transformValueToBeEmitted(value: any) {
        return (value && value.length) ? value : null;
    }

    protected computeModel() {
        const regex = this.model?.pattern;
        if (regex) {
            let pattern = '';

            if (regex.charAt(0) !== '^') {
                pattern += '^';
            }

            pattern += regex;

            if (regex.charAt(regex.length - 1) !== '$') {
                pattern += '$';
            }

            const regularExpression = new RegExp(pattern);

            this.useTextArea = regularExpression.test('\n');
        } else {
            this.useTextArea = false;
        }
    }
}
