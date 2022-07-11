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

import { connectorEntitiesReducer } from './connector-entities.reducer';
import {
    GetConnectorsSuccessAction,
    GET_CONNECTORS_SUCCESS,
    UpdateConnectorSuccessAction,
    UPDATE_CONNECTOR_SUCCESS,
    GetConnectorSuccessAction,
    DeleteConnectorSuccessAction,
    DELETE_CONNECTOR_SUCCESS,
    GET_CONNECTORS_ATTEMPT,
    GetConnectorsAttemptAction,
    DRAFT_UPDATE_CONNECTOR_CONTENT,
    DRAFT_DELETE_CONNECTOR,
    DraftUpdateConnectorContentAction,
    DraftDeleteConnectorAction
} from './connector-editor.actions';
import {
    CONNECTOR,
    ConnectorContent,
    ConnectorEntitiesState,
    initialConnectorEntitiesState,
    CREATE_CONNECTOR_SUCCESS,
    CreateConnectorSuccessAction
} from '@alfresco-dbp/modeling-shared/sdk';

describe('ConnectorEntitiesReducer', () => {
    let initialState: ConnectorEntitiesState;

    const connector = <any>{
        type: CONNECTOR,
        id: 'mock-id',
        name: 'mock-name',
        description: 'mock-description',
        projectId: 'mock-app-id'
    };

    beforeEach(() => {
        initialState = { ...initialConnectorEntitiesState };
    });

    it('should handle CREATE_CONNECTOR_SUCCESS', () => {
        const action = <CreateConnectorSuccessAction>{ type: CREATE_CONNECTOR_SUCCESS, connector: connector };

        const newState = connectorEntitiesReducer(initialState, action);
        expect(newState.ids).toEqual([connector.id]);
        expect(newState.entities).toEqual({ [connector.id]: connector });
    });

    it('should handle GET_CONNECTORS_ATTEMPT', () => {
        const action = <GetConnectorsAttemptAction>{ type: GET_CONNECTORS_ATTEMPT, projectId: 'app-id' };

        const newState = connectorEntitiesReducer(initialState, action);

        expect(newState.loading).toEqual(true);
    });

    it('should handle GET_CONNECTORS_SUCCESS', () => {
        const connectors = [connector, { ...connector, id: 'mock-id2' }];
        const action = <GetConnectorsSuccessAction>{ type: GET_CONNECTORS_SUCCESS, connectors: connectors };

        const newState = connectorEntitiesReducer(initialState, action);
        expect(newState.ids).toEqual(connectors.map(conn => conn.id));
        expect(newState.entities).toEqual({
            [connectors[0].id]: connectors[0],
            [connectors[1].id]: connectors[1]
        });
        expect(newState.loading).toEqual(false);
        expect(newState.loaded).toEqual(true);
    });

    it('should handle DELETE_CONNECTOR_SUCCESS', () => {
        const connectors = [connector, { ...connector, id: 'mock-id2' }];
        let action: any = <GetConnectorsSuccessAction>{ type: GET_CONNECTORS_SUCCESS, connectors: connectors };
        let newState = connectorEntitiesReducer(initialState, action);

        action = <DeleteConnectorSuccessAction>{ type: DELETE_CONNECTOR_SUCCESS, connectorId: 'mock-id2' };

        newState = connectorEntitiesReducer(newState, action);
        expect(newState.ids).toEqual([connector.id]);
        expect(newState.entities).toEqual({
            [connector.id]: connector
        });
    });

    it('should handle UPDATE_CONNECTOR_SUCCESS', () => {
        const connectors = [connector, { ...connector, id: 'mock-id2' }];
        let action: any = <GetConnectorsSuccessAction>{ type: GET_CONNECTORS_SUCCESS, connectors: connectors };

        const stateWithAddedConnectors = connectorEntitiesReducer(initialState, action);
        const changes = {
            id: connector.id,
            changes: {
                ...connector,
                name: 'name2',
                description: 'desc2',
                template: 'slackConnector',
                actions: []
            }
        };
        action = <UpdateConnectorSuccessAction>{ type: UPDATE_CONNECTOR_SUCCESS, connector: changes };

        const newState = connectorEntitiesReducer(stateWithAddedConnectors, action);
        expect(newState.entities[connector.id]).toEqual({
            ...connector,
            name: 'name2',
            template: 'slackConnector',
            description: 'desc2'
        });
    });

    it('should handle DRAFT_UPDATE_CONNECTOR_CONTENT', () => {
        const connectors = [connector, { ...connector, id: 'mock-id2' }];
        let action: any = <GetConnectorsSuccessAction>{ type: GET_CONNECTORS_SUCCESS, connectors: connectors };

        const stateWithAddedConnectors = connectorEntitiesReducer(initialState, action);
        const changes = {
            id: connector.id,
            changes: {
                ...connector,
                name: 'name2',
                description: 'desc2',
                template: 'slackConnector',
                actions: []
            }
        };
        action = <DraftUpdateConnectorContentAction> { type: DRAFT_UPDATE_CONNECTOR_CONTENT, connector: changes };

        const newState = connectorEntitiesReducer(stateWithAddedConnectors, action);
        expect(newState.draftEntities.entities[connector.id]).toEqual({
            ...connector,
            name: 'name2',
            template: 'slackConnector',
            description: 'desc2'
        });
    });

    it('should handle DRAFT_DELETE_CONNECTOR', () => {
        const connectors = [connector];
        let action: any = <GetConnectorsSuccessAction>{ type: GET_CONNECTORS_SUCCESS, connectors: connectors };
        let newState = connectorEntitiesReducer(initialState, action);

        action = <DraftDeleteConnectorAction> { type: DRAFT_DELETE_CONNECTOR, modelId: 'mock-id' };
        newState = connectorEntitiesReducer(newState, action);

        expect(newState.draftEntities.entities).toEqual({});
        expect(newState.draftEntities.entityContents).toEqual({});
    });

    describe('GET_CONNECTOR_SUCCESS', () => {
        let connectorContent: ConnectorContent;

        beforeEach(() => {
            /* cspell: disable-next-line */
            connectorContent = <ConnectorContent>{ name: 'Tom Marvolo Riddle', description: 'I am Lord Voldemort' };
        });

        it('should update the connector in the state', () => {
            const action = new GetConnectorSuccessAction(connector, connectorContent);

            const newState = connectorEntitiesReducer(initialState, action);

            expect(newState.entities[connector.id]).toEqual(connector);
        });

        it('should update the content of a connector in the state', () => {
            const action = new GetConnectorSuccessAction(connector, connectorContent);

            const newState = connectorEntitiesReducer(initialState, action);

            expect(newState.entityContents[connector.id]).toEqual(connectorContent);
        });

        it('should update the content with default values if no content from backend. The id must be prefixed with connector-', () => {
            const action = new GetConnectorSuccessAction(connector, <ConnectorContent>{});

            const newState = connectorEntitiesReducer(initialState, action);

            expect(newState.entityContents[connector.id]).toEqual({
                name: connector.name,
                description: connector.description
            });
        });
    });
});
