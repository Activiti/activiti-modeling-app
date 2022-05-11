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
import {
    Connector, ConnectorContent, ExtensionErrorProviderInterface, ExtensionErrorGroup,
    AmaState, selectProjectConnectorsArray, CONNECTOR
} from '@alfresco-dbp/modeling-shared/sdk';
import { forkJoin, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { ConnectorEditorService } from '../services/connector-editor.service';

@Injectable({
    providedIn: 'root'
})
export class ConnectorErrorProviderService implements ExtensionErrorProviderInterface {

    constructor(
        private store: Store<AmaState>,
        private connectorEditorService: ConnectorEditorService,
    ) { }

    modelType = CONNECTOR;

    prepareEntities(): void {
    }

    getErrors(): Observable<ExtensionErrorGroup[]> {
        const connectorContentObservables: Observable<ConnectorContent>[] = [];
        this.getConnectorsIds().forEach(id => connectorContentObservables.push(this.connectorEditorService.getContent(id)));
        return forkJoin([...connectorContentObservables]).pipe(
            map((contents: ConnectorContent[]) => contents.map(content => ({
                type: CONNECTOR,
                name: content.name,
                errors: content.errors?.map(error => ({ name: error.name, code: error.code }))
            }))),
            take(1)
        );
    }

    private getConnectorsIds(): string[] {
        let connectorsIds: string[];
        this.store.select(selectProjectConnectorsArray).pipe(take(1))
            .subscribe((connectors: Connector[]) => {
                connectorsIds = connectors.map(connector => connector.id);
            });
        return connectorsIds;
    }
}
