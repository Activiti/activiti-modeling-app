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

import { Component, Input, OnInit, Inject, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { MatTableDataSource, PageEvent, Sort } from '@angular/material';
import {
    AmaState, Project, OpenConfirmDialogAction, MODELER_NAME_REGEX, Pagination, ServerSideSorting,
    SearchQuery, OpenEntityDialogAction, ProjectContextMenuOption,
    PROJECT_CONTEXT_MENU_OPTIONS, ProjectContextMenuActionClass,
    selectLoading, selectPagination, selectProjectSummaries, GetProjectsAttemptAction, DeleteProjectAttemptAction, UpdateProjectAttemptAction
} from '@alfresco-dbp/modeling-shared/sdk';
import { ExportProjectAction } from '../../../project-editor/store/project-editor.actions';

const DEFAULT_SORT_KEY = 'name';
const DEFAULT_SORT_DIRECTION = 'asc';

@Component({
    selector: 'ama-projects-list',
    templateUrl: './projects-list.component.html'
})
export class ProjectsListComponent implements OnInit {
    dataSource$: Observable<MatTableDataSource<Partial<Project>>>;
    loading$: Observable<boolean>;
    pagination$: Observable<Pagination>;
    displayedColumns = ['thumbnail', 'name', 'creationDate', 'createdBy', 'version', 'menu'];
    pageSizeOptions = [10, 25, 50, 100, 1000];
    sorting: ServerSideSorting = {
        key: DEFAULT_SORT_KEY,
        direction: DEFAULT_SORT_DIRECTION
    };

    @Input() customDataSource$: Observable<Partial<Project>[]>;

    search: SearchQuery = {
        key: 'name',
        value: null
    };

    private maxItems = 25;
    private skipCount = 0;

    constructor(
        @Inject(PROJECT_CONTEXT_MENU_OPTIONS)
        @Optional() public buttons: ProjectContextMenuOption[],
        private store: Store<AmaState>,
        private router: Router,
        private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.maxItems = +this.route.snapshot.queryParamMap.get('maxItems') || 25;
        this.skipCount = +this.route.snapshot.queryParamMap.get('skipCount') || 0;
        this.sorting = this.parseSorting(this.route.snapshot.queryParamMap.get('sort'));
        this.search.value = this.route.snapshot.queryParamMap.get(this.search.key);

        this.loadProjects();

        this.loading$ = this.store.select(selectLoading);
        this.pagination$ = this.store.select(selectPagination);
        this.dataSource$ = (this.customDataSource$ || this.store.select(selectProjectSummaries).pipe(
            map(entries => Object.keys(entries).map(id => entries[id]))
        )).pipe(
            map(entriesArray => new MatTableDataSource<Partial<Project>>(entriesArray))
        );
    }

    private parseSorting(value: string): ServerSideSorting {
        if (value) {
            const [key, direction] = value.split(',');
            return {
                key: key || DEFAULT_SORT_KEY,
                direction: direction || DEFAULT_SORT_DIRECTION
            };
        }

        return { key: DEFAULT_SORT_KEY, direction: DEFAULT_SORT_DIRECTION };
    }

    private loadProjects() {
        const { maxItems, skipCount, sorting, search } = this;

        this.store.dispatch(
            new GetProjectsAttemptAction({ maxItems, skipCount }, sorting, search)
        );
    }

    onPageChange(event: PageEvent, pagination: Pagination) {
        const maxItems = event.pageSize;
        const skipCount = event.pageSize === pagination.maxItems ? event.pageSize * event.pageIndex : 0;

        this.router.navigate(
            ['dashboard', 'projects'],
            {
                queryParams: { maxItems, skipCount },
                queryParamsHandling: 'merge'
            }
        );
    }

    onSearchChanged(value: string) {

        this.router.navigate(
            ['dashboard', 'projects'],
            {
                queryParams: {
                    sort: `${this.sorting.key},${this.sorting.direction}`,
                    [this.search.key]: value,
                    skipCount: 0
                },
                queryParamsHandling: 'merge'
            }
        );
    }

    onSortChange(sort: Sort) {
        this.router.navigate(
            ['dashboard', 'projects'],
            {
                queryParams: {
                    sort: `${sort.active},${sort.direction}`,
                    [this.search.key]: this.search.value
                },
                queryParamsHandling: 'merge'
            }
        );
    }

    rowSelected(item: Partial<Project>): void {
        this.router.navigate(['projects', item.id]);
    }

    editRow(item: Partial<Project>): void {
        const { id, name, description } = item;

        this.store.dispatch(new OpenEntityDialogAction({
            title: 'DASHBOARD.NEW_MENU.EDIT_PROJECT_TITLE',
            nameField: 'DASHBOARD.DIALOGS.PROJECT_NAME',
            descriptionField: 'DASHBOARD.DIALOGS.PROJECT_DESC',
            values: { id, name, description },
            action: UpdateProjectAttemptAction,
            allowedCharacters: {
                regex: MODELER_NAME_REGEX,
                error: 'APP.DIALOGS.ERROR.GENERAL_NAME_VALIDATION'
            }
        }));
    }

    deleteRow(item: Partial<Project>): void {
        this.store.dispatch(new OpenConfirmDialogAction({
            dialogData: { title: 'APP.DIALOGS.CONFIRM.DELETE.PROJECT' },
            action: new DeleteProjectAttemptAction(item.id, this.sorting, this.search)
        }));
    }

    downloadProject(project: Project) {
        if (project) {
            const payload = {
                projectId: project.id,
                projectName: project.name
            };
            this.store.dispatch(new ExportProjectAction(payload));
        }
    }

    handleClick(actionClass: ProjectContextMenuActionClass, projectId: string) {
        this.store.dispatch(new actionClass(projectId));
    }
}
