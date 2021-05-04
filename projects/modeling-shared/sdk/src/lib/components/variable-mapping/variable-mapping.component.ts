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

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { VariableMappingBehavior } from '../../interfaces/variable-mapping-type.interface';
import { MatSelectChange } from '@angular/material/select';

@Component({
    selector: 'modelingsdk-variable-mapping-type',
    templateUrl: './variable-mapping.component.html'
})
export class VariableMappingTypeComponent {

    @Input()
    mappingBehavior: VariableMappingBehavior;

    @Input()
    canShowMapVariableOption = true;

    @Output()
    mappingBehaviorChange = new EventEmitter<VariableMappingBehavior>();

    variableBehaviorList = {
        none: VariableMappingBehavior.MAP_NO_VARIABLE,
        all: VariableMappingBehavior.MAP_ALL,
        map: VariableMappingBehavior.MAP_VARIABLE,
        inputs: VariableMappingBehavior.MAP_ALL_INPUTS,
        outputs: VariableMappingBehavior.MAP_ALL_OUTPUTS
    };

    onChangeMappingBehavior(event: MatSelectChange) {
        this.mappingBehaviorChange.emit(event.value);
    }

    canShowVariableMapping() {
        return this.mappingBehavior === VariableMappingBehavior.MAP_VARIABLE;
    }
}
