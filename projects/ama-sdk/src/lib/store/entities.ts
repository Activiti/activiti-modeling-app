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
import { ActionReducerMap } from '@ngrx/store';
import { Model, MODEL_TYPE } from '../api/types';
import { ModelApiInterface } from '../api/generalmodel-api.interface';

export interface ModelApiStorageRelation {
    modelType: MODEL_TYPE;
    token: InjectionToken<ModelApiInterface<Model, any>>;
    entityKey: string;
}
export const MODEL_STORAGE_APIS_TOKEN = new InjectionToken<ModelApiStorageRelation[]>('model-storage-apis');

export function registerModel(modelType: MODEL_TYPE, token: InjectionToken<ModelApiInterface<Model, any>>, entityKey: string) {
    return [
        { provide: MODEL_STORAGE_APIS_TOKEN, useValue: { modelType, token, entityKey }, multi: true }
    ];
}





export const ENTITIES_REDUCER_TOKEN = new InjectionToken<ActionReducerMap<any>>('entities-reducer');
export const ENTITY_REDUCERS_TOKEN = new InjectionToken<ActionReducerMap<any>>('entity-reducer');

export function entityReducerFactory(entityReducers: any[]): ActionReducerMap<any> {
    return entityReducers.reduce((reducers, entityReducer) => {
        return {
            ...reducers,
            ...entityReducer
        };
    }, {});
}

export function provideEntity(entityReducerObject: any) {
    return [
        { provide: ENTITY_REDUCERS_TOKEN, useValue: entityReducerObject, multi: true },
        { provide: ENTITIES_REDUCER_TOKEN, deps: [ ENTITY_REDUCERS_TOKEN ], useFactory: entityReducerFactory }
    ];
}
