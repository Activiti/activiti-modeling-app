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
import { Model } from '../api/types';
import { EntityState, EntityMap } from '@ngrx/entity';

export const ENTITIES_KEY = 'entities';
export const PROCESSES_ENTITY_KEY = 'processes';
export const CONNECTORS_ENTITY_KEY = 'connectors';
export const FORMS_ENTITY_KEY = 'forms';
export const UIS_ENTITY_KEY = 'uis';
export const DECISION_TABLES_ENTITY_KEY = 'decisionTables';
export const DATA_ENTITY_KEY = 'data';
export const FILES_ENTITY_KEY = 'files';
export const SCRIPTS_ENTITY_KEY = 'scripts';

export interface ModelEntitiesState extends EntityState<Model>  {
    loading: boolean;
    loaded: boolean;
    entityContents: {[key: string]: any};
}

export interface EntitiesState {
    [key: string]: ModelEntitiesState;
}

export const getEntitiesState = createFeatureSelector<EntityMap<ModelEntitiesState>>('entities');

export const selectModelsEntityContainer = (entityContainer: string) => {
    return createSelector<object, EntityMap<ModelEntitiesState>, ModelEntitiesState>(
        getEntitiesState,
        state => state[entityContainer]
    );
};

export const selectModelsLoaded = (entityContainer: string) => {
    return createSelector(
        selectModelsEntityContainer(entityContainer),
        state => state.loaded
    );
};
