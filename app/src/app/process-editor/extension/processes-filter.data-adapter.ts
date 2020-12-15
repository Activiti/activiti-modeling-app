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

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PROCESS, FilterDataAdapter, AmaState, Filter } from '@alfresco-dbp/modeling-shared/sdk';
import { selectProcessesArray, selectProcessesLoading } from '../store/process-editor.selectors';
import { ShowProcessesAction } from '../store/process-editor.actions';

@Injectable()
export class ProcessesFilterDataAdapter implements FilterDataAdapter {
    constructor(private store: Store<AmaState>) {}

    get expandedPredicate() {
        return (filters) => filters.indexOf(PROCESS) !== -1;
    }

    get contents(): Observable<Partial<Filter>[]> {
        return this.store.select(selectProcessesArray);
    }

    get loading(): Observable<boolean> {
        return this.store.select(selectProcessesLoading);
    }

    load(projectId: string): void {
        this.store.dispatch(new ShowProcessesAction(projectId));
    }
}
