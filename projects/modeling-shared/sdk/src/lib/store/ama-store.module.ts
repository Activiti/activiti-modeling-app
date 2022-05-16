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

import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { StoreModule, ActionReducerMap } from '@ngrx/store';

export const ENTITIES_REDUCER_TOKEN = new InjectionToken<ActionReducerMap<any>>('entities-reducer');
export const ENTITY_REDUCERS_TOKEN = new InjectionToken<ActionReducerMap<any>>('entity-reducer');

export function entityReducerFactory(entityReducers: any[]): ActionReducerMap<any> {
    return entityReducers.reduce((reducers, entityReducer) => ({
        ...reducers,
        [entityReducer.key]: entityReducer.reducer
    }), {});
}

// Don't remove this line below, otherwise typescript dies with metadata error in AOT
// @dynamic
@NgModule({
    imports: [ StoreModule.forFeature('entities', ENTITIES_REDUCER_TOKEN), ]
})
export class AmaStoreModule {
    static registerEntity(entityReducerObject: any): ModuleWithProviders<AmaStoreModule> {
        return {
            ngModule: AmaStoreModule,
            providers: [
                { provide: ENTITY_REDUCERS_TOKEN, useValue: entityReducerObject, multi: true },
                { provide: ENTITIES_REDUCER_TOKEN, deps: [ ENTITY_REDUCERS_TOKEN ], useFactory: entityReducerFactory }
            ]
        };
    }
}
