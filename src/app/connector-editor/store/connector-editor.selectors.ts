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

import { createSelector, createFeatureSelector } from '@ngrx/store';
import {
    selectSelectedModelIdFor,
    CONNECTOR,
    selectConnectorsEntityContainer,
    selectConnectorEntities,
    selectConnectorEntityContents
} from '@alfresco-dbp/modeling-shared/sdk';
import { ConnectorEditorState } from './connector-editor.state';

// TODO: Move these selectors to the modeling-sdk as well
// =================================================================================================
export const selectConnectorsIds = createSelector(selectConnectorsEntityContainer, state => state.ids);
export const selectConnectorsLoading = createSelector(selectConnectorsEntityContainer, state => state.loading);
export const selectConnectorsLoaded = createSelector(selectConnectorsEntityContainer, state => state.loaded);

export const selectSelectedConnectorId = selectSelectedModelIdFor(CONNECTOR);

export const selectConnectorsArray = createSelector(selectConnectorEntities, state => Object.values(state));

export const selectSelectedConnector = createSelector(
    selectSelectedConnectorId,
    selectConnectorEntities,
    (selectedConnectorId, entities) => entities[selectedConnectorId]
);
// =================================================================================================

export const CONNECTOR_EDITOR_STATE_NAME = 'connector-editor';
const getConnectorFeatureState = createFeatureSelector<ConnectorEditorState>(CONNECTOR_EDITOR_STATE_NAME);

export const selectConnectorLoadingState = createSelector(
    getConnectorFeatureState,
    (state: ConnectorEditorState) => state.loading
);

export const selectSelectedConnectorContent = createSelector(
    selectSelectedConnectorId,
    selectConnectorEntityContents,
    (selectedConnectorId, entityContents) => entityContents[selectedConnectorId]
);

export const selectConnectorCrumb = createSelector(
    selectSelectedConnector,
    (selectedConnector) => {
        if (!selectedConnector) {
            return null;
        }
        return { name: selectedConnector.name };
    }
);
