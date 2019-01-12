 /*!
 * @license
 * Copyright 2018 Alfresco, Inc. and/or its affiliates.
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
import { AmaState, AppState } from './app.state';
import { selectApplication } from './application.selectors';

export const selectApp = (state: AmaState) => state.app;

export const selectSelectedTheme = createSelector(selectApp, (state: AppState) => state.selectedTheme);
export const selectSelectedAppId = createSelector(selectApp, (state: AppState) => state.selectedAppId);
export const selectAppDirtyState = createSelector(selectApp, (state: AppState) => state.dirtyState);

export const selectApplicationCrumb = createSelector(selectApplication, application => {
    return application ? { url: `/applications/${application.id}`, name: application.name } : null;
});

export const selectSelectedModelIdFor = function(modelType: string) {
    return createSelector(selectApp, (state: AppState) => {
        return state.openedModel && state.openedModel.type.toLowerCase() === modelType.toLowerCase() ? state.openedModel.id : null;
    });
};
