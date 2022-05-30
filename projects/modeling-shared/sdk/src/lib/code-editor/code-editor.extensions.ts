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

import { InjectionToken, ValueProvider } from '@angular/core';
import { MODEL_TYPE } from '../api/types';
import { MODEL_SCHEMA_TYPE } from '../api/model-schema-api.interface';

export type JsonSchemaTransformer = (jsonSchema: any) => any;

export interface SchemaModelMap {
    modelType: MODEL_TYPE;
    schemaKey: MODEL_SCHEMA_TYPE;
    transform?: JsonSchemaTransformer;
}

export const MODEL_SCHEMAS_TO_LOAD = new InjectionToken<SchemaModelMap[]>('model-schemas-to-load');

export function provideLoadableModelSchema(schemaModelMap: SchemaModelMap): ValueProvider {
    return  {
        provide: MODEL_SCHEMAS_TO_LOAD,
        multi: true,
        useValue: schemaModelMap
    };
}
