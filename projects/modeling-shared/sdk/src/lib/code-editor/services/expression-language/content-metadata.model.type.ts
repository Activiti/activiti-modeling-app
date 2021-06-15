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

import { ModelingType } from '../modeling-type-provider.service';
import { jsonModelType } from './json.model.type';

export const contentMetadataModelType: ModelingType = {
    id: 'content-metadata',
    hidden: true,
    properties: [[
        {
            property: 'sizeInBytes',
            type: 'integer',
            documentation: 'Node size in bytes'
        },
        {
            property: 'mimeType',
            type: 'string',
            documentation: 'Node mime type'
        },
        {
            property: 'uri',
            type: 'string',
            documentation: 'Node URI'
        }
    ], jsonModelType.properties].flat(),
    methods: jsonModelType.methods
};
