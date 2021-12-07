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

import { Action } from '@ngrx/store';
import { MODEL_TYPE } from '../../api/types';

export enum BasicModelCommands {
    save = 'save',
    /* cspell: disable-next-line */
    saveas = 'saveas',
    download = 'download',
    delete = 'delete',
    validate = 'validate'
}

export interface UpdateActionLike {
    new(payload: any);
}
export interface ValidateActionLike {
    new(payload: {title: string, modelId: string, modelContent: any, action: Action});
}
export interface DeleteActionLike {
    new(modelId: string);
}
export interface ModelCommand {
    execute(modelType: MODEL_TYPE, modelId: string, content: string, metadata?: any): void;
}
