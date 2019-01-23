 /*!
 * @license
 * Copyright 2018 Alfresco, Inc. and/or its affiliates.
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
import { Observable } from 'rxjs';
import { RequestApiHelper, RequestApiHelperOptions } from './request-api.helper';
import { map, concatMap } from 'rxjs/operators';
import { ModelApiInterface } from '../../api/generalmodel-api.interface';
import { Model, MinimalModelSummary } from '../../api/types';

export interface ModelResponse<T extends Model> {
    entry: T;
}

export interface ModelsResponse<T extends Model> {
    list: {
        entries: ModelResponse<T>[]
    };
}

export interface ModelApiVariation<M extends MinimalModelSummary, C> {
    readonly contentType: string;
    readonly fileType: string;
    serialize(content: Partial<C>): string;
    createInitialContent(model: M): C;
    createSummaryPatch(model: Partial<M>, content: Partial<C>): MinimalModelSummary;
    patchModel(model: Partial<M>): M;
}

@Injectable()
export class ModelApi<T extends Model, S> implements ModelApiInterface<T, S> {

    constructor(private modelVariation: ModelApiVariation<T, S>, private requestApiHelper: RequestApiHelper) {}

    public getList(containerId: string): Observable<T[]> {
        return this.requestApiHelper
            .get<ModelsResponse<T>>(
                `/v1/projects/${containerId}/models`,
                { queryParams: { type: this.modelVariation.contentType} })
            .pipe(
                map((nodePaging) => {
                    return nodePaging.list.entries
                        .map(entry => entry.entry)
                        .map((entry) => this.createEntity(entry, containerId));
                })
            );
    }

    public create(model: Partial<MinimalModelSummary>, containerId: string): Observable<T> {
        return this.requestApiHelper
            .post<ModelResponse<T>>(
                `/v1/projects/${containerId}/models`,
                { bodyParam: { ...model, type: this.modelVariation.contentType }})
            .pipe(
                map(response => response.entry),
                concatMap(createdEntity => {
                    // Patch: BE does not return the description...
                    const createdEntityWithDescription: T = <T>{
                        description: model.description,
                        ...<object>createdEntity
                    };

                    return this.updateContent(createdEntityWithDescription, this.modelVariation.createInitialContent(createdEntityWithDescription));
                }),
                map(createdEntity => this.createEntity(createdEntity, containerId))
            );
    }

    public retrieve(modelId: string, containerId: string, queryParams?: any): Observable<T> {
        return this.requestApiHelper
            .get<ModelResponse<T>>(
                `/v1/models/${modelId}`,
                {queryParams: queryParams})
            .pipe(
                map(response => this.createEntity(response.entry, containerId))
        );
    }

    public update(modelId: string, model: Partial<T>, content: S, containerId: string): Observable<T> {
        const summary = this.modelVariation.createSummaryPatch(model, content);

        return this.requestApiHelper
            // It is supposed to be a patch, rather than a put. Waiting for BE to implement it...
            .put<ModelResponse<T>>(`/v1/models/${modelId}`, { bodyParam: summary})
            .pipe(
                concatMap(response => this.updateContent(response.entry, content)),
                map(updatedEntity => this.createEntity(updatedEntity, containerId))
            );
    }

    private updateContent(model: T, content: Partial<S>): Observable<T> {
        const file = new Blob([this.modelVariation.serialize(content)], {type: this.modelVariation.fileType});
        const requestOptions: RequestApiHelperOptions = {
            formParams: { file },
            queryParams: { type: this.modelVariation.contentType },
            contentTypes: ['multipart/form-data']
        };

        return this.requestApiHelper
            .put<void>(`/v1/models/${model.id}/content`, requestOptions)
            .pipe(map(() => model));
    }


    public delete(modelId: string): Observable<void> {
        return this.requestApiHelper
            .delete(`/v1/models/${modelId}`);
    }

    public validate(modelId: string, content: S): Observable<any> {
        const requestOptions: RequestApiHelperOptions = {
            formParams: { file: new Blob([this.modelVariation.serialize(content)], { type: 'text/plain' }) },
            contentTypes: [ 'multipart/form-data' ]
        };

        return this.requestApiHelper
            .post(`/v1/models/${modelId}/validate`, requestOptions);
    }

    public import(file: File, containerId: string): Observable<T> {
        const requestOptions: RequestApiHelperOptions = {
            formParams: { file },
            queryParams: { type: this.modelVariation.contentType },
            contentTypes: ['multipart/form-data']
        };

        return this.requestApiHelper
            .post<ModelResponse<T>>(`/v1/projects/${containerId}/models/import`, requestOptions)
            .pipe(
                map(response => this.createEntity(response.entry, containerId))
            );
    }

    public export(modelId: string): Observable<S> {
        return this.requestApiHelper.get<S>(`/v1/models/${modelId}/content`, { returnType: 'string' });
    }

    private createEntity(entity: Partial<T>, containerId: string): T {
        return {
            description: '',
            version: '0.0.1',
            projectId: entity.projectId,
            // Patch: BE does not return empty or not yet defined properties at all, like extensions
            ...(this.modelVariation.patchModel(entity) as object)
        } as T;
    }
}
