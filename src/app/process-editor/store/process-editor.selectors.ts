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

import { createSelector, createFeatureSelector } from '@ngrx/store';
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
import { ProcessEditorState } from './process-editor.state';
import { ProcessEntitiesState } from './process-entities.state';
import { selectSelectedProjectId } from 'ama-sdk';

export const PROCESS_EDITOR_STATE_NAME = 'process-editor';
export const getProcessEditorFeatureState = createFeatureSelector(PROCESS_EDITOR_STATE_NAME);

export const selectProcessIds = createSelector(selectProcessEntityContainer, state => state.ids);
export const selectProcessEntities = createSelector(selectProcessEntityContainer, state => state.entities);
export const selectProcessesLoading = createSelector(selectProcessEntityContainer, state => state.loading);
export const selectProcessesLoaded = createSelector(selectProcessEntityContainer, state => state.loaded);
export const selectEntityContents = createSelector(selectProcessEntityContainer, (state: ProcessEntitiesState) => state.entityContents);
export const selectSelectedProcessId = selectSelectedModelIdFor(PROCESS);
export const selectProcesses = createSelector(selectProcessEntityContainer, state => state.entities);
export const selectSelectedElement = createSelector(getProcessEditorFeatureState, (state: ProcessEditorState) => state.selectedElement);
export const selectProcessLoading = createSelector(getProcessEditorFeatureState, (state: ProcessEditorState) => state.loading);

export const selectProcessesArray = createSelector(
    selectProcessEntities,
    selectSelectedProjectId,
    (processes, selectedProjectId) => <Process[]>Object.values(processes).filter((process: Process) => process.projectId === selectedProjectId)
);

export const selectSelectedProcessDiagram = createSelector(
    selectSelectedProcessId,
    selectProcessEntityContainer,
    (processId: string, state: ProcessEntitiesState) => state.entityContents[processId]
);

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


