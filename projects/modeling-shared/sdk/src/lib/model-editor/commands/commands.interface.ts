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
import { ContentType } from '../../api-implementations/acm-api/content-types';
import { MODEL_TYPE } from '../../api/types';
import { SaveAsDialogPayload } from '../../components/save-as-dialog/save-as-dialog.component';

export enum BasicModelCommands {
    save = 'save',
    saveAs = 'save-as',
    download = 'download',
    delete = 'delete',
    validate = 'validate',
    moreMenu = 'more-menu',
    editorsMenu = 'editors-menu'
}

export interface UpdateActionLike {
    new(payload: { modelId: string; modelContent: any; modelMetadata?: any });
}
export interface ValidateActionLike {
    new(payload: { title: string; modelId: string; modelContent: any; modelMetadata?: any; action: Action | Action[]; errorAction?: Action });
}
export interface DeleteActionLike {
    new(modelId: string);
}
export interface DownloadActionLike {
    new(modelId?: string);
}
export interface OpenSaveAsActionLike {
    new(payload: SaveAsDialogPayload);
}
export interface SaveAsModelActionLike {
    new(payload: SaveAsDialogPayload, navigateTo: boolean);
}
export interface SuccessActionLike {
    new(payload: Action[]);
}
export interface ErrorActionLike {
    new(message: string, params?: any);
}
export interface ModelCommand {
    execute(modelType: MODEL_TYPE, modelContentType: ContentType, modelId: string, content: string, metadata?: any): void;
}
