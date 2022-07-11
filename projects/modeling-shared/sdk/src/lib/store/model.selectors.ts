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
import { createSelector } from '@ngrx/store';
import { getEntitiesState, MODELS_ENTITY_KEY } from './entity.selectors';

export const selectModelEntity = (modelId: string) => createSelector(selectModelsContainer(), state => state.entities[modelId]);
export const selectModelsContainer = () => createSelector(getEntitiesState, (state: any) => state[MODELS_ENTITY_KEY]);
export const selectModelsDraftContainer = () => createSelector(getEntitiesState, (state: any) => state[MODELS_ENTITY_KEY].draftEntities.entities);
export const selectModelEntityContents = () => createSelector(selectModelsContainer(), state => state.entityContents);
export const selectModelDraftEntityContents = () => createSelector(selectModelsContainer(), state => state.draftEntities.entityContents);
export const selectModelDraftStateExists = (modelId: string) => createSelector(selectModelsContainer(), state => state.draftEntities.entityContents[modelId]);

@Injectable({
    providedIn: 'root'
})
export class ModelSelectors {

    selectModelContentById(modelId: string) {
        return createSelector(
            selectModelEntityContents(),
            (entityContents) => entityContents[modelId]
        );
    }

    selectModelMetadataById(modelId: string) {
        return createSelector(
            selectModelsContainer(),
            state => state.entities[modelId]
        );
    }

    selectModelDraftContentById(modelId: string) {
        return createSelector(
            selectModelEntityContents(),
            selectModelDraftEntityContents(),
            (entityContents, draftEntityContents) => draftEntityContents[modelId] ?? entityContents[modelId]
        );
    }

    selectModelDraftMetadataById(modelId: string) {
        return createSelector(
            selectModelsContainer(),
            selectModelsDraftContainer(),
            (state, draftState) => draftState[modelId] ?? state.entities[modelId]
        );
    }

    selectModelDraftStateExists(modelId: string) {
        return createSelector(
            selectModelDraftStateExists(modelId),
            (draftEntityContents) => draftEntityContents ? true : false
        );
    }
}
