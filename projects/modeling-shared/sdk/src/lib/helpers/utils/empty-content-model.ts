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

import { ContentModel } from '../../api/types';

export const getEmptyContentModel = (contentModel: ContentModel, username: string) => `<?xml version="1.0" encoding="UTF-8"?>
  <model name="${contentModel.name.replace(/-/g, '')}:${contentModel.name}" xmlns="http://www.alfresco.org/model/dictionary/1.0">
    <description><![CDATA[${contentModel.description}]]></description>
    <author>${username}</author>
    <version>1.0</version>
    <imports>
      <import uri="http://www.alfresco.org/model/dictionary/1.0" prefix="d"/>
      <import uri="http://www.alfresco.org/model/content/1.0" prefix="cm"/>
    </imports>
    <namespaces>
      <namespace uri="http://www.alfresco.org/model/${contentModel.name}" prefix="${contentModel.name.replace(/-/g, '')}"/>
    </namespaces>
  </model>`;
