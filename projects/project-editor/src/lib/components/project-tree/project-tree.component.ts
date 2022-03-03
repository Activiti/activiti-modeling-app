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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectSelectedProjectId, MODEL_TYPE, ModelFilter, OpenFilterAction, Filter, AmaState, selectMenuOpened, PROCESS } from '@alfresco-dbp/modeling-shared/sdk';
import { ProjectTreeHelper } from './project-tree.helper';
import { ChangeFilterStatus, CloseFilterAction } from '../../store/project-editor.actions';
import { selectOpenedFilters } from '../../store/selectors/project-tree.selectors';
import { delay, map } from 'rxjs/operators';
@Component({
    selector: 'ama-project-tree',
    templateUrl: './project-tree.component.html',
    styleUrls: ['./project-tree.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProjectTreeComponent implements OnInit {
    expanded$: Observable<boolean>;
    selectedProjectId$: Observable<string>;
    openedFilters$: Observable<MODEL_TYPE[]>;

    filters: ModelFilter[];

    constructor(private store: Store<AmaState>, private projectTreeHelper: ProjectTreeHelper) {
        this.filters = this.projectTreeHelper.getFilters();
    }

    ngOnInit() {
        this.expanded$ = this.store.select(selectMenuOpened);
        this.selectedProjectId$ = this.store.select(selectSelectedProjectId);
        this.openedFilters$ = this.store.select(selectOpenedFilters);
        this.store.dispatch(new OpenFilterAction(PROCESS));
    }

    getFilteredContentExpandedState(filterType: string): Observable<boolean> {
        const expandedPredicate = this.projectTreeHelper.getDataAdapter(filterType).expandedPredicate;
        return this.openedFilters$.pipe(map(expandedPredicate));
    }

    getFilteredContents(filterType: string): Observable<Partial<Filter>[]> {
        return this.projectTreeHelper.getDataAdapter(filterType).contents;
    }

    getFilteredContentLoading(filterType: string): Observable<boolean> {
        return this.projectTreeHelper.getDataAdapter(filterType).loading.pipe(delay(0));
    }

    closeFilter({ type }) {
        this.store.dispatch(new CloseFilterAction(type));
    }

    openFilter({ projectId, type, loadData }): void {
        if (loadData) {
            this.projectTreeHelper.getDataAdapter(type).load(projectId);
        }
        this.store.dispatch(new OpenFilterAction(type));
    }

    changeFilterStatus({ type }) {
        this.store.dispatch(new ChangeFilterStatus(type));
    }
}
