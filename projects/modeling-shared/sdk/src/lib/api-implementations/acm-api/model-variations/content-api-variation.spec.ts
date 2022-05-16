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

import { ModelContentApiVariation } from './content-api-variation';
import { ContentModelXML, ContentModel, ModelScope } from '../../../api/types';
import { AuthenticationService, setupTestBed } from '@alfresco/adf-core';
import { TestBed } from '@angular/core/testing';
import { ContentType } from '../content-types';
import { ModelContentSerializer } from '../model-content-serializer';
import { ModelDataExtractor } from '../model-data-extractor';

/* spellchecker: disable */
describe('ModelContentApiVariation', () => {

    const mockModel: ContentModel = {
        id: 'mock-content-model',
        name: 'initial-mock-name',
        projectIds: ['mock-project-id'],
        description: 'Initial mock description',
        type: 'model',
        version: '0',
        createdBy: null,
        creationDate: null,
        lastModifiedBy: null,
        lastModifiedDate: null,
        scope: ModelScope.GLOBAL
    };

    const mockXMLContent = `<?xml version="1.0" encoding="UTF-8"?>
  <model name="mock:mock" xmlns="http://www.alfresco.org/model/dictionary/1.0">
    <description><![CDATA[This is the mock description]]></description>
    <author>testUser</author>
    <version>1.0</version>
    <imports>
      <import uri="http://www.alfresco.org/model/dictionary/1.0" prefix="d"/>
      <import uri="http://www.alfresco.org/model/content/1.0" prefix="cm"/>
    </imports>
    <namespaces>
      <namespace uri="http://www.alfresco.org/model/mock" prefix="mock"/>
    </namespaces>
  </model>`;

    const mockInitialXMLContent = `<?xml version="1.0" encoding="UTF-8"?>
  <model name="initialmockname:initial-mock-name" xmlns="http://www.alfresco.org/model/dictionary/1.0">
    <description><![CDATA[Initial mock description]]></description>
    <author>testUser</author>
    <version>1.0</version>
    <imports>
      <import uri="http://www.alfresco.org/model/dictionary/1.0" prefix="d"/>
      <import uri="http://www.alfresco.org/model/content/1.0" prefix="cm"/>
    </imports>
    <namespaces>
      <namespace uri="http://www.alfresco.org/model/initial-mock-name" prefix="initialmockname"/>
    </namespaces>
  </model>`;

    let authenticationService: AuthenticationService;
    let variation: ModelContentApiVariation<ContentModel, ContentModelXML>;

    setupTestBed({
        imports: [],
        declarations: [],
        providers: [
            {
                provide: AuthenticationService,
                useValue: {
                    getBpmUsername: jest.fn().mockImplementation(() => 'testUser')
                }
            }
        ]
    });

    beforeAll(() => {
        authenticationService = TestBed.inject(AuthenticationService);
        variation = new ModelContentApiVariation(
            authenticationService,
            {register: () => {}} as unknown as ModelContentSerializer,
            {register: () => {}} as unknown as ModelDataExtractor,
        );
    });

    it('should create summary patch from xml content', () => {
        expect(variation.createSummaryPatch(mockModel, mockXMLContent)).toEqual({
            name: 'mock',
            description: 'This is the mock description',
            type: ContentType.Model,
            scope: ModelScope.GLOBAL
        });
    });

    it('should create initial content', () => {
        expect(variation.createInitialContent(mockModel)).toEqual(mockInitialXMLContent);
    });

    it('should return filename', () => {
        expect(variation.getModelFileName(mockModel)).toEqual('initial-mock-name.xml');
    });

    it('should return mimetype', () => {
        expect(variation.getModelMimeType(mockModel)).toEqual('text/plain');
    });
});
