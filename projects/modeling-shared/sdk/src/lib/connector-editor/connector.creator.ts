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

import { ModelCreator } from '../interfaces/model-creator.interface';
import { CONNECTOR } from '../api/types';
import { MODELER_NAME_REGEX } from '../helpers/utils/create-entries-names';
import { CreateConnectorAttemptAction } from './connector-editor.actions';

export const CONNECTOR_ICON = 'link';

export function createConnectorCreator(callback = (_param) => {}): ModelCreator {
    return {
        name: 'PROJECT_EDITOR.NEW_MENU.MENU_ITEMS.CREATE_CONNECTOR',
        icon: CONNECTOR_ICON,
        order: 1,
        type: CONNECTOR,
        dialog: {
            title: 'PROJECT_EDITOR.CONNECTOR_DIALOG.TITLE_CREATE',
            nameField: 'PROJECT_EDITOR.CONNECTOR_DIALOG.CONNECTOR_NAME',
            descriptionField: 'PROJECT_EDITOR.CONNECTOR_DIALOG.CONNECTOR_DESC',
            allowedCharacters: {
                regex: MODELER_NAME_REGEX,
                error: 'APP.DIALOGS.ERROR.GENERAL_NAME_VALIDATION'
            },
            action: CreateConnectorAttemptAction,
            callback: callback
        }
    };
}
