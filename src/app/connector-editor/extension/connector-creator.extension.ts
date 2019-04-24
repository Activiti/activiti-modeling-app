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

import { MODEL_CREATORS, ModelCreator, CONNECTOR } from 'ama-sdk';
import { CreateConnectorAttemptAction } from '../store/connector-editor.actions';
import { CONNECTOR_ICON } from './connectors-filter.extension';

export function createConnectorCreator(): ModelCreator {
    return {
        name: 'APP.PROJECT.NEW_MENU.MENU_ITEMS.CREATE_CONNECTOR',
        icon: CONNECTOR_ICON,
        order: 1,
        type: CONNECTOR,
        dialog: {
            title: 'APP.PROJECT.CONNECTOR_DIALOG.TITLE_CREATE',
            nameField: 'APP.PROJECT.CONNECTOR_DIALOG.CONNECTOR_NAME',
            descriptionField: 'APP.PROJECT.CONNECTOR_DIALOG.CONNECTOR_DESC',
            allowedCharacters: '^[a-z0-9]{0,4}$',
            action: CreateConnectorAttemptAction
        }
    };
}

export function getConnectorCreatorProvider() {
    return [
        { provide: MODEL_CREATORS, useFactory: createConnectorCreator, multi: true }
    ];
}
