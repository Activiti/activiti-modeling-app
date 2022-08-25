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

import { Component, ViewEncapsulation, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { AmaState, selectSelectedProjectId } from '@alfresco-dbp/modeling-shared/sdk';
import { MatDialogRef } from '@angular/material/dialog';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs/operators';
import { ProjectTreeSearchService } from '../../services/project-tree-search.service';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

export class SearchOption {
    name: string;
    type: string;
    icon: string;
    id: string;
}

@Component({
    templateUrl: './project-element-search-dialog.component.html',
    styleUrls: ['./project-element-search-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectElementSearchDialogComponent implements OnInit, OnDestroy {

    modelControl = new UntypedFormControl('');
    filteredOptions$: Observable<SearchOption[]>;
    private currentProjectId = null;

    private onDestroy$ = new Subject();

    constructor(public dialog: MatDialogRef<ProjectElementSearchDialogComponent>,
                private store: Store<AmaState>,
                private projectTreeSearchService: ProjectTreeSearchService,
                private router: Router,
                private activatedRoute: ActivatedRoute) {
        this.store.select(selectSelectedProjectId).pipe(takeUntil(this.onDestroy$))
            .subscribe((projectId) => this.currentProjectId = projectId);
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    ngOnInit(): void {
        this.filteredOptions$ = this.modelControl.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(value => this.projectTreeSearchService.searchByName(this.currentProjectId, value)),
            map(result => result.entries),
            map((entries) =>
                entries.map((element) => <SearchOption> {
                        id: element.id,
                        name: element.name,
                        type: element.type.toLocaleLowerCase(),
                        icon: this.projectTreeSearchService.getIconByType(element.type)
                }))
        );
    }

    navigateToModel(option: SearchOption) {
        void this.router.navigate(['projects', this.currentProjectId, option.type, option.id], { relativeTo: this.activatedRoute });
        this.dialog.close();
    }

}
