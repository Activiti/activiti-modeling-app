/*!
 * @license
 * Alfresco Example Modeling Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Modeling Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Modeling Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Modeling Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectSelectedAppId, selectMenuOpened } from '../../../store/selectors/app.selectors';
import { FilterType } from 'ama-sdk';
import { ApplicationTreeHelper, ArtifactTypeFilter } from './application-tree.helper';
import { OpenFilterAction, CloseFilterAction } from '../../store/actions/application';
import { AmaState } from 'ama-sdk';

@Component({
    selector: 'ama-application-tree',
    templateUrl: './application-tree.component.html'
})
export class ApplicationTreeComponent implements OnInit {
    expanded$: Observable<boolean>;
    selectedAppId$: Observable<string>;

    filters: ArtifactTypeFilter[];

    constructor(private store: Store<AmaState>, private applicationTreeHelper: ApplicationTreeHelper) {
        this.filters = this.applicationTreeHelper.getFilters();
    }

    ngOnInit() {
        this.expanded$ = this.store.select(selectMenuOpened);
        this.selectedAppId$ = this.store.select(selectSelectedAppId);
    }

    getFilteredContentExpandedState(filterType: string): Observable<boolean> {
        return this.applicationTreeHelper.getDataAdapter(filterType).expanded;
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
