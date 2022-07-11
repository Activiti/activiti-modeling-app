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
export const PROJECT_ENTITY_KEY = 'projects';
export const PROCESSES_ENTITY_KEY = 'processes';
export const CONNECTORS_ENTITY_KEY = 'connectors';
export const FORMS_ENTITY_KEY = 'forms';
export const MODELS_ENTITY_KEY = 'models';
export const DECISION_TABLES_ENTITY_KEY = 'decisionTables';
export const DATA_ENTITY_KEY = 'data';
export const FILES_ENTITY_KEY = 'files';
export const SCRIPTS_ENTITY_KEY = 'scripts';
export const TRIGGERS_ENTITY_KEY = 'triggers';
export const CONTENT_MODELS_ENTITY_KEY = 'projectModels';
export const FORM_WIDGETS_ENTITY_KEY = 'formWidgets';
export const AUTHENTICATIONS_ENTITY_KEY = 'authentications';
export const HXP_DOC_TYPE_ENTITY_KEY = 'hxp-document-type';
export const HXP_MIXIN_ENTITY_KEY = 'hxp-mixin';
export const HXP_SCHEMA_ENTITY_KEY = 'hxp-schema';

export interface ModelEntitiesState extends EntityState<Model>  {
    loading: boolean;
    loaded: boolean;
    entityContents: {[key: string]: any};
    draftEntities: {
        entities: {[id: string]: Model};
        entityContents: {[key: string]: any};
    };
}

export interface EntitiesState {
    [key: string]: ModelEntitiesState;
}

export const getEntitiesState = createFeatureSelector<EntityMap<ModelEntitiesState>>('entities');

export const selectModelsEntityContainer = (entityContainer: string) => createSelector<any, EntityMap<ModelEntitiesState>, ModelEntitiesState>(
    getEntitiesState,
    state => state[entityContainer]
);

export const selectModelsLoaded = (entityContainer: string) => createSelector(
    selectModelsEntityContainer(entityContainer),
    state => state.loaded
);
