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

import { EntityProperty } from '../../../api/types';

export const arrayTypeSpecificProperties: { [key: string]: EntityProperty} = {
    maxItems: {
        id: 'maxItems',
        name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.MAX_ITEMS',
        type: 'integer'
    },
    minItems: {
        id: 'minItems',
        name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.MIN_ITEMS',
        type: 'integer'
    },
    uniqueItems: {
        id: 'uniqueItems',
        name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.UNIQUE_ITEMS',
        type: 'boolean'
    }
};
