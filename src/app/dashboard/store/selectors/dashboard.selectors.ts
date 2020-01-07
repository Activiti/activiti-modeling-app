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

import { DashboardState } from '../state/dashboard.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const DASHBOARD_STATE_NAME = 'dashboard';

const getDashboardFeatureState = createFeatureSelector<DashboardState>(DASHBOARD_STATE_NAME);

const selectLoadingFromState = (state: DashboardState) => state.loading;
const selectProjectsLoadedFromState = (state: DashboardState) => state.projectsLoaded;
const selectProjectSummariesFromState = (state: DashboardState) => state.projects;
const selectPaginationFromState = (state: DashboardState) => state.pagination;
const selectReleaseSummariesFromState = (state: DashboardState) => state.releases;
const selectReleasesPaginationFromState = (state: DashboardState) => state.releasesPagination;
const selectProjectReleaseLoadedFromState = (state: DashboardState) => state.loadingReleases;

export const selectLoading = createSelector(getDashboardFeatureState, selectLoadingFromState);
export const selectPagination = createSelector(getDashboardFeatureState, selectPaginationFromState);
export const selectProjectsLoaded = createSelector(getDashboardFeatureState, selectProjectsLoadedFromState);
export const selectProjectSummaries = createSelector(getDashboardFeatureState, selectProjectSummariesFromState);
export const selectProjectsArray = createSelector(selectProjectSummaries, project => Object.values(project));

export const selectReleaseSummaries = createSelector(getDashboardFeatureState, selectReleaseSummariesFromState);
export const selectReleasesPagination = createSelector(getDashboardFeatureState, selectReleasesPaginationFromState);
export const selectLoadedProjectReleases = createSelector(getDashboardFeatureState, selectProjectReleaseLoadedFromState);
