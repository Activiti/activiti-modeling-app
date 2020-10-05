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

import { getEmptyContentModel } from './empty-content-model';
import { ContentModel, ModelScope } from '../../api/types';

describe('Empty content model', () => {

    const mockModel: ContentModel = {
        id: 'mock-content-model',
        name: 'mock',
        projectIds: ['mock-project-id'],
        description: 'This is the mock description',
        type: 'model',
        version: '0',
        createdBy: null,
        creationDate: null,
        lastModifiedBy: null,
        lastModifiedDate: null,
        scope: ModelScope.GLOBAL
    };

    const mockModelWithDashes = { ...mockModel, name: 'm-o-c-k' };

    const userName = 'testUser';

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

    const mockWithDashesXMLContent = `<?xml version="1.0" encoding="UTF-8"?>
  <model name="mock:m-o-c-k" xmlns="http://www.alfresco.org/model/dictionary/1.0">
    <description><![CDATA[This is the mock description]]></description>
    <author>testUser</author>
    <version>1.0</version>
    <imports>
      <import uri="http://www.alfresco.org/model/dictionary/1.0" prefix="d"/>
      <import uri="http://www.alfresco.org/model/content/1.0" prefix="cm"/>
    </imports>
    <namespaces>
      <namespace uri="http://www.alfresco.org/model/m-o-c-k" prefix="mock"/>
    </namespaces>
  </model>`;

    it('should create initial content', () => {
        expect(getEmptyContentModel(mockModel, userName)).toEqual(mockXMLContent);
    });

    it('should remove dashes from prefix', () => {
        expect(getEmptyContentModel(mockModelWithDashes, userName)).toEqual(mockWithDashesXMLContent);
    });
});
