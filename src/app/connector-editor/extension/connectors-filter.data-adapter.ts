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
import { Observable } from 'rxjs';
import { Connector, CONNECTOR, FilterDataAdaper, AmaState, selectProjectConnectorsArray, ShowModelsAction } from 'ama-sdk';
import { Store } from '@ngrx/store';
import { selectConnectorsLoading } from '../store/connector-editor.selectors';
import { map } from 'rxjs/operators';

@Injectable()
export class ConnectorsFilterDataAdapter implements FilterDataAdaper {
    constructor(private store: Store<AmaState>) {}

    get expandedPredicate() {
        return (filters) => filters.indexOf(CONNECTOR) !== -1;
    }

    get contents(): Observable<Connector[]> {
        return this.store.select(selectProjectConnectorsArray).pipe(
            map<Connector[], Connector[]>(connectors => connectors.filter(connector => !connector.template))
        );
    }

    get loading(): Observable<boolean> {
        return this.store.select(selectConnectorsLoading);
    }

    load(projectId: string): void {
        this.store.dispatch(new ShowModelsAction(projectId, CONNECTOR));
    }
}
