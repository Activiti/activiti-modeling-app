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

import { connectorActions, EntitiesWithConnectors, projectConnectorByName, connectorContentById } from './connector-editor.selectors';
import { ConnectorContent, Connector } from '../api/types';

describe('Connector selectors', () => {

    function createState(entities = {}, entityContents = {}): { entities: EntitiesWithConnectors } {
        return {
            entities: {
                connectors: {
                    loading: true,
                    loaded: true,
                    ids: [],
                    entities,
                    entityContents
                }
            }
        };
    }

    describe('connectorByName', () => {

        let state: { entities: EntitiesWithConnectors };

        it('should return null if there is no entities at all', () => {
            state = createState({});
            const actionsSelector = projectConnectorByName('', 'whatever-name');

            const connector = actionsSelector(state);

            expect(connector).toEqual(null);
        });

        it('should return null if projectId or name is null', () => {
            state = createState({});
            const actionsSelector = projectConnectorByName(null, null);

            const connector = actionsSelector(state);

            expect(connector).toEqual(null);
        });

        it('should return the connector if it exists', () => {
            state = createState({
                '1': <Connector>{ type: 'connector', id: '1', name: 'connector-1', projectIds: ['project-1'] },
                '2': <Connector>{ type: 'connector', id: '2', name: 'connector-2', projectIds: ['project-1'] },
                '3': <Connector>{ type: 'connector', id: '3', name: 'connector-2', projectIds: ['project-2'] },
            });
            const actionsSelector = projectConnectorByName('project-2', 'connector-2');

            const connector = actionsSelector(state);

            expect(connector).toBe(state.entities.connectors.entities['3']);
        });

        it('should return null if it doesn\'t exist in the right project', () => {
            state = createState({
                '1': <Connector>{ type: 'connector', id: '1', name: 'connector-a', projectIds: ['project-1'] },
                '2': <Connector>{ type: 'connector', id: '2', name: 'connector-a', projectIds: ['project-2'] }
            });
            const actionsSelector = projectConnectorByName('project-3', 'connector-a');

            const connector = actionsSelector(state);

            expect(connector).toBe(null);
        });
    });

    describe('connectorContentById', () => {

        let state: { entities: EntitiesWithConnectors };

        it('should return null if there is no entities at all', () => {
            state = createState();
            const actionsSelector = connectorContentById('whatever-name');

            const connectorContent = actionsSelector(state);

            expect(connectorContent).toEqual(null);
        });

        it('should return null if id is null', () => {
            state = createState();
            const actionsSelector = connectorContentById(null);

            const connectorContent = actionsSelector(state);

            expect(connectorContent).toEqual(null);
        });

        it('should return the connector content if it exists', () => {
            state = createState({}, {
                '1': <ConnectorContent>{ type: 'connector', id: '1', name: 'connector-1', actions: {} },
                '2': <ConnectorContent>{ type: 'connector', id: '2', name: 'connector-2', actions: {} },
                '3': <ConnectorContent>{ type: 'connector', id: '3', name: 'connector-3', actions: {} },
            });
            const actionsSelector = connectorContentById('2');

            const connectorContent = actionsSelector(state);

            expect(connectorContent).toBe(state.entities.connectors.entityContents['2']);
        });
    });

    describe('selectConnectorActions', () => {

        let state: { entities: EntitiesWithConnectors };

        it('should return null if there is no entities at all', () => {
            state = createState({});
            const actionsSelector = connectorActions('whatever-id');

            const actions = actionsSelector(state);

            expect(actions).toEqual(null);
        });

        it('should return null if id is null', () => {
            state = createState({});
            const actionsSelector = connectorActions(null);

            const actions = actionsSelector(state);

            expect(actions).toEqual(null);
        });

        it('should return the actions if connector exists', () => {
            state = createState({}, {
                '1': <ConnectorContent>{ type: 'connector', id: '1', name: 'connector-1', actions: {} },
                '2': <ConnectorContent>{ type: 'connector', id: '2', name: 'connector-2', actions: {} },
                '3': <ConnectorContent>{ type: 'connector', id: '3', name: 'connector-3', actions: {} },
            });
            const actionsSelector = connectorActions('2');

            const actions = actionsSelector(state);

            expect(actions).toBe(state.entities.connectors.entityContents['2'].actions);
        });
    });
});
