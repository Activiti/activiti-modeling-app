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

import {Component, Input, OnInit} from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material';
import { selectApplicationSummaries, selectLoading } from '../../store/selectors/dashboard.selectors';
import { AmaState, Application, OpenConfirmDialogAction } from 'ama-sdk';
import { OpenEntityDialogAction } from '../../../store/actions/dialog';
import {
    DeleteApplicationAttemptAction,
    UpdateApplicationAttemptAction
} from '../../store/actions/applications';
import { sortEntriesByName } from '../../../common/helpers/sort-entries-by-name';

@Component({
    selector: 'ama-applications-list',
    templateUrl: './applications-list.component.html'
})
export class ApplicationsListComponent implements OnInit {
    dataSource$: Observable<MatTableDataSource<Partial<Application>>>;
    loading$: Observable<boolean>;
    displayedColumns = ['thumbnail', 'name', 'created', 'createdBy', 'version', 'menu'];

    @Input() customDataSource$: Observable<Partial<Application>[]>;

    constructor(private store: Store<AmaState>, private router: Router ) {}

    ngOnInit() {
        this.loading$ = this.store.select(selectLoading);
        this.dataSource$ = (this.customDataSource$ || this.store.select(selectApplicationSummaries).pipe(
            map(entries => Object.keys(entries).map(id => entries[id]))
        )).pipe(
            map(sortEntriesByName),
            map(entriesArray =>  new MatTableDataSource<Partial<Application>>(entriesArray))
        );
    }

    rowSelected(item: Partial<Application>): void {
        this.router.navigate(['applications', item.id]);
    }

    editRow(item: Partial<Application>): void {
        const { id, name, description } = item;
        this.store.dispatch(new OpenEntityDialogAction({
            title: 'APP.HOME.NEW_MENU.EDIT_APP_TITLE',
            nameField: 'APP.HOME.DIALOGS.APP_NAME',
            descriptionField: 'APP.HOME.DIALOGS.APP_DESC',
            values: { id, name, description },
            action: UpdateApplicationAttemptAction
        }));
    }

    deleteRow(item: Partial<Application>): void {
        const action = new DeleteApplicationAttemptAction(item.id);

        this.store.dispatch(new OpenConfirmDialogAction({
            dialogData: {
                subtitle: 'APP.DIALOGS.CONFIRM.CUSTOM.APPLICATION'
            },
            action: action
        }));
    }
}
