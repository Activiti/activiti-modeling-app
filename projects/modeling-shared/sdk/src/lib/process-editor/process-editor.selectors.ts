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

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ServiceParameterMappings, EntityProperty, TaskAssignmentContent, Process, ModelScope } from '../api/types';
import { getEntitiesState } from '../store/entity.selectors';
import { selectOpenedModel, selectSelectedProjectId } from '../store/app.selectors';
import { ProcessExtensionsModel } from './process-extensions.model';

export const PROCESS_EDITOR_STATE_NAME = 'process-editor';
export const getProcessEditorFeatureState = createFeatureSelector(PROCESS_EDITOR_STATE_NAME);

export const selectProcessEntityContainer = createSelector(getEntitiesState, (state: any) => state.processes);
export const selectProcessEntities = createSelector(selectProcessEntityContainer, state => state.entities);

export const selectSelectedProcess = createSelector(
    selectOpenedModel,
    selectProcessEntityContainer,
    (openedModel, state) => openedModel ? (state.draftEntities?.entities[openedModel.id] ?? state.entities[openedModel.id]) : null);

export const selectProcessPropertiesArrayFor = (processId: string) => createSelector(
    selectSelectedProcess,
    (process): EntityProperty[] => {
        if (process && process.extensions) {
            return Object.values(new ProcessExtensionsModel(process.extensions).getProperties(processId));
        } else {
            return [];
        }
    }
);

export const selectExternalProcessPropertiesArrayFor = (modelId: string) => createSelector(
    selectProcessEntityContainer,
    (processes): EntityProperty[] => {
        const process = processes.entities[modelId];
        if (process && process.extensions) {
            return Object.values(new ProcessExtensionsModel(process.extensions).getAllProperties());
        } else {
            return [];
        }
    }
);

export const selectProcessMappingsFor = (processId: string, elementId: string) => createSelector(
    selectSelectedProcess,
    (process): ServiceParameterMappings => {
        let mapping = {};
        if (process && process.extensions) {
            mapping = new ProcessExtensionsModel(process.extensions).getMappings(processId);
        }
        return mapping && mapping[elementId] ? mapping[elementId] : null;
    }
);

export const selectProcessTaskAssignmentFor = (processId: string, serviceId: string) => createSelector(
    selectSelectedProcess,
    (process) => {
        if (!process || !process.extensions) {
            return {};
        }
        const assignments = <TaskAssignmentContent>new ProcessExtensionsModel(process.extensions).getAssignments(processId);
        return assignments && assignments[serviceId] ? assignments[serviceId] : {};
    }
);

export const selectProcessesArray = createSelector(
    selectProcessEntities,
    selectSelectedProjectId,
    (processes, selectedProjectId) => <Process[]>Object.values(processes).filter((process: Process) =>
        selectedProjectId ?
            (process.projectIds && process.projectIds.indexOf(selectedProjectId) >= 0) :
            process.scope === ModelScope.GLOBAL)
);
