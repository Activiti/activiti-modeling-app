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

import {
    GET_CONNECTORS_SUCCESS,
    UPDATE_CONNECTOR_SUCCESS,
    GET_CONNECTOR_SUCCESS,
    GetConnectorSuccessAction,
    DELETE_CONNECTOR_SUCCESS,
    UpdateConnectorSuccessAction,
    GET_CONNECTORS_ATTEMPT,
    GetConnectorsSuccessAction,
    DeleteConnectorSuccessAction
} from './connector-editor.actions';
import {
    ConnectorContent,
    initialConnectorEntitiesState,
    ConnectorEntitiesState,
    connectorEntityAdapter,
    LEAVE_PROJECT,
    CreateConnectorSuccessAction,
    CREATE_CONNECTOR_SUCCESS
} from '@alfresco-dbp/modeling-shared/sdk';
import { Action } from '@ngrx/store';

export function connectorEntitiesReducer(
    state: ConnectorEntitiesState = initialConnectorEntitiesState,
    action: Action
): ConnectorEntitiesState {
    switch (action.type) {
        case CREATE_CONNECTOR_SUCCESS:
            return createConnector(state, <CreateConnectorSuccessAction> action);

        case GET_CONNECTORS_ATTEMPT:
            return {
                ...state,
                loading: true
            };

        case GET_CONNECTORS_SUCCESS:
            return getConnectorsSuccess(state, <GetConnectorsSuccessAction> action);

        case DELETE_CONNECTOR_SUCCESS:
            return removeConnector(state, <DeleteConnectorSuccessAction> action);

        case UPDATE_CONNECTOR_SUCCESS:
            return updateConnector(state, <UpdateConnectorSuccessAction>action);

        case GET_CONNECTOR_SUCCESS:
            return getConnectorSuccess(state, <GetConnectorSuccessAction>action);
        case LEAVE_PROJECT:
            return {
                ...state,
                loaded: false
            };

        default:
            return { ...state };
    }
}

function createConnector(state: ConnectorEntitiesState, action: CreateConnectorSuccessAction): ConnectorEntitiesState {
    return connectorEntityAdapter.addOne(action.connector, state);
}

function removeConnector(state: ConnectorEntitiesState, action: DeleteConnectorSuccessAction): ConnectorEntitiesState {
    const newState = { ...state, entityContents: { ...state.entityContents } };
    delete newState.entityContents[action.connectorId];

    return connectorEntityAdapter.removeOne(action.connectorId, state);
}

function getConnectorsSuccess(state: ConnectorEntitiesState, action: GetConnectorsSuccessAction): ConnectorEntitiesState {
    return connectorEntityAdapter.addMany(action.connectors, {
        ...state,
        loading: false,
        loaded: true
    });
}

function getConnectorSuccess(state: ConnectorEntitiesState, action: GetConnectorSuccessAction): ConnectorEntitiesState {
    const connector = action.connector,
        connectorContent = action.connectorContent;

    const newState = { ...state, entityContents: { ...state.entityContents } };

    if (Object.keys(connectorContent).length) {
        newState.entityContents[connector.id] = connectorContent;
    } else {
        newState.entityContents[connector.id] = {
            name: connector.name,
            description: connector.description
        };
    }

    return connectorEntityAdapter.upsertOne(connector, newState);
}

function updateConnector(state: ConnectorEntitiesState, action: UpdateConnectorSuccessAction): ConnectorEntitiesState {
    const newState = {
        ...state,
        entityContents: {
            ...state.entityContents,
            [action.connector.id]: <ConnectorContent>action.connector.changes
        }
    };
    const { name, description, template } = action.connector.changes;
    return connectorEntityAdapter.updateOne({ ...action.connector, changes: { name, description, template } }, newState);
}
