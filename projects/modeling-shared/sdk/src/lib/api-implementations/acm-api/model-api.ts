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

import { Observable, forkJoin, from, OperatorFunction, of } from 'rxjs';
import { RequestApiHelper, RequestApiHelperOptions } from './request-api.helper';
import { map, concatMap, flatMap } from 'rxjs/operators';
import { ModelApiInterface } from '../../api/generalmodel-api.interface';
import { Model, MinimalModelSummary, ModelScope, FetchQueries, ServerSideSorting } from '../../api/types';
import { createBlobFormDataFromStringContent, createBlobFormData } from '../../helpers/utils/create-json-blob';
import { PaginatedEntries } from '@alfresco/js-api';

export interface ModelResponse<T extends Model> {
    entry: T;
}

export interface ModelsResponse<T extends Model> {
    list: {
        entries: ModelResponse<T>[];
    };
}

export interface ModelApiVariation<M extends MinimalModelSummary, C> {
    readonly contentType: string;
    readonly retrieveModelAfterUpdate: boolean;
    serialize(content: Partial<C>): string;
    createInitialMetadata(model: Partial<MinimalModelSummary>): Partial<M>;
    createInitialContent(model: M): C;
    createSummaryPatch(model: Partial<M>, content: Partial<C>): MinimalModelSummary;
    patchModel(model: Partial<M>): M;
    getFileToUpload(model: Partial<M>, content: Partial<C>): Blob;
    getModelMimeType(model: Partial<M>): string;
    getModelFileName(model: Partial<M>): string;
}

export class ModelApi<T extends Model, S> implements ModelApiInterface<T, S> {

    constructor(protected modelVariation: ModelApiVariation<T, S>, protected requestApiHelper: RequestApiHelper) { }

    public getList(containerId: string): Observable<T[]> {
        return this.requestApiHelper
            .get<ModelsResponse<T>>(
            `/modeling-service/v1/projects/${containerId}/models`,
            { queryParams: { type: this.modelVariation.contentType, maxItems: 1000 } })
            .pipe(
                map((nodePaging) => nodePaging.list.entries
                    .map(entry => entry.entry)
                    .map((entry) => this.createEntity(entry)))
            );
    }

    public create(model: Partial<MinimalModelSummary>, containerId: string): Observable<T> {
        return this.requestApiHelper
            .post<ModelResponse<T>>(
            `/modeling-service/v1/projects/${containerId}/models`,
            { bodyParam: { ...this.modelVariation.createInitialMetadata(model), type: this.modelVariation.contentType } })
            .pipe(
                map(response => response.entry),
                concatMap(createdEntity => {
                    // Patch: BE does not return the description...
                    const createdEntityWithDescription: T = <T>{
                        description: model.description,
                        ...createdEntity
                    };

                    return this.updateContent(createdEntityWithDescription, this.modelVariation.createInitialContent(createdEntityWithDescription));
                }),
                map(createdEntity => this.createEntity(createdEntity))
            );
    }

    public retrieve(modelId: string, containerId: string, queryParams?: any): Observable<T> {
        return this.requestApiHelper
            .get<ModelResponse<T>>(
            `/modeling-service/v1/models/${modelId}`,
            { queryParams: queryParams })
            .pipe(
                map(response => this.createEntity(response.entry))
            );
    }

    public update(modelId: string, model: Partial<T>, content: S, containerId: string, ignoreContent?: boolean): Observable<T> {
        const summary = this.modelVariation.createSummaryPatch(model, content);

        return this.requestApiHelper
            // It is supposed to be a patch, rather than a put. Waiting for BE to implement it...
            .put<ModelResponse<T>>(`/modeling-service/v1/models/${modelId}`, { bodyParam: summary })
            .pipe(
                concatMap(response => ignoreContent ? of(response.entry) : this.updateContent(response.entry, content)),
                map(updatedEntity => this.createEntity(updatedEntity))
            );
    }

    private updateContent(model: T, content: Partial<S>): Observable<T> {
        const file = createBlobFormData(this.modelVariation.getFileToUpload(model, content), this.modelVariation.getModelFileName(model));
        const requestOptions: RequestApiHelperOptions = {
            formParams: { file },
            queryParams: { type: this.modelVariation.contentType },
            contentTypes: ['multipart/form-data']
        };

        return this.requestApiHelper
            .put<void>(`/modeling-service/v1/models/${model.id}/content`, requestOptions)
            .pipe(this.getUpdateOperator(model));
    }

    private getUpdateOperator(model: T): OperatorFunction<void, T> {
        if (this.modelVariation.retrieveModelAfterUpdate) {
            return flatMap(() => this.retrieve(model.id, model.id));
        } else {
            return map(() => model);
        }
    }

    public delete(modelId: string): Observable<void> {
        return this.requestApiHelper
            .delete(`/modeling-service/v1/models/${modelId}`);
    }

