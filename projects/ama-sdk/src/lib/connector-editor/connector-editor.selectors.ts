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
import { ConnectorEntitiesState } from './connector-entities.state';
import { selectSelectedProjectId } from '../store/app.selectors';
import { Connector } from '../api/types';
import { getEntitiesState } from '../store/entity.selectors';

export interface EntitiesWithConnectors { connectors: ConnectorEntitiesState; }
export const selectConnectorsEntityContainer = createSelector(getEntitiesState, (state: any) => <ConnectorEntitiesState>state.connectors);
export const selectConnectorEntities = createSelector(selectConnectorsEntityContainer, state => state.entities);
export const selectConnectorEntityContents = createSelector(selectConnectorsEntityContainer, state => state.entityContents);

export const selectProjectConnectorsArray = createSelector(
    selectConnectorEntities,
    selectSelectedProjectId,
    (connectors, selectedProjectId) => Object.values(connectors).filter((connector: Connector) => connector.projectId === selectedProjectId)
);

export const connectorByName = name => createSelector(
    selectConnectorEntities,
    (entities) => {
        if (!name) {
            return null;
        }

        const wantedConnector = Object.keys(entities)
            .map(connectorId => entities[connectorId])
            .filter(connector => connector.name === name);

        return wantedConnector[0] || null;
    }
);

export const connectorContentById = id => createSelector(
    selectConnectorEntityContents,
    (entityContents) => {
        if (!id) {
            return null;
        }

        return entityContents[id] || null;
    }
);


export const connectorActions = id => createSelector(
    selectConnectorEntityContents,
    (entities) => {
        if (!id) {
            return null;
        }

        return entities && entities[id] && entities[id].actions ? entities[id].actions : null;
    }
);
