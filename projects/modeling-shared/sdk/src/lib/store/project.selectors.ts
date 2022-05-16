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
import { ProjectEditorState } from './project.state';
import { selectSelectedProjectId } from './app.selectors';
import { getDashboardFeatureState } from './dashboard.selectors';

export const PROJECT_EDITOR_STATE_NAME = 'project-editor';
export const getProjectEditorFeatureState = createFeatureSelector<ProjectEditorState>(PROJECT_EDITOR_STATE_NAME);

export const selectProject = createSelector(
    getDashboardFeatureState, selectSelectedProjectId,
    (state, projectId) => state.entities[projectId]
);

export const selectProjectLoading = createSelector(
    getProjectEditorFeatureState,
    (state: ProjectEditorState) => state.loading
);

export const selectProjectTree = createSelector(
    getProjectEditorFeatureState,
    (state: ProjectEditorState) => state.tree
);

export const selectProjectCrumb = createSelector(selectProject, project => project ? { url: `/projects/${project.id}`, name: project.name } : null);
