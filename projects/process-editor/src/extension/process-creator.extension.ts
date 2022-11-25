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

import { MODEL_CREATORS, ModelCreator, PROCESS, PROCESS_NAME_REGEX } from '@alfresco-dbp/modeling-shared/sdk';
import { PROCESS_ICON } from './processes-filter.extension';
import { CreateProcessAttemptAction } from '../store/process-editor.actions';
import { CreateProcessDialogComponent } from '../components/create-process-dialog/create-process-dialog.component';

export function createProcessCreator(callback = () => {}): ModelCreator {
    return {
        name: 'PROJECT_EDITOR.NEW_MENU.MENU_ITEMS.CREATE_PROCESS',
        icon: PROCESS_ICON,
        type: PROCESS,
        order: 0,
        dialog: {
            title: 'PROJECT_EDITOR.PROCESS_DIALOG.TITLE_CREATE',
            fields: [
                {
                    key: 'name',
                    label: 'PROJECT_EDITOR.PROCESS_DIALOG.PROCESS_NAME',
                    type: 'text',
                    validators: [
                        {
                            type: 'required',
                            value: true,
                            error: 'SDK.CREATE_DIALOG.ERROR.REQUIRED'
                        },
                        {
                            type: 'pattern',
                            value: PROCESS_NAME_REGEX,
                            error: 'APP.DIALOGS.ERROR.PROCESS_NAME_VALIDATION'
                        }
                    ]
                },
                {
                    key: 'description',
                    label: 'PROJECT_EDITOR.PROCESS_DIALOG.PROCESS_DESC',
                    type: 'textarea'
                }
            ],
            submitText: 'PROJECT_EDITOR.PROCESS_DIALOG.PROCESS_SUBMIT_TEXT',
            action: CreateProcessAttemptAction,
            callback: callback,
            dialog: CreateProcessDialogComponent,
        }
    };
}

export function createProcess() {
    return createProcessCreator();
}

export function getProcessCreatorProvider() {
    return [
        { provide: MODEL_CREATORS, useFactory: createProcess, multi: true }
    ];
}
