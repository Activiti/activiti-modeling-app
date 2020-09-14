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
import { ModelScope, ServerSideSorting, FetchQueries } from './types';
import { PaginatedEntries } from '@alfresco/js-api';
export interface ModelApiInterface<ModelMetadata, ModelContent> {
    getList(containerId: string): Observable<ModelMetadata[]>;
    create(model: Partial<ModelMetadata>, containerId?: string): Observable<ModelMetadata>;
    retrieve(modelId: string, containerId?: string): Observable<ModelMetadata>;
    update(modelId: string, model: Partial<ModelMetadata>, modelContent: ModelContent, containerId?: string, ignoreContent?: boolean): Observable<ModelMetadata>;
    delete(modelId: string): Observable<void>;

    validate(modelId: string, modelContent: ModelContent, containerId: string, modelExtensions?: any, validateUsage?: boolean): Observable<ModelMetadata>;

    import(file: File, containerId?: string): Observable<ModelMetadata>;
    export(modelId: string, responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text'): Observable<ModelContent>;

    updateContentFile(modelId: string, file: File, responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text'): Observable<[ModelMetadata, ModelContent]>;

    addProjectModelRelationship(containerId: string, modelId: string, scope?: ModelScope, force?: boolean): Observable<ModelMetadata>;
    deleteProjectModelRelationship(containerId: string, modelId: string): Observable<ModelMetadata>;

    getGlobalModels(includeOrphans?: boolean, fetchQueries?: FetchQueries, sorting?: ServerSideSorting): Observable<PaginatedEntries<ModelMetadata>>;

    createGlobalModel(model: Partial<ModelMetadata>): Observable<ModelMetadata>;
}
