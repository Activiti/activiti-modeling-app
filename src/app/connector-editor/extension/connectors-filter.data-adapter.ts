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

import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
    Connector,
    CONNECTOR,
    FilterDataAdapter,
    AmaState,
    CONNECTOR_SELECTORS_TOKEN,
    Filter
} from '@alfresco-dbp/modeling-shared/sdk';
import { Store, MemoizedSelector } from '@ngrx/store';
import { selectConnectorsLoading } from '../store/connector-editor.selectors';
import { ShowConnectorsAction } from '../store/connector-editor.actions';

@Injectable()
export class ConnectorsFilterDataAdapter implements FilterDataAdapter {
    constructor(
        private store: Store<AmaState>,
        @Inject(CONNECTOR_SELECTORS_TOKEN) private selectProjectConnectorsArray: MemoizedSelector<object, Connector[]>
    ) {}

    get expandedPredicate() {
        return (filters) => filters.indexOf(CONNECTOR) !== -1;
    }

    get contents(): Observable<Filter[]> {
        return this.store.select(this.selectProjectConnectorsArray);
    }

    get loading(): Observable<boolean> {
        return this.store.select(selectConnectorsLoading);
    }

    load(projectId: string): void {
        this.store.dispatch(new ShowConnectorsAction(projectId));
    }
}
