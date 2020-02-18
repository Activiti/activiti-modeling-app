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

import { ModelSchemaApi, MODEL_SCHEMA_TYPE, Json } from '../../api/model-schema-api.interface';
import { RequestApiHelper } from './request-api.helper';
import { Injectable } from '@angular/core';

@Injectable()
export class ModelSchemaAcmApi implements ModelSchemaApi {
    constructor(private requestApiHelper: RequestApiHelper) {}

    retrieve(modelType: MODEL_SCHEMA_TYPE) {
        return this.requestApiHelper.get<Json>(`/modeling-service/v1/schemas/${modelType}`);
    }
}
