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

import { AssignmentStrategyMode } from '@alfresco-dbp/modeling-shared/sdk';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

export interface AssignmentStrategy {
    key: AssignmentStrategyMode;
    label: string;
}

@Component({
    selector: 'ama-assignment-strategy-selector',
    templateUrl: './assignment-strategy-selector.component.html',
    styleUrls: ['./assignment-strategy-selector.component.scss']
})
export class  AssignmentStrategySelectorComponent {

    @Input()
    defaultStrategy = AssignmentStrategyMode.manual;

    @Output()
    changeStrategy = new EventEmitter<AssignmentStrategyMode>();

    assignmentStrategies: AssignmentStrategy[] = [
        {
            key: AssignmentStrategyMode.manual,
            label: 'Manual'
        },
        {
            key: AssignmentStrategyMode.sequential,
            label: 'Sequential'
        },
    ];

    onSelect(selected: MatSelectChange) {
        this.changeStrategy.emit(selected.value);
    }

}
