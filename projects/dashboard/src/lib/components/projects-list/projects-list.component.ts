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

import { Component, Input, OnInit, Inject, Optional, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';
import {
    AmaState, Project, OpenConfirmDialogAction, MODELER_NAME_REGEX, Pagination, ServerSideSorting,
    SearchQuery, OpenEntityDialogAction, ProjectContextMenuOption, PROJECT_CONTEXT_MENU_OPTIONS,
    ProjectContextMenuActionClass, selectLoading, selectPagination, selectProjectSummaries,
    GetProjectsAttemptAction, DeleteProjectAttemptAction, UpdateProjectAttemptAction, OpenSaveAsProjectDialogAction,
    SaveAsProjectAttemptAction, ExportProjectAction,
    GetFavoriteProjectsAttemptAction, selectFavoriteProjectSummaries, LayoutService
} from '@alfresco-dbp/modeling-shared/sdk';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

const DEFAULT_SORT_KEY = 'lastModifiedDate';
const DEFAULT_SORT_DIRECTION = 'desc';

@Component({
    selector: 'ama-projects-list',
    templateUrl: './projects-list.component.html',
    styleUrls: ['./projects-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProjectsListComponent implements OnInit, OnDestroy {
    dataSource$: Observable<MatTableDataSource<Partial<Project>>>;
    loading$: Observable<boolean>;
    pagination$: Observable<Pagination>;
    displayedColumns = ['name', 'lastModifiedDate', 'creationDate', 'createdBy', 'version', 'menu', 'favorite'];
    pageSizeOptions = [10, 25, 50, 100, 1000];
    sorting: ServerSideSorting = {
        key: DEFAULT_SORT_KEY,
        direction: DEFAULT_SORT_DIRECTION
    };
    private unsubscribe$ = new Subject<void>();

    @Input() customDataSource$: Observable<Partial<Project>[]>;

    search: SearchQuery = {
        key: 'name',
        value: null
    };

    private maxItems = 25;
    private skipCount = 0;
    isFavoriteList: boolean;

    constructor(
        @Inject(PROJECT_CONTEXT_MENU_OPTIONS)
        @Optional() public buttons: ProjectContextMenuOption[],
        private store: Store<AmaState>,
        private router: Router,
        private route: ActivatedRoute,
        private layoutService: LayoutService) {
    }

    ngOnInit() {
        this.route.url.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
            if (params[0].path === 'favorite-projects') {
                this.isFavoriteList = true;
            }
        });
        this.route.queryParams.pipe(takeUntil(this.unsubscribe$))
            .subscribe(params => {
                this.maxItems = +params.maxItems || 25;
                this.skipCount = +params.skipCount || 0;
                this.sorting = this.parseSorting(params.sort);
                this.search.value = params[this.search.key];
                this.loadProjects();
            });

        this.loading$ = this.store.select(selectLoading);
        this.pagination$ = this.store.select(selectPagination);
        this.dataSource$ = (this.customDataSource$ || this.store.select(this.isFavoriteList ? selectFavoriteProjectSummaries : selectProjectSummaries).pipe(
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

        this.store.dispatch(this.isFavoriteList ?
            new GetFavoriteProjectsAttemptAction({ maxItems, skipCount }, sorting, search) :
            new GetProjectsAttemptAction({ maxItems, skipCount }, sorting, search)
        );
    }

    isMobileScreen() {
        return this.layoutService.isTabletWidth();
    }

    onPageChange(event: PageEvent, pagination: Pagination) {
        const maxItems = event.pageSize;
        const skipCount = event.pageSize === pagination.maxItems ? event.pageSize * event.pageIndex : 0;

        void this.router.navigate(
            ['dashboard', this.redirectTo()],
            {
                queryParams: { maxItems, skipCount },
                queryParamsHandling: 'merge'
            }
        );
    }

    onSearchChanged(value: string) {
        void this.router.navigate(
            ['dashboard', this.redirectTo()],
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
        void this.router.navigate(
            ['dashboard', this.redirectTo()],
            {
                queryParams: {
                    sort: `${sort.active},${sort.direction}`,
                    [this.search.key]: this.search.value
                },
                queryParamsHandling: 'merge'
            }
        );
    }

    redirectTo() {
        let redirectTo = 'projects';
        if (this.isFavoriteList) {
            redirectTo = 'favorite-projects';
        }
        return redirectTo;
    }

    rowSelected(item: Partial<Project>): void {
        void this.router.navigate(['projects', item.id]);
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

    saveAsProject(project: Partial<Project>) {
        this.store.dispatch(new OpenSaveAsProjectDialogAction({
            id: project.id,
            name: project.name,
            action: SaveAsProjectAttemptAction
        }));
    }

    handleClick(actionClass: ProjectContextMenuActionClass, projectId: string) {
        this.store.dispatch(new actionClass(projectId));
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

}
