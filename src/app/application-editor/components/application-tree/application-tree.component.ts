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

import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectMenuOpened } from '../../../store/selectors/app.selectors';
import { selectSelectedAppId, MODEL_TYPE, ModelFilter, OpenFilterAction } from 'ama-sdk';
import { FilterType } from 'ama-sdk';
import { ApplicationTreeHelper } from './application-tree.helper';
import { CloseFilterAction } from '../../store/actions/application';
import { AmaState } from 'ama-sdk';
import { selectOpenedFilters } from '../../store/selectors/application-tree.selectors';
import { map } from 'rxjs/operators';

@Component({
    selector: 'ama-application-tree',
    templateUrl: './application-tree.component.html'
})
export class ApplicationTreeComponent implements OnInit {
    expanded$: Observable<boolean>;
    selectedAppId$: Observable<string>;
    openedFilters$: Observable<MODEL_TYPE[]>;

    filters: ModelFilter[];

    constructor(private store: Store<AmaState>, private applicationTreeHelper: ApplicationTreeHelper) {
        this.filters = this.applicationTreeHelper.getFilters();
    }

    ngOnInit() {
        this.expanded$ = this.store.select(selectMenuOpened);
        this.selectedAppId$ = this.store.select(selectSelectedAppId);
        this.openedFilters$ = this.store.select(selectOpenedFilters);
    }

    getFilteredContentExpandedState(filterType: string): Observable<boolean> {
        const expandedPredicate = this.applicationTreeHelper.getDataAdapter(filterType).expandedPredicate;
        return this.openedFilters$.pipe(map(expandedPredicate));
    }

    getFilteredContents(filterType: string): Observable<Partial<FilterType>[]> {
        return this.applicationTreeHelper.getDataAdapter(filterType).contents;
    }

    getFilteredContentLoading(filterType: string): Observable<boolean> {
        return this.applicationTreeHelper.getDataAdapter(filterType).loading;
    }

    closeFilter({ type }) {
        this.store.dispatch(new CloseFilterAction(type));
    }

    openFilter({ applicationId, type, loadData }): void {
        if (loadData) {
            this.applicationTreeHelper.getDataAdapter(type).load(applicationId);
        }
        this.store.dispatch(new OpenFilterAction(type));
    }
}
