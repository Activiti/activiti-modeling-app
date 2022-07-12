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
import { getEntitiesState } from './entity.selectors';

export const selectModelEntityContainerByType = (modelType: string) => createSelector(getEntitiesState, (state: any) => state[modelType]);
export const selectModelEntityContentsByType = (modelType: string) => createSelector(selectModelEntityContainerByType(modelType), state => state.entityContents);
export const selectModelEntityByType = (modelType: string, modelId: string) => createSelector(selectModelEntityContainerByType(modelType), state => state.entities[modelId]);

export const selectModelDraftEntityContainerByType = (modelType: string) => createSelector(
    selectModelEntityContainerByType(modelType), state => state.draftEntities?.entities);
export const selectModelDraftEntityContentsByType = (modelType: string) => createSelector(
    selectModelEntityContainerByType(modelType), state => state.draftEntities?.entityContents);
export const selectModelDraftEntityContentByTypeAndModelId = (modelType: string, modelId: string) =>
    createSelector(selectModelEntityContainerByType(modelType), state => state.draftEntities?.entityContents[modelId]);
export const selectModelDraftEntityByTypeAndModelId = (modelType: string, modelId: string) =>
    createSelector(selectModelEntityContainerByType(modelType), state => state.draftEntities?.entities[modelId]);

@Injectable({
    providedIn: 'root'
})
export class ModelEntitySelectors {
    constructor(private modelType: string) {}

    selectModelContentById(modelId: string) {
        return createSelector(
            selectModelEntityContentsByType(this.modelType),
            (entityContents) => entityContents[modelId]
        );
    }

    selectModelMetadataById(modelId: string) {
        return createSelector(
            selectModelEntityContainerByType(this.modelType),
            state => state.entities[modelId]
        );
    }

    selectModelDraftContentById(modelId: string) {
        return createSelector(
            selectModelEntityContentsByType(this.modelType),
            selectModelDraftEntityContentsByType(this.modelType),
            (entityContents, draftEntityContents) => draftEntityContents[modelId] ?? entityContents[modelId]
        );
    }

    selectModelDraftMetadataById(modelId: string) {
        return createSelector(
            selectModelEntityContainerByType(this.modelType),
            selectModelDraftEntityContainerByType(this.modelType),
            (state, draftState) => draftState[modelId] ?? state.entities[modelId]
        );
    }

    selectModelDraftStateExists(modelId: string) {
        return createSelector(
            selectModelDraftEntityContentByTypeAndModelId(this.modelType, modelId),
            selectModelDraftEntityByTypeAndModelId(this.modelType, modelId),
            (draftEntityContents, draftEntity) => (draftEntityContents || draftEntity) ? true : false
        );
    }
}
