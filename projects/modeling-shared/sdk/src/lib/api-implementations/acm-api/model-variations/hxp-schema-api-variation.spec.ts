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

import { TestBed } from '@angular/core/testing';
import {
    HxPSchema,
    JSONSchemaInfoBasics,
    ModelScope,
} from '../../../api/types';
import { ContentType } from '../content-types';
import { ModelContentSerializer } from '../model-content-serializer';
import { ModelDataExtractor } from '../model-data-extractor';
import { HxPSchemaApiVariation } from './hxp-schema-api-variation';

const mockModel: HxPSchema & { prefix: string } = {
    id: '1',
    type: 'hxp_schema',
    description: 'sample-description',
    version: '1',
    creationDate: new Date(2022, 12, 16, 0, 0, 0),
    lastModifiedDate: new Date(2022, 12, 16, 0, 0, 0),
    createdBy: 'user',
    name: 'sample-name',
    prefix: 'sample-prefix',
    lastModifiedBy: 'user',
    projectIds: [],
    scope: ModelScope.PROJECT,
};

const mockModelContent = {
    description: 'sample-description',
    type: 'object',
    $id: 'sample-prefix',
};

describe('HxPSchemaApiVariation', () => {
    let service: HxPSchemaApiVariation<
        HxPSchema & { prefix: string },
        JSONSchemaInfoBasics
    >;
    const mockModelContentSerializer = {
        register: jest.fn().mockImplementation(() => null),
        serialize: jest.fn().mockImplementation(() => 'mockSerialization'),
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: ModelContentSerializer,
                    useValue: mockModelContentSerializer,
                },
                {
                    provide: ModelDataExtractor,
                    useValue: {
                        register: jest.fn().mockImplementation(() => null),
                    },
                },
                HxPSchemaApiVariation,
            ],
        });
        service = TestBed.inject(HxPSchemaApiVariation);
    });

    it('should call serializer on serialize', () => {
        const spy = jest.spyOn(mockModelContentSerializer, 'serialize');
        service.serialize(mockModelContent);
        expect(spy).toHaveBeenCalledWith(mockModelContent, ContentType.HxPSchema);
    });

    it('should create initial content', () => {
        const result = service.createInitialContent(mockModel);
        expect(result).toEqual({
            description: 'sample-description',
            type: 'object',
            $id: 'sample-prefix',
        });
    });

    it('should create summary patch', () => {
        const result = service.createSummaryPatch(mockModel, mockModelContent);

        expect(result).toEqual({
            name: 'sample-name',
            description: 'sample-description',
            type: ContentType.HxPSchema,
        });
    });

    it('should return model mime type', () => {
        expect(service.getModelMimeType(mockModel)).toEqual('application/json');
    });

    it('should return model file name', () => {
        expect(service.getModelFileName(mockModel)).toEqual('sample-name.json');
    });

    it('should get file to upload', () => {
        const result = service.getFileToUpload(mockModel, mockModelContent);

        expect(result.type).toEqual('application/json');
        expect(result.size).toEqual('mockSerialization'.length);
    });
});
