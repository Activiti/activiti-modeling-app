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

import { Injectable, Injector, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
    MODEL_TYPE,
    Model,
    MODEL_STORAGE_APIS_TOKEN,
    ModelApiStorageRelation
} from 'ama-sdk';

@Injectable()
export class ModelStorageService {
    constructor(
        private injector: Injector,
        @Inject(MODEL_STORAGE_APIS_TOKEN) private modelApiStorageRelations: ModelApiStorageRelation[]
    ) {}

    fetchAll(projectId: string, modelType: MODEL_TYPE): Observable<Model[]> {
        return this.getStorageApi(modelType).getList(projectId);
    }

    public getStorageKey(modelType: MODEL_TYPE) {
        const modelApiStorageRelation = this.modelApiStorageRelations
            .find(relation => relation.modelType === modelType);

        return modelApiStorageRelation.entityKey;
    }

    private getStorageApi(modelType: MODEL_TYPE) {
        const modelApiStorageRelation = this.modelApiStorageRelations
            .find(relation => relation.modelType === modelType);

        return this.injector.get(modelApiStorageRelation.token);
    }
}
