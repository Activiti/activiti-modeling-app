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
import { ProcessEditorState } from './process-editor.state';
import {
    createProcessName,
    selectApplicationTree,
    getEntitiesState,
    PROCESS,
    selectSelectedModelIdFor,
    getProcessEditorFeatureState,
    formatUuid,
    ContentType
} from 'ama-sdk';
import { ProcessEntitiesState } from './process-entities.state';

export interface EntitiesWithProcesses { processes: ProcessEntitiesState; }
export const selectProcessesEntityContainer = createSelector(getEntitiesState, (state: EntitiesWithProcesses) => state.processes);

export const selectProcessIds = createSelector(selectProcessesEntityContainer, state => state.ids);
export const selectProcessEntities = createSelector(selectProcessesEntityContainer, state => state.entities);
export const selectProcessEntityContents = createSelector(selectProcessesEntityContainer, state => state.entityContents);
export const selectProcessesLoading = createSelector(selectProcessesEntityContainer, state => state.loading);
export const selectProcessesLoaded = createSelector(selectProcessesEntityContainer, state => state.loaded);

export const selectSelectedProcessId = selectSelectedModelIdFor(PROCESS);

export const selectProcesses = createSelector(selectApplicationTree, state => state.processes);
export const selectProcessesArray = createSelector(selectProcesses, processes => Object.values(processes));

export const selectProcess = createSelector(getProcessEditorFeatureState, (state: ProcessEditorState) => state.process);
export const selectProcessDiagram = createSelector(
    getProcessEditorFeatureState,
    (state: ProcessEditorState) => state.diagram
);
export const selectLoading = createSelector(getProcessEditorFeatureState, (state: ProcessEditorState) => state.loading);
export const selectSelectedElement = createSelector(
    getProcessEditorFeatureState,
    (state: ProcessEditorState) => state.selectedElement
);

export const selectProcessesKeyLabelArray = createSelector(selectProcesses, processes => {
    return Object.values(processes).map(process => ({
        key: formatUuid(ContentType.Process, process.id),
        label: createProcessName(process.name)
    }));
});

export const selectProcessCrumb = createSelector(selectProcess, process => {
    return process ? { name: `${createProcessName(process.name)} (${process.version})` } : null;
});


