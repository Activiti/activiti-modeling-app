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

import { NodeEntry, ResultSetPaging } from 'alfresco-js-api-node';
import { UtilRandom } from '../../util/random';
import { UtilApi } from '../../util/api';
import { ACMBackend } from './acm-backend';
import { ModelCrud } from '../api.interfaces';
import { E2eRequestApiHelper, E2eRequestApiHelperOptions } from './e2e-request-api.helper';
import { Logger } from '../../util/logger';
import { getBlob } from './fakeBlob.helper';


export abstract class ACMCrud implements ModelCrud {

    abstract displayName: string;
    abstract namePrefix: string;
    abstract type: string;
    abstract contentType: string;

    requestApiHelper: E2eRequestApiHelper;

    abstract getDefaultContent(entityName: string, entityId: string): string;

    constructor(backend: ACMBackend) {
        this.requestApiHelper = new E2eRequestApiHelper(backend);
    }

    getContent(entityId: string) {
        return this.requestApiHelper.get(`/v1/models/${entityId}/content`, { returnType: 'Binary' });
    }

    async create(
        projectId: string,
        modelName: string = this.getRandomName()
    ): Promise<NodeEntry> {
        try {
            const model = await this.requestApiHelper
            .post<NodeEntry>(this.endPoint(projectId), {
                bodyParam: {
                    name: modelName,
                    type: this.type
                }
            });
            Logger.info(`[${this.displayName}] New model has been created with name: ${model.entry.name} and id: ${model.entry.id}.`);

            await this.updateModelContent(model.entry.id, this.getDefaultContent(modelName, model.entry.id));
            Logger.info(`[${this.displayName}] Model's content has been updated.`);
            return model;
        } catch (error) {
            Logger.error(`[${this.displayName}] Creating model failed with message: ${error.message}`);
            throw(error);
        }
    }

    async createAndWaitUntilAvailable(
        projectId: string,
        modelName: string = this.getRandomName(),
    ): Promise<NodeEntry> {
        try {
            const model = await this.create(projectId, modelName);
            await this.retrySearchModels(projectId, model.entry.id, this.type);
            return model;
        } catch (error) {
            Logger.error(`[${this.displayName}] Create and wait for new model to be available failed! ${error.message}`);
            throw error;
        }
    }

    async searchModels(projectId: string, modelType: string) {
        Logger.info(`[${this.displayName}] Waiting created model to be ready for listing.`);
        return await this.requestApiHelper.get<ResultSetPaging>(this.endPoint(projectId),  {queryParams: {'type': modelType}});
    }

    async retrySearchModels(projectId: string, modelId: string, modelType: string): Promise<{}> {
        const predicate = (result: ResultSetPaging) => {
            const foundModel = result.list.entries.find(model => {
                return model.entry.id === modelId;
            });

            return !!foundModel;
        };
        const apiCall = async () => await this.searchModels(projectId, modelType);

        return await UtilApi.waitForApi(apiCall, predicate);
    }

    async updateModelContent(id: string, content: string) {
        const requestOptions: E2eRequestApiHelperOptions = {
            formParams: { file: getBlob(`process-${id}.xml`, content) },
            contentTypes: [ 'multipart/form-data' ]
        };

        await this.requestApiHelper.put(`/v1/models/${id}/content`, requestOptions);
    }

    async updateModelMetadata(id: string, content: object) {
        await this.requestApiHelper.put(`/v1/models/${id}`, {bodyParam: content});
    }

    async delete(id: string) {
        await this.requestApiHelper.delete(`/v1/models/${id}`);
    }

    private getRandomName(): string {
        return this.namePrefix + UtilRandom.generateString();
    }

    private endPoint(projectId: string) {
        return `/v1/projects/${projectId}/models`;
    }
}
