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

import { Process, ProcessContent } from '../../../../api/types';
import { getXmlContentByTagName } from './get-xml-content-by-tag-name.helper';

export function extractProcessData(property: string, content: ProcessContent, metadata: Process) {
    const description = getXmlContentByTagName('bpmn2:documentation', content);

    switch (property) {
    case 'name':
        return metadata.name;
    case 'description':
        return description;
    default:
        return null;
    }
}
