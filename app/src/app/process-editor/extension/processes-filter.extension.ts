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

import { MODEL_FILTERS, PROCESS, ModelFilter } from '@alfresco-dbp/modeling-shared/sdk';
import { ProcessesFilterDataAdapter } from './processes-filter.data-adapter';

export const PROCESS_ICON = 'device_hub';

export function createProcessesFilter(processesFilterDataAdapter: ProcessesFilterDataAdapter): ModelFilter {
    return {
        type: PROCESS,
        name: 'PROJECT_EDITOR.TREE.PROCESSES',
        icon: PROCESS_ICON,
        adapter: processesFilterDataAdapter,
        order: 0
    };
}

export function getProcessesFilterProvider() {
    return [
        ProcessesFilterDataAdapter,
        {
            provide: MODEL_FILTERS,
            useFactory: createProcessesFilter,
            deps: [ProcessesFilterDataAdapter],
            multi: true
        }
    ];
}
