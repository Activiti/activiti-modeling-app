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
    createModelName,
    formatUuid,
    ContentType,
    selectProcessEntityContainer,
    Process,
    selectSelectedProjectId,
    ModelScope
} from '@alfresco-dbp/modeling-shared/sdk';
import { ProcessEditorState } from './process-editor.state';
import { ProcessEntitiesState } from './process-entities.state';
import { InjectionToken } from '@angular/core';

export const PROCESS_EDITOR_STATE_NAME = 'process-editor';
export const getProcessEditorFeatureState = createFeatureSelector<ProcessEditorState>(PROCESS_EDITOR_STATE_NAME);

export const selectProcessIds = createSelector(selectProcessEntityContainer, state => state.ids);
export const selectProcessEntities = createSelector(selectProcessEntityContainer, state => state.entities);
export const selectProcessesLoading = createSelector(selectProcessEntityContainer, state => state.loading);
export const selectProcessesLoaded = createSelector(selectProcessEntityContainer, state => state.loaded);
export const selectEntityContents = createSelector(selectProcessEntityContainer, (state: ProcessEntitiesState) => state.entityContents);
export const selectProcesses = createSelector(selectProcessEntityContainer, state => state.entities);
export const selectSelectedElement = createSelector(getProcessEditorFeatureState, state => state.selectedElement);
export const selectProcessModelContext = createSelector(getProcessEditorFeatureState, state => state.modelContext);
export const selectProcessLoading = createSelector(getProcessEditorFeatureState, state => state.loading);
export const selectProcessEditorSaving = createSelector(getProcessEditorFeatureState, state => state.updateState);

export const PROCESS_MODEL_ENTITY_SELECTORS = new InjectionToken<string>('process-selector-token');

export const selectProcessesArray = createSelector(
    selectProcessEntities,
    selectSelectedProjectId,
    (processes, selectedProjectId) => <Process[]>Object.values(processes).filter((process: Process) =>
        selectedProjectId ?
            (process.projectIds && process.projectIds.indexOf(selectedProjectId) >= 0) :
            process.scope === ModelScope.GLOBAL)
);

export const selectProcessCategories = createSelector(
    selectProcessesArray,
    (processes) => {
        const allCategories = processes
            .map(process => process.category)
            .filter(category => !!category);

        const uniqueCategories = Array.from(new Set(allCategories));
        return uniqueCategories;
    }
);

export const selectProcessesKeyLabelArray = createSelector(
    selectProcesses,
    processes => Object.values(processes).map((process: Process) => ({
        key: formatUuid(ContentType.Process, process.id),
        label: createModelName(process.name)
    }))
);
