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

import { Store, MemoizedSelector } from '@ngrx/store';
import { combineLatest, of, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AmaState } from '../../store/app.state';
import { selectProjectCrumb } from '../../store/project.selectors';
import { Injectable } from '@angular/core';

export interface BreadcrumbItem {
    name?: string;
    url?: string;
}

@Injectable({
    providedIn: 'root'
})
export class BreadCrumbHelperService {
    constructor(private store: Store<AmaState>) {}

    getModelCrumbs(modelCrumbSelector$: MemoizedSelector<AmaState, any>): Observable<BreadcrumbItem[]> {
        return combineLatest([
            of({ url: '/home', name: 'Dashboard' }),
            this.store.select(selectProjectCrumb).pipe(filter(value => value !== null)),
            this.store.select(modelCrumbSelector$).pipe(filter(value => !!value))
        ]);
    }

    getBaseCrumbs() {
        return combineLatest([
            of({ url: '/home', name: 'Dashboard' }),
            this.store.select(selectProjectCrumb).pipe(filter(value => value !== null))
        ]);
    }
}
