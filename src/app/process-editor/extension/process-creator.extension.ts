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

import { MODEL_CREATORS, ModelCreator, PROCESS } from '@alfresco-dbp/modeling/ama-sdk';
import { PROCESS_ICON } from './processes-filter.extension';
import { CreateProcessAttemptAction } from '../store/process-editor.actions';

export function createProcessCreator(): ModelCreator {
    return {
        name: 'APP.PROJECT.NEW_MENU.MENU_ITEMS.CREATE_PROCESS',
        icon: PROCESS_ICON,
        type: PROCESS,
        order: 0,
        dialog: {
            title: 'APP.PROJECT.PROCESS_DIALOG.TITLE_CREATE',
            nameField: 'APP.PROJECT.PROCESS_DIALOG.PROCESS_NAME',
            descriptionField: 'APP.PROJECT.PROCESS_DIALOG.PROCESS_DESC',
            action: CreateProcessAttemptAction
        }
    };
}

export function getProcessCreatorProvider() {
    return [
        { provide: MODEL_CREATORS, useFactory: createProcessCreator, multi: true }
    ];
}
