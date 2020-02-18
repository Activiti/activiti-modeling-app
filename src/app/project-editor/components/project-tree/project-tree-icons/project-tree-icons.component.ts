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
import { Store } from '@ngrx/store';
import { SetMenuAction } from '../../../../store/actions';
import { ProjectTreeHelper } from '../project-tree.helper';
import { MODEL_TYPE, ModelFilter, OpenFilterAction, AmaState } from '@alfresco-dbp/modeling-shared/sdk';

@Component({
    selector: 'ama-project-tree-icons',
    templateUrl: './project-tree-icons.component.html',
    styleUrls: ['./project-tree-icons.component.scss']
})
export class ProjectTreeIconsComponent {
    filters: ModelFilter[];

    @Input() projectId: string;

    constructor(private store: Store<AmaState>, private projectTreeHelper: ProjectTreeHelper) {
        this.filters = this.projectTreeHelper.getFilters();
    }

    onFilterIconClicked(filterType: MODEL_TYPE): void {
        this.store.dispatch(new SetMenuAction(true));
        this.store.dispatch(new OpenFilterAction(filterType));
        this.projectTreeHelper.getDataAdapter(filterType).load(this.projectId);
    }
}
