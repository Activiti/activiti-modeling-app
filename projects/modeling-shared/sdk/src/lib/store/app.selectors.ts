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

import { createSelector } from '@ngrx/store';
import { allLogFilter } from '../helpers/utils/log-filters';
import { AmaState, AppState } from './app.state';
import { getEntitiesState } from './entity.selectors';

export const selectApp = (state: AmaState) => state.app;

export const selectMenuOpened = createSelector(selectApp, (state: AppState) => state.menuOpened);
export const selectSelectedTheme = createSelector(selectApp, (state: AppState) => state.selectedTheme);
export const selectSelectedProjectId = createSelector(selectApp, (state: AppState) => state.selectedProjectId);
export const selectAppDirtyState = createSelector(selectApp, (state: AppState) => state.dirtyState);
export const selectOpenedModel = createSelector(selectApp, (state: AppState) => state.openedModel);

export const selectSelectedModel = createSelector(getEntitiesState, selectApp, (entities, app) => {
    for (let i = 0; i < Object.keys(entities).length; i++) {
        const key = Object.keys(entities)[i];
        if (app.openedModel && entities[key].ids && entities[key].ids.indexOf(app.openedModel.id) !== -1) {
            return entities[key].entities[app.openedModel.id];
        }
    }
});

export const selectAnyModelInDirtyState = createSelector(getEntitiesState, (entities) => {
    const dirtyStates = [];
    for (let i = 1; i < Object.keys(entities).length; i++) {
        const value = Object.values(entities)[i];
        if (value.draftEntities && (Object.keys(value.draftEntities.entities).length || Object.keys(value.draftEntities.entityContents).length)) {
            dirtyStates.push(true);
        } else {
            dirtyStates.push(false);
        }
    }
    return !dirtyStates.every(element => !element);
});


export const selectSelectedModelIdFor = function(modelType: string) {
    return createSelector(selectApp, (state: AppState) => state.openedModel && state.openedModel.type.toLowerCase() === modelType.toLowerCase() ? state.openedModel.id : null);
};


const selectToolbarState = createSelector(selectApp, (state: AppState) => state.toolbar);
export const selectToolbarUserMessage = createSelector(selectToolbarState, (state) => state.userMessage);
export const selectToolbarInProgress = createSelector(selectToolbarState, (state) => state.inProgress);
export const selectToolbarLogs = createSelector(selectApp, (state: AppState) => state.logs);
export const selectToolbarLogsVisibility = createSelector(selectToolbarState, (state) => state.logHistoryVisible);
export const selectLogsByInitiator = initiator => createSelector(
    selectToolbarLogs,
    (logs) => {
        if (initiator.key === allLogFilter.key) {
            return logs;
        }
        return logs.filter(log => log.initiator.key === initiator.key);
    }
);
