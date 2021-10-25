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

import { ActivitiFile, FILE, FileVisibility, ModelScope } from '../api/types';

const publicFileOne: ActivitiFile = {
    type: FILE,
    id: 'mock-id',
    version: 'mock-version',
    name: 'mock-name',
    description: 'mock-description',
    createdBy: 'mock-user',
    lastModifiedBy: 'mock-user',
    creationDate: new Date(),
    lastModifiedDate: new Date(),
    projectIds: ['mock-project-id'],
    extensions: {
        id: 'mock-id',
        createdAt: new Date(),
        name: 'mock-name.jpg',
        uri: 'file:/mock-name.bin',
        content: {
            sizeInBytes: 0,
            mimeType: 'image/jpeg'
        },
        visibility: FileVisibility.Public
    },
    scope: ModelScope.GLOBAL
};

const publicFileTwo: ActivitiFile = {
    type: FILE,
    id: 'mock-id-2',
    version: 'mock-version-2',
    name: 'mock-name-2',
    description: 'mock-description-2',
    createdBy: 'mock-user-2',
    lastModifiedBy: 'mock-user-2',
    creationDate: new Date(),
    lastModifiedDate: new Date(),
    projectIds: ['mock-project-id'],
    extensions: {
        id: 'mock-id-2',
        createdAt: new Date(),
        name: 'mock-name-2.jpg',
        uri: 'file:/mock-name-2.bin',
        content: {
            sizeInBytes: 0,
            mimeType: 'image/png'
        },
        visibility: FileVisibility.Public
    },
    scope: ModelScope.GLOBAL
};

const privateFileThree: ActivitiFile = {
    type: FILE,
    id: 'mock-id-3',
    version: 'mock-version-3',
    name: 'mock-name-3',
    description: 'mock-description-3',
    createdBy: 'mock-user-3',
    lastModifiedBy: 'mock-user-3',
    creationDate: new Date(),
    lastModifiedDate: new Date(),
    projectIds: ['mock-project-id'],
    extensions: {
        id: 'mock-id-3',
        createdAt: new Date(),
        name: 'mock-name-3.jpg',
        uri: 'file:/mock-name-3.bin',
        content: {
            sizeInBytes: 0,
            mimeType: 'image/svg'
        },
        visibility: FileVisibility.Private
    },
    scope: ModelScope.GLOBAL
};

export const activityFiles = [
    publicFileOne,
    publicFileTwo,
    privateFileThree,
];
