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

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { SearchTextStateEnum } from '@alfresco/adf-core';
import { ServerSideSorting } from '../../../api/types';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

const DEFAULT_SORT_KEY = 'name';
const DEFAULT_SORT_DIRECTION = 'asc';

const maxItems = 25;
const skipCount = 0;
const SEARCH_KEY = 'name';

@Component({
    selector: 'modelingsdk-search-header',
    templateUrl: './search-header.component.html',
    encapsulation: ViewEncapsulation.None
})
export class SearchHeaderComponent implements OnInit, OnDestroy {
    @ViewChild('adfSearchInput') adfSearchInput;
    @Input()
    url: string;

    @Output()
    isSearchBarExpanded = new EventEmitter<boolean>();

    value: string;
    expandable: boolean;
    searchInputState = SearchTextStateEnum.collapsed;
    onDestroy$: Subject<void> = new Subject<void>();

    sorting: ServerSideSorting = {
        key: DEFAULT_SORT_KEY,
        direction: DEFAULT_SORT_DIRECTION
    };

    constructor(
        private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.router.events.pipe(
            filter(event => event instanceof NavigationStart),
            takeUntil(this.onDestroy$)
        ).subscribe((event: NavigationStart) => {
            if (!event.url.includes(this.url) && this.searchInputState === SearchTextStateEnum.expanded) {
                this.adfSearchInput.toggleSearchBar();
            }
        });
        this.value = this.route.snapshot.queryParamMap.get(SEARCH_KEY);
        this.searchInputState = this.value ? SearchTextStateEnum.expanded : SearchTextStateEnum.collapsed;
    }

    onSearchSubmit(event: KeyboardEvent) {
        const value = (event.target as HTMLInputElement).value.toLowerCase();
        this.searchProjects(value);
        this.searchInputState = SearchTextStateEnum.expanded;
        this.isSearchBarExpanded.emit(true);
    }

    searchProjects(value: string) {
        if (value !== this.value) {
            const [, dashboardUrl, projectListUrl] = this.url.split('/');
            void this.router.navigate(
                [dashboardUrl, projectListUrl],
                {
                    queryParams: {
                        maxItems, skipCount ,
                        sort: `${this.sorting.key},${this.sorting.direction}`,
                        [SEARCH_KEY]: value
                    },
                    queryParamsHandling: 'merge'
                });
        }
    }

    onReset() {
        this.searchInputState = SearchTextStateEnum.collapsed;
        this.searchProjects('');
    }

    onSearchVisibilityChange(isVisible: boolean) {
        this.searchInputState = isVisible ? SearchTextStateEnum.expanded : SearchTextStateEnum.collapsed;
        this.isSearchBarExpanded.emit(isVisible);
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
