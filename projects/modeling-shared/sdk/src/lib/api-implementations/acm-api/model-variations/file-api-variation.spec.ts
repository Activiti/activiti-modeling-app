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

import { ActivitiFile, ActivitiFileContent, FileVisibility } from '../../../api/types';
import { ContentType } from '../content-types';
import { ModelContentSerializer } from '../model-content-serializer';
import { ModelDataExtractor } from '../model-data-extractor';
import { FileApiVariation } from './file-api-variation';

describe('FileApiVariation', () => {
    let fileApiVariation: FileApiVariation<ActivitiFile, ActivitiFileContent>;

    beforeEach(() => {
        fileApiVariation = new FileApiVariation(
            {register: () => {}} as unknown as ModelContentSerializer,
            {register: () => {}} as unknown as ModelDataExtractor,
        );
    });

    it('should return proper summary patch with "Public" visibility flag', () => {
        const summaryPatch = fileApiVariation.createSummaryPatch({
            name: 'name',
            description: 'description',
            applicationId: 'app-id',
            extensions: {
                id: 'ID',
                uri: 'file:/uri',
                visibility: FileVisibility.Public
            }
        }, new File([''], 'filename'));

        const expectedSummaryPatch = {
            name: 'name',
            description: 'description',
            extensions: {
                visibility: FileVisibility.Public,
            },
            type: ContentType.File
        };

        expect(summaryPatch).toEqual(expectedSummaryPatch);
    });

    it('should return proper summary patch with "Private" visibility flag', () => {
        const summaryPatch = fileApiVariation.createSummaryPatch({
            name: 'name',
            description: 'description',
            applicationId: 'app-id',
            extensions: {
                id: 'ID',
                uri: 'file:/uri',
                visibility: FileVisibility.Private
            }
        }, new File([''], 'filename'));

        const expectedSummaryPatch = {
            name: 'name',
            description: 'description',
            extensions: {
                visibility: FileVisibility.Private,
            },
            type: ContentType.File
        };

        expect(summaryPatch).toEqual(expectedSummaryPatch);
    });

    it('should return proper summary patch when we do not have visibility flag set', () => {
        const summaryPatch = fileApiVariation.createSummaryPatch({
            name: 'name',
            description: 'description',
            applicationId: 'app-id',
            extensions: {
                id: 'ID',
                uri: 'file:/uri',
            }
        }, new File([''], 'filename'));

        const expectedSummaryPatch = {
            name: 'name',
            description: 'description',
            extensions: {
                visibility: FileVisibility.Private,
            },
            type: ContentType.File
        };

        expect(summaryPatch).toEqual(expectedSummaryPatch);
    });
});
