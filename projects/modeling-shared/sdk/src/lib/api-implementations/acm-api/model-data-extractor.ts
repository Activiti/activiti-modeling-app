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

import { Injectable } from '@angular/core';
import { MODEL_TYPE } from '../../api/types';

type getFn<T, K> = (propertyName: string, modelContent: T, modelMetadata: K) => string;
type DataExtractorRegistry<T, K> = {
    [ key in MODEL_TYPE ]: getFn<T, K>;
};

interface RegisterParams<T, K> {
    type: MODEL_TYPE;
    get: getFn<T, K>;
}

@Injectable({ providedIn: 'root' })
export class ModelDataExtractor<T = any, K = any> {
    private registry: DataExtractorRegistry<T, K>;

    constructor() {
        this.registry = {} as DataExtractorRegistry<T, K>;
    }

    register({ type, get }: RegisterParams<T, K>) {
        this.registry[type] = get;
    }

    get(propertyName: string, modelContent: T, modelMetadata: K, type: string): string {
        return this.registry[type].call(undefined, propertyName, modelContent, modelMetadata);
    }
}
