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

import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { map, filter } from 'rxjs/operators';
import { MatTableDataSource, PageEvent } from '@angular/material';
import { AmaState, Pagination, BreadcrumbItem, selectProjectCrumb } from 'ama-sdk';
import { Release } from 'ama-sdk';
import { GetProjectReleasesAttemptAction } from '../../store/actions/releases';
import { ActivatedRoute } from '@angular/router';
import { selectLoadedProjectReleases, selectReleasesPagination, selectReleaseSummaries } from '../../store/selectors/dashboard.selectors';
import { combineLatest } from 'rxjs';

@Component({
    selector: 'ama-release-list',
    templateUrl: 'releases-list.component.html',
    host: { class: 'ama-release-list'}
})
export class ReleaseListComponent implements OnInit, OnDestroy {
    dataSource$: Observable<MatTableDataSource<Partial<Release>>>;
    loading$: Observable<boolean>;
    projectId: string;
    pagination$: Observable<Pagination>;
    subscription: Subscription = <Subscription>{ unsubscribe: () => {} };
    displayedColumns = ['thumbnail', 'id', 'createdBy',  'created', 'version'];
    pageSizeOptions = [ 10, 25, 50, 100 ];
    breadcrumbs$: Observable<BreadcrumbItem[]>;

    @Input() customDataSource$: Observable<Partial<Release>[]>;

    constructor(private store: Store<AmaState>, private route: ActivatedRoute) {}

    ngOnInit() {
        this.getProjectId();
        this.store.dispatch(new GetProjectReleasesAttemptAction(this.projectId, { maxItems: 25 }));
        this.loading$ = this.store.select(selectLoadedProjectReleases);
        this.pagination$ = this.store.select(selectReleasesPagination);
        this.dataSource$ = (this.customDataSource$ || this.store.select(selectReleaseSummaries).pipe(
            map(entries => Object.keys(entries).map(id => entries[id]))
        )).pipe(
            map(entriesArray =>  new MatTableDataSource<Partial<Release>>(entriesArray))
        );

        this.breadcrumbs$ = combineLatest(
            of({ url: '/home', name: 'Dashboard' }),
            this.store.select(selectProjectCrumb).pipe(filter(value => value !== null)),
            of({name: 'releases'})
        );
    }

    getProjectId() {
        this.subscription = this.route.params.subscribe(params => {
            this.projectId = params['projectId'];
         });
    }

    onPageChange(event: PageEvent, pagination: Pagination) {
        this.store.dispatch(new GetProjectReleasesAttemptAction(this.projectId, {
            maxItems: event.pageSize,
            skipCount: event.pageSize === pagination.maxItems ? event.pageSize * event.pageIndex : 0
        }));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
      }
}
