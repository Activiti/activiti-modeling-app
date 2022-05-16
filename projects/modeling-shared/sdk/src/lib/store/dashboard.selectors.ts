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
import { getEntitiesState } from './entity.selectors';
import { ProjectEntitiesState } from './project-entities.state';

export const getDashboardFeatureState = createSelector(getEntitiesState, (state: any) => <ProjectEntitiesState> state.projects);

const selectLoadingFromState = (state: ProjectEntitiesState) => state.loading;
const selectProjectsLoadedFromState = (state: ProjectEntitiesState) => state.loaded;
const selectProjectSummariesFromState = (state: ProjectEntitiesState) => state.entities;
const selectPaginationFromState = (state: ProjectEntitiesState) => state.pagination;
const selectFavoriteProjectSummariesFromState = (state: ProjectEntitiesState) => Object.keys(state.entities).reduce((acc, val) => {
    if (state.entities[val].favorite) {
        acc[val] = state.entities[val];
    }
    return acc;
}, {});

export const selectLoading = createSelector(getDashboardFeatureState, selectLoadingFromState);
export const selectPagination = createSelector(getDashboardFeatureState, selectPaginationFromState);
export const selectProjectsLoaded = createSelector(getDashboardFeatureState, selectProjectsLoadedFromState);
export const selectProjectSummaries = createSelector(getDashboardFeatureState, selectProjectSummariesFromState);
export const selectProjectsArray = createSelector(selectProjectSummaries, project => Object.values(project));
export const selectFavoriteProjectSummaries = createSelector(getDashboardFeatureState, selectFavoriteProjectSummariesFromState);

export const selectProjectById = (projectId: string) => createSelector(
    selectProjectSummaries,
    (projects) => projects[projectId]
);
