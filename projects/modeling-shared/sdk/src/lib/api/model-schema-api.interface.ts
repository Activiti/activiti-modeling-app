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

import { Observable } from 'rxjs';

export enum MODEL_SCHEMA_TYPE {
    PROCESS_EXTENSION = 'PROCESS-EXTENSION',
    CONNECTOR = 'CONNECTOR',
    FORM = 'FORM',
    UI = 'UI',
    FILE = 'FILE',
    SCRIPT = 'SCRIPT',
    TRIGGER = 'TRIGGER',
    CUSTOM_FORM_WIDGET = 'CUSTOM-FORM-WIDGET',
    DATA = 'DATA',
    AUTHENTICATION = 'AUTHENTICATION',
    HXP_DOC_TYPE = 'HXP_DOC_TYPE',
    HXP_MIXIN = 'HXP_MIXIN',
    HXP_SCHEMA = 'HXP_SCHEMA',
}

export type JsonArray = Array<string|number|boolean|Date|Json|JsonArray>;
export interface Json {
    [key: string]: string|number|boolean|Date|Json|JsonArray;
}

export interface ModelSchemaApi {
    retrieve(modelType: MODEL_SCHEMA_TYPE): Observable<Json>;
}
