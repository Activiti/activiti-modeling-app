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

export const stringTypeSpecificProperties: { [key: string]: EntityProperty } = {
    maxLength: {
        id: 'maxLength',
        name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.MAX_LENGTH',
        type: 'integer'
    },
    minLength: {
        id: 'minLength',
        name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.MIN_LENGTH',
        type: 'integer'
    },
    pattern: {
        id: 'pattern',
        name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.PATTERN',
        type: 'string'
    },
    format: {
        id: 'format',
        name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.FORMAT',
        type: 'enum',
        model: { enum: ['date', 'date-time', 'email', 'hostname', 'ipv4', 'ipv6', 'uri'] }
    }
};
