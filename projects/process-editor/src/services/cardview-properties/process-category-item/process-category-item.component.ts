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

import { ProcessModelerServiceToken, ProcessModelerService, BpmnProperty } from '@alfresco-dbp/modeling-shared/sdk';
import { Component, Inject, Input } from '@angular/core';
import { CardViewProcessNameItemModel } from '../process-name-item/process-name-item.model';

@Component({
    selector: 'ama-card-process-category',
    templateUrl: './process-category-item.component.html'
})
export class CardProcessCategoryItemComponent {
    @Input() property: CardViewProcessNameItemModel;

    constructor(
        @Inject(ProcessModelerServiceToken) private processModelerService: ProcessModelerService,
    ) {}

    onCategoryChange(category: string): void {
        this.processModelerService.updateElementProperty(
            this.property.data.element.id,
            BpmnProperty.category,
            category,
        );
    }
}
