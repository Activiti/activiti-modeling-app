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

import { MODEL_FILTERS, CONNECTOR, ModelFilter, CONNECTOR_ICON } from '@alfresco-dbp/modeling-shared/sdk';
import { ConnectorsFilterDataAdapter } from './connectors-filter.data-adapter';

export function createConnectorsFilter(connectorsFilterDataAdapter: ConnectorsFilterDataAdapter): ModelFilter {
    return {
        type: CONNECTOR,
        name: 'PROJECT_EDITOR.TREE.CONNECTORS',
        icon: CONNECTOR_ICON,
        adapter: connectorsFilterDataAdapter,
        order: 2
    };
}

export function getConnectorsFilterProvider() {
    return [
        ConnectorsFilterDataAdapter,
        {
            provide: MODEL_FILTERS,
            useFactory: createConnectorsFilter,
            deps: [ConnectorsFilterDataAdapter],
            multi: true
        }
    ];
}
