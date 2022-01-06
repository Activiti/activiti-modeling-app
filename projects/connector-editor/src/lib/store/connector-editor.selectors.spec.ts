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

import { selectConnectorContentById } from './connector-editor.selectors';

describe('Connector editor selectors', () => {

    describe('selectConnectorContentById', () => {
        it ('should return the connector content for given model id', () => {
            const state = {
                entities: {
                    connectors: {
                        entityContents: {
                            connector1: 'connector1 content',
                            connector2: 'connector2 content'
                        }
                    }
                }
            };

            const connector1ContentSelector = selectConnectorContentById('connector1');
            const connector1Content = connector1ContentSelector(state);

            const connector2ContentSelector = selectConnectorContentById('connector2');
            const connector2Content = connector2ContentSelector(state);

            expect(connector1Content).toEqual('connector1 content');
            expect(connector2Content).toEqual('connector2 content');
        });
    });
});