    public validate(modelId: string, content: S, containerId: string, modelExtensions?: any, validateUsage?: boolean): Observable<any> {
        const requestOptions: RequestApiHelperOptions = {
            queryParams: { projectId: containerId, validateUsage },
            formParams: { file: new Blob([this.modelVariation.serialize(content)], { type: 'text/plain' }) },
            contentTypes: ['multipart/form-data']
        };
        if (modelExtensions) {
            return this.requestApiHelper
                .post(`/modeling-service/v1/models/${modelId}/validate`, requestOptions).pipe(
                    concatMap(() => this.validateModelExtensions(modelId, modelExtensions))
                );
        } else {
            return this.requestApiHelper
                .post(`/modeling-service/v1/models/${modelId}/validate`, requestOptions);
        }
    }

    private validateModelExtensions(modelId: string, modelExtensions: string) {
        const requestOptions: RequestApiHelperOptions = {
            formParams: {
                file: createBlobFormDataFromStringContent(modelExtensions, `${modelId}-extensions.json`)
            },
            contentTypes: ['multipart/form-data']
        };

        return from(this.requestApiHelper
            .post(`/modeling-service/v1/models/${modelId}/validate/extensions`, requestOptions));
    }

    public import(file: File, containerId: string): Observable<T> {
        const requestOptions: RequestApiHelperOptions = {
            formParams: { file },
            queryParams: { type: this.modelVariation.contentType },
            contentTypes: ['multipart/form-data']
        };

        return this.requestApiHelper
            .post<ModelResponse<T>>(`/modeling-service/v1/projects/${containerId}/models/import`, requestOptions)
            .pipe(
                map(response => this.createEntity(response.entry))
            );
    }

    public export(modelId: string, responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text'): Observable<S> {
        const requestOptions: RequestApiHelperOptions = {
            responseType: responseType
        };

        return this.requestApiHelper.get<S>(`/modeling-service/v1/models/${modelId}/content`, requestOptions);
    }

    private createEntity(entity: Partial<T>): T {
        return {
            description: '',
            version: '0.0.1',
            // Patch: BE does not return empty or not yet defined properties at all, like extensions
            ...(this.modelVariation.patchModel(entity))
        } as T;
    }

    updateContentFile(modelId: string, file: File, responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text'): Observable<[T, S]> {
        const requestOptions: RequestApiHelperOptions = {
            formParams: { file },
            queryParams: { type: this.modelVariation.contentType },
            contentTypes: ['multipart/form-data']
        };

        return this.requestApiHelper
            .put<void>(`/modeling-service/v1/models/${modelId}/content`, requestOptions).pipe(
            flatMap(() => {
                const content$ = this.export(modelId, responseType),
                    model$ = this.retrieve(modelId, modelId);
                return forkJoin(model$, content$);
            })
        );
    }

    addProjectModelRelationship(containerId: string, modelId: string, scope?: ModelScope, force?: boolean): Observable<T> {
        return this.requestApiHelper
            .put<ModelResponse<T>>(
            `/modeling-service/v1/projects/${containerId}/models/${modelId}`,
            { queryParams: { scope, force } })
            .pipe(
                map(response => this.createEntity(response.entry))
            );
    }

    deleteProjectModelRelationship(containerId: string, modelId: string): Observable<T> {
        return this.requestApiHelper
            .delete<ModelResponse<T>>(
            `/modeling-service/v1/projects/${containerId}/models/${modelId}`)
            .pipe(
                map(response => this.createEntity(response.entry))
            );
    }

    public getGlobalModels(
        includeOrphans?: boolean,
        fetchQueries: FetchQueries = { maxItems: 1000 },
        sorting: ServerSideSorting = { key: 'name', direction: 'asc' }): Observable<PaginatedEntries<T>> {

        const queryParams = {
            ...fetchQueries,
            sort: `${sorting.key},${sorting.direction}`,
            type: this.modelVariation.contentType,
            includeOrphans: includeOrphans ? includeOrphans : false
        };

        return this.requestApiHelper
            .get<ModelsResponse<T>>(
            `/modeling-service/v1/models`, { queryParams })
            .pipe(
                map((nodePaging: any) => ({
                    pagination: nodePaging.list.pagination,
                    entries: nodePaging.list.entries.map(entry => this.createEntity(entry.entry))
                }))
            );
    }

    public createGlobalModel(model: Partial<MinimalModelSummary>): Observable<T> {
        return this.requestApiHelper
            .post<ModelResponse<T>>(
            `/modeling-service/v1/models`,
            { bodyParam: { ...this.modelVariation.createInitialMetadata(model), type: this.modelVariation.contentType, scope: ModelScope.GLOBAL } })
            .pipe(
                map(response => response.entry),
                concatMap(createdEntity => {
                    // Patch: BE does not return the description...
                    const createdEntityWithDescription: T = <T>{
                        description: model.description,
                        ...createdEntity
                    };

                    return this.updateContent(createdEntityWithDescription, this.modelVariation.createInitialContent(createdEntityWithDescription));
                }),
                map(createdEntity => this.createEntity(createdEntity))
            );
    }
}
