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
import { NodeEntry } from 'alfresco-js-api-node';
import { UtilRandom, Logger } from '../../util';
import { ACMBackend } from './acm-backend';
import { E2eRequestApiHelper, E2eRequestApiHelperOptions } from './e2e-request-api.helper';
import * as fs from 'fs';

export class ACMProject implements ProjectApi {

    requestApiHelper: E2eRequestApiHelper;
    tmpFilePath: string;
    endPoint = '/modeling-service/v1/projects/';
    namePrefix = 'aps-app-';

    constructor(backend: ACMBackend) {
        this.requestApiHelper = new E2eRequestApiHelper(backend);
        this.tmpFilePath = backend.config.main.paths.tmp;
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
            return project;
        } catch (error) {
            Logger.error(`[Project] Create and wait for project to be available failed!` + JSON.stringify(error));
            throw error;
        }
    }

    async get(projectId: string) {
        return await this.requestApiHelper.get(`/modeling-service/v1/projects/${projectId}`);
    }

    async getDecisionTableId(projectId: string, decisionTableName: string): Promise<string> {
        const requestOptions: E2eRequestApiHelperOptions = {
            queryParams: { type: 'DECISION' }
        };
        const projectDetails = await this.requestApiHelper.get(`/modeling-service/v1/projects/${projectId}/models`, requestOptions);
        const projectDetailsObject = JSON.parse(JSON.stringify(projectDetails));
        const map = new Map<string, string>();

        for (const entry of projectDetailsObject.list.entries) {
            map.set(entry.entry.name, entry.entry.id);
        }
        return await map.get(decisionTableName);
    }

    async delete(projectId: string) {
        await this.requestApiHelper.delete(`/modeling-service/v1/projects/${projectId}`);
    }

    async release(projectId: string) {
        return await this.requestApiHelper.post(`/modeling-service/v1/projects/${projectId}/releases`);
    }

    async import(projectFilePath: string) {
        const fileContent = await fs.createReadStream(projectFilePath);
        const requestOptions: E2eRequestApiHelperOptions = {
            formParams:  { file: fileContent },
            contentTypes: [ 'multipart/form-data' ]
        };
        try {
            const project =  await this.requestApiHelper
                .post<NodeEntry>(`/modeling-service/v1/projects/import`, requestOptions);
            Logger.info(`[Project] Project imported with name '${project.entry.name}' and id '${project.entry.id}'.`);
            return project;
        } catch (error) {
            Logger.error(`[Project] Import project failed!`);
            throw error;
        }
    }

    private getRandomName(): string {
        /* cspell: disable-next-line */
        return this.namePrefix + UtilRandom.generateString(5, '1234567890abcdfghjklmnpqrstvwxyz');
    }

    async getModelId(projectId: string, modelType: string, modelName: string): Promise<string> {
        const requestOptions: E2eRequestApiHelperOptions = {
            queryParams: { type: `${modelType}` }
        };
        const projectDetails = await this.requestApiHelper.get(`/modeling-service/v1/projects/${projectId}/models`, requestOptions);
        const projectDetailsObject = JSON.parse(JSON.stringify(projectDetails));
        const map = new Map<string, string>();

        for (const entry of projectDetailsObject.list.entries) {
            map.set(entry.entry.name, entry.entry.id);
        }
        return await map.get(modelName);
    }

    async getProjectByName(projectName: string): Promise<any> {
        const projects = await this.getProjects();
        return projects.list.entries.find((el) => {
            if (el.entry.name === projectName) {
                return el;
            }
        });
    }

    async getProjects(): Promise<any> {
        return this.requestApiHelper.get(
            `/modeling-service/v1/projects`,
            { queryParams: { 'maxItems': 1000 } }
        );
    }

}
