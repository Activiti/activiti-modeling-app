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

import { ProjectApi } from '../api.interfaces';
import { NodeEntry, ResultSetPaging } from 'alfresco-js-api-node';
import { UtilRandom, Logger, UtilApi } from '../../util';
import { ACMBackend } from './acm-backend';
import { E2eRequestApiHelper } from './e2e-request-api.helper';

export class ACMProject implements ProjectApi {

    requestApiHelper: E2eRequestApiHelper;
    endPoint = '/v1/projects/';
    namePrefix = 'aps-app-';

    constructor(backend: ACMBackend) {
        this.requestApiHelper = new E2eRequestApiHelper(backend);
    }

    async create(modelName: string = this.getRandomName()) {
        const project =  await this.requestApiHelper
            .post<NodeEntry>(this.endPoint, { bodyParam: {name: modelName } });

        Logger.info(`[Project] Project created with name: ${project.entry.name} and id: ${project.entry.id}.`);
        return project;
    }

    async createAndWaitUntilAvailable(modelName: string = this.getRandomName()) {
        try {
            const project = await this.create(modelName);
            await this.retrySearchProject(project.entry.id);
            return project;
        } catch (error) {
            Logger.error(`[Project] Create and wait for project to be available failed!`);
            throw error;
        }
    }

    async get(projectId: string) {
        return await this.requestApiHelper.get(`/v1/projects/${projectId}`);
    }

    async delete(projectId: string) {
        await this.requestApiHelper.delete(`/v1/projects/${projectId}`);
    }

    async release(projectId: string) {
        return await this.requestApiHelper.post(`/v1/projects/${projectId}/releases`);
    }

    private async searchProjects() {
        Logger.info(`[Project] Waiting created project to be ready for listing.`);
        return await this.requestApiHelper.get<ResultSetPaging>(this.endPoint);
    }

    private async retrySearchProject(modelId): Promise<{}> {
        const predicate = (result: ResultSetPaging) => {
            const foundModel = result.list.entries.find(model => {
                return model.entry.id === modelId;
            });

            return !!foundModel;
        };
        const apiCall = () => this.searchProjects();

        return await UtilApi.waitForApi(apiCall, predicate);
    }

    private getRandomName(): string {
        return this.namePrefix + UtilRandom.generateString(5, '1234567890abcdfghjklmnpqrstvwxyz');
    }

}
