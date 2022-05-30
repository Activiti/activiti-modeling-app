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

import { InjectionToken } from '@angular/core';
import { Action } from '@ngrx/store';
import { MODEL_TYPE } from '../api/types';
import { AllowedCharacters } from '../helpers/common';

export type ActionConstructor = new (...args: any[]) => Action;

export interface ModelCreatorDialogParams {
    title: string;
    nameField: string;
    descriptionField: string;
    allowedCharacters?: AllowedCharacters;
    action: ActionConstructor;
    callback: (param?: any) => any;
    dialog?: any;
}

export interface ModelCreator {
    name: string;
    type: MODEL_TYPE;
    icon: string;
    order: number;
    dialog: ModelCreatorDialogParams;
    disableCreate?: boolean;
    disableUpload?: boolean;
    key?: string;
}

export const MODEL_CREATORS = new InjectionToken<ModelCreator[]>('model-creators');
