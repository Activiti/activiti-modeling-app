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

import { createSelector } from '@ngrx/store';
import {
    createProcessName,
    PROCESS,
    selectSelectedModelIdFor,
    formatUuid,
    ContentType,
    selectProcessEntityContainer,
    selectSelectedProcess,
    Process
} from 'ama-sdk';

export const selectProcessIds = createSelector(selectProcessEntityContainer, state => state.ids);
export const selectProcessEntities = createSelector(selectProcessEntityContainer, state => state.entities);
export const selectProcessesLoading = createSelector(selectProcessEntityContainer, state => state.loading);
export const selectProcessesLoaded = createSelector(selectProcessEntityContainer, state => state.loaded);
export const selectProcessDiagram = createSelector(selectProcessEntityContainer, state => state.selectedProcessContent);
export const selectSelectedProcessId = selectSelectedModelIdFor(PROCESS);
export const selectProcesses = createSelector(selectProcessEntityContainer, state => state.entities);
export const selectProcessesArray = createSelector(selectProcessEntityContainer, state => Object.values(state.entities));
export const selectSelectedElement = createSelector(selectProcessEntityContainer, state => state.selectedElement);

export const selectProcessesKeyLabelArray = createSelector(
    selectProcesses,
    processes => Object.values(processes).map((process: Process) => ({
        key: formatUuid(ContentType.Process, process.id),
        label: createProcessName(process.name)
    }))
);

export const selectProcessCrumb = createSelector(
    selectSelectedProcess,
    process => process ? { name: `${createProcessName(process.name)} (${process.version})` } : null
);


