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
    HxPDocumentType,
    JSONSchemaInfoBasics,
    ModelScope
} from '../../../api/types';
import { ContentType } from '../content-types';
import { ModelContentSerializer } from '../model-content-serializer';
import { ModelDataExtractor } from '../model-data-extractor';
import { HxPDocumentTypeApiVariation } from './hxp-document-type-api-variation';

const mockParent = {
    name: 'mock-parent',
    type: 'hxp-document-types'
};

const mockModel: HxPDocumentType = {
    id: 'mock-id',
    type: 'hxp_doc_type',
    parent: mockParent,
    description: 'mock-description',
    version: 'mock-version',
    creationDate: new Date(2023, 2, 22, 14, 30, 15),
    lastModifiedDate: new Date(2023, 2, 22, 16, 15, 0),
    createdBy: 'mock-user',
    name: 'mock-name',
    lastModifiedBy: 'mock-user',
    projectIds: [],
    scope: ModelScope.PROJECT,
};

const mockModelContent = {
    description: 'mock-description',
    allOf: []
};

describe('HxPDocumentTypeApiVariation', () => {
    let service: HxPDocumentTypeApiVariation<HxPDocumentType, JSONSchemaInfoBasics>;
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
                HxPDocumentTypeApiVariation,
            ],
        });
        service = TestBed.inject(HxPDocumentTypeApiVariation);
    });

    it('should call serializer on serialize', () => {
        const spy = jest.spyOn(mockModelContentSerializer, 'serialize');
        service.serialize(mockModelContent);
        expect(spy).toHaveBeenCalledWith(mockModelContent, ContentType.HxPDocumentType);
    });

    it('should create initial content (without parent)', () => {
        const result = service.createInitialContent({ ...mockModel, parent: null });
        expect(result).toEqual({
            description: 'mock-description',
            allOf: []
        });
    });

    it('should create initial content (with parent)', () => {
        const result = service.createInitialContent(mockModel);
        expect(result).toEqual({
            description: 'mock-description',
            allOf: [{
                $ref: '#/$defs/hxp-document-types/mock-parent'
            }]
        });
    });

    it('should create summary patch', () => {
        const result = service.createSummaryPatch(mockModel, mockModelContent);

        expect(result).toEqual({
            name: 'mock-name',
            description: 'mock-description',
            type: ContentType.HxPDocumentType,
        });
    });

    it('should return model mime type', () => {
        expect(service.getModelMimeType(mockModel)).toEqual('application/json');
    });

    it('should return model file name', () => {
        expect(service.getModelFileName(mockModel)).toEqual('mock-name.json');
    });

    it('should get file to upload', () => {
        const result = service.getFileToUpload(mockModel, mockModelContent);

        expect(result.type).toEqual('application/json');
        expect(result.size).toEqual('mockSerialization'.length);
    });
});
