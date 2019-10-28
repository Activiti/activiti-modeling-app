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
import { Model, MODEL_TYPE } from '../api/types';
import { ModelApiInterface } from '../api/generalmodel-api.interface';

export interface ModelRegistration {
    modelType: MODEL_TYPE;
    token: InjectionToken<ModelApiInterface<Model, any>>;
    entityKey: string;
}
export const REGISTERED_MODELS_TOKEN = new InjectionToken<ModelRegistration[]>('model-storage-apis');

export function registerModel(modelType: MODEL_TYPE, token: InjectionToken<ModelApiInterface<Model, any>>, entityKey: string) {
    return [
        { provide: REGISTERED_MODELS_TOKEN, useValue: { modelType, token, entityKey }, multi: true }
    ];
}
