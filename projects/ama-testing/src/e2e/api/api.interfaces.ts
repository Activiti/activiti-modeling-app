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

import * as AlfrescoApi from 'alfresco-js-api-node';
import { NodeEntry } from 'alfresco-js-api-node';

export interface ModelCrud {
    create(projectId: string, name?: string): Promise<NodeEntry>;
    createAndWaitUntilAvailable(projectId: string, name?: string): Promise<NodeEntry>;
    getContent(modelId: string): PromiseLike<any>;
    updateModelContent(modelId: string, content: string, modelName?: string): Promise<void>;
    updateModelMetadata(modelId: string, content: any): Promise<void>;
    delete(modelId?: string): Promise<void>;
}

export interface ProjectApi {
    create(projectName?: string): Promise<AlfrescoApi.NodeEntry>;
    createAndWaitUntilAvailable(projectName?: string): Promise<AlfrescoApi.NodeEntry>;
    delete(projectId?: string): Promise<void>;
    release(projectId?: string): Promise<AlfrescoApi.NodeEntry>;
    get(projectId?: string): Promise<AlfrescoApi.NodeEntry>;
    import(projectZipFile: string): Promise<AlfrescoApi.NodeEntry>;
}

export interface Backend {
    api: AlfrescoApi;
    project: ProjectApi;
    process: ModelCrud;
    connector: ModelCrud;
    ui: ModelCrud;
    decisionTable: ModelCrud;
    form: ModelCrud;
    dataObject: ModelCrud;
    setUp(): Promise<Backend>;
    tearDown(): Promise<Backend>;
}
