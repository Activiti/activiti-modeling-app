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
import { AppState, selectApp } from 'ama-sdk';

export const selectMenuOpened = createSelector(selectApp, (state: AppState) => state.menuOpened);

export const selectToolbarState = createSelector(selectApp, (state: AppState) => state.toolbar);
export const selectToolbarUserMessage = createSelector(selectToolbarState, (state) => state.userMessage);
export const selectToolbarInProgress = createSelector(selectToolbarState, (state) => state.inProgress);
export const selectToolbarLogs = createSelector(selectApp, (state: AppState) => state.logs);
export const selectToolbarLogsVisibility = createSelector(selectToolbarState, (state) => state.logHistoryVisible);

