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
import { Router, ActivatedRoute } from '@angular/router';
import { ServerSideSorting } from '@alfresco-dbp/modeling-shared/sdk';
import {SearchTextStateEnum} from '@alfresco/adf-core';

const DEFAULT_SORT_KEY = 'name';
const DEFAULT_SORT_DIRECTION = 'asc';

const maxItems = 25;
const skipCount = 0;
const SEARCH_KEY = 'name';

/**
 * @deprecated, use SearchHeaderComponent inside modeling-shared sdk instead.
 */
@Component({
    selector: 'ama-search-header',
    templateUrl: './search-header.component.html',
    encapsulation: ViewEncapsulation.None
})
export class SearchHeaderComponent implements OnInit {

    value: string;
    expandable: boolean;
    searchInputState = SearchTextStateEnum.collapsed;

    sorting: ServerSideSorting = {
        key: DEFAULT_SORT_KEY,
        direction: DEFAULT_SORT_DIRECTION
    };

    constructor(
        private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.value = this.route.snapshot.queryParamMap.get(SEARCH_KEY);
        this.searchInputState = this.value ? SearchTextStateEnum.expanded : SearchTextStateEnum.collapsed;
    }

    onSearchSubmit(event: KeyboardEvent) {
        const value = (event.target as HTMLInputElement).value.toLowerCase();
        this.searchProjects(value);
    }

    searchProjects(value: string) {
        if (value !== this.value) {
            void this.router.navigate(
                ['dashboard', 'projects'],
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
        this.searchProjects('');
    }
}
