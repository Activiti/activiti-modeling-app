 /*!
 * @license
 * Copyright 2018 Alfresco, Inc. and/or its affiliates.
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
import { ApplicationTreeHelper } from '../application-tree.helper';
import { MODEL_TYPE, ModelFilter, OpenFilterAction } from 'ama-sdk';
import { AmaState } from 'ama-sdk';

@Component({
    selector: 'ama-application-tree-icons',
    templateUrl: './application-tree-icons.component.html',
    styleUrls: ['./application-tree-icons.component.scss']
})
export class ApplicationTreeIconsComponent {
    filters: ModelFilter[];

    @Input() applicationId: string;

    constructor(private store: Store<AmaState>, private applicationTreeHelper: ApplicationTreeHelper) {
        this.filters = this.applicationTreeHelper.getFilters();
    }

    onFilterIconClicked(filterType: MODEL_TYPE): void {
        this.store.dispatch(new SetMenuAction(true));
        this.store.dispatch(new OpenFilterAction(filterType));
        this.applicationTreeHelper.getDataAdapter(filterType).load(this.applicationId);
    }
}
