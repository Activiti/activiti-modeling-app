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

import {Component, Input, OnInit} from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material';
import { selectProjectSummaries, selectLoading } from '../../store/selectors/dashboard.selectors';
import { AmaState, Project, OpenConfirmDialogAction } from 'ama-sdk';
import { OpenEntityDialogAction } from '../../../store/actions/dialog';
import {
    DeleteProjectAttemptAction,
    UpdateProjectAttemptAction
} from '../../store/actions/projects';
import { sortEntriesByName } from '../../../common/helpers/sort-entries-by-name';

@Component({
    selector: 'ama-projects-list',
    templateUrl: './projects-list.component.html'
})
export class ProjectsListComponent implements OnInit {
    dataSource$: Observable<MatTableDataSource<Partial<Project>>>;
    loading$: Observable<boolean>;
    displayedColumns = ['thumbnail', 'name', 'created', 'createdBy', 'version', 'menu'];

    @Input() customDataSource$: Observable<Partial<Project>[]>;

    constructor(private store: Store<AmaState>, private router: Router ) {}

    ngOnInit() {
        this.loading$ = this.store.select(selectLoading);
        this.dataSource$ = (this.customDataSource$ || this.store.select(selectProjectSummaries).pipe(
            map(entries => Object.keys(entries).map(id => entries[id]))
        )).pipe(
            map(sortEntriesByName),
            map(entriesArray =>  new MatTableDataSource<Partial<Project>>(entriesArray))
        );
    }

    rowSelected(item: Partial<Project>): void {
        this.router.navigate(['projects', item.id]);
    }

    editRow(item: Partial<Project>): void {
        const { id, name, description } = item;
        this.store.dispatch(new OpenEntityDialogAction({
            title: 'APP.HOME.NEW_MENU.EDIT_PROJECT_TITLE',
            nameField: 'APP.HOME.DIALOGS.PROJECT_NAME',
            descriptionField: 'APP.HOME.DIALOGS.PROJECT_DESC',
            values: { id, name, description },
            action: UpdateProjectAttemptAction
        }));
    }

    deleteRow(item: Partial<Project>): void {
        const action = new DeleteProjectAttemptAction(item.id);

        this.store.dispatch(new OpenConfirmDialogAction({
            dialogData: {
                subtitle: 'APP.DIALOGS.CONFIRM.CUSTOM.PROJECT'
            },
            action: action
        }));
    }
}
