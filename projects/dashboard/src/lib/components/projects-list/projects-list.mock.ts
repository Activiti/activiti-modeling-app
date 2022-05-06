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

import { Project, PROJECT, Pagination } from '@alfresco-dbp/modeling-shared/sdk';

export const paginationMock: Pagination = {
    count: 1,
    hasMoreItems: false,
    maxItems: 10,
    skipCount: 90,
    totalItems: 90
};

export const mockProject: Project = {
    id: 'mock-project-id',
    name: 'mock-project-name',
    description: 'description',
    version: '0.0.1',
    type: PROJECT,
    createdBy: 'user',
    creationDate: new Date(),
    lastModifiedBy: 'user',
    lastModifiedDate: new Date(),
    favorite: true
};

export const mockProject1: Project = {
    id: 'mock-project-id-1',
    name: 'mock-project-name',
    description: 'description',
    version: '0.0.1',
    type: PROJECT,
    createdBy: 'user',
    creationDate: new Date(),
    lastModifiedBy: 'user',
    lastModifiedDate: new Date(),
    favorite: false
};
