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

import { selectLogsByInitiator } from './app.selectors';
import { allLogFilter, MESSAGE } from '@alfresco-dbp/modeling-shared/sdk';
import { INITIAL_STATE } from '../states/app.state';
import { getConnectorLogInitiator } from '../../connector-editor/services/connector-editor.constants';

describe('App selectors', () => {

    describe('selectLogsByInitiator', () => {

        const logs = [
            {
                type: MESSAGE.INFO,
                datetime: new Date(),
                initiator: {
                    displayName: 'Connector Editor',
                    key: 'Connector Editor'
                },
                messages: [
                    'test1'
                ]
            },
            {
                type: MESSAGE.INFO,
                datetime: new Date(),
                initiator: {
                    displayName: 'Process Editor',
                    key: 'Process Editor'
                },
                messages: [
                    'test2'
                ]
            }
        ];

        const state = INITIAL_STATE;

        it('should display all logs for All initiator', () => {
            state.app.logs = logs;
            const actionsSelector = selectLogsByInitiator(allLogFilter);
            const selectedLogs = actionsSelector(state);
            expect(selectedLogs).toEqual(logs);
        });

        it('should display logs just for Connectors', () => {
            state.app.logs = logs;
            const actionsSelector = selectLogsByInitiator(getConnectorLogInitiator());
            const selectedLogs = actionsSelector(state);
            expect(selectedLogs).toEqual([logs[0]]);
        });
    });
});
