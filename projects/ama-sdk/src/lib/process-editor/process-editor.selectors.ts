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
import { ServiceParameterMappings, EntityProperty } from '../api/types';
import { getEntitiesState } from '../store/entity.selectors';
import { selectOpenedModel } from '../store/app.selectors';

export const PROCESS_EDITOR_STATE_NAME = 'process-editor';
export const getProcessEditorFeatureState = createFeatureSelector(PROCESS_EDITOR_STATE_NAME);

export const selectProcessEntityContainer = createSelector(getEntitiesState, (state: any) => state.processes);

export const selectSelectedProcess = createSelector(
    selectOpenedModel,
    selectProcessEntityContainer,
    (openedModel, state) =>  openedModel ? state.entities[openedModel.id] : null);

export const selectProcessPropertiesArray = createSelector(
    selectSelectedProcess,
    (process): EntityProperty[] => {
        if (process && process.extensions && process.extensions.properties) {
            return Object.values(process.extensions.properties);
        } else {
            return [];
        }
    }
);

export const selectProcessMappingsFor = (serviceId) => {
    return createSelector(
        selectSelectedProcess,
        (process): ServiceParameterMappings => {
            if (!process || !process.extensions) {
                return {};
            }
            const mapping = process.extensions.mappings;
            return mapping && mapping[serviceId] ? mapping[serviceId] : {};
        }
    );
};
