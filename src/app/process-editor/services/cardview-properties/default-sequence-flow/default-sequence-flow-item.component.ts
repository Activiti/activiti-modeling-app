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

import { Component, Input, OnInit } from '@angular/core';
import { CardItemTypeService, CardViewUpdateService } from '@alfresco/adf-core';
import { DefaultSequenceFlowItemModel } from '@alfresco-dbp/modeling-shared/sdk';

@Component({
    selector: 'ama-process-default-sequence-flow',
    templateUrl: './default-sequence-flow-item.component.html',
    providers: [CardItemTypeService]
})
export class CardViewDefaultSequenceFlowItemComponent implements OnInit {
    @Input() property: DefaultSequenceFlowItemModel;

    list: Bpmn.DiagramElement[];
    default: Bpmn.DiagramElement;

    constructor(private cardViewUpdateService: CardViewUpdateService) {}

    ngOnInit() {
        this.list = this.property.value.list || [];
        this.default = this.property.value.default;
    }

    onChange(): void {
        this.cardViewUpdateService.update(this.property, this.default);
    }
}
