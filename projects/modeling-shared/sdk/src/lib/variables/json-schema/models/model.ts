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

import { EntityProperty, JSONSchemaInfoBasics } from '../../../api/types';
import { arrayTypeSpecificProperties } from './array';
import { descriptionProperty } from './description';
import { enumTypeSpecificProperties } from './enum';
import { integerTypeSpecificProperties } from './integer';
import { numberTypeSpecificProperties } from './number';
import { objectTypeSpecificProperties } from './object';
import { stringTypeSpecificProperties } from './string';

export const TYPES: { name: string, value: string[] }[] = [
    { name: 'SDK.JSON_SCHEMA_EDITOR.TYPES_GROUPS.JSON_SCHEMA_TYPES', value: ['array', 'boolean', 'integer', 'object', 'number', 'string'] },
    { name: 'SDK.JSON_SCHEMA_EDITOR.TYPES_GROUPS.MODELING_APP', value: ['date', 'datetime'] },
    { name: 'SDK.JSON_SCHEMA_EDITOR.TYPES_GROUPS.ENUMERATION', value: ['enum'] },
    { name: 'SDK.JSON_SCHEMA_EDITOR.TYPES_GROUPS.COMPOSITION', value: ['allOf', 'anyOf', 'oneOf', 'ref'] }
];

export const TYPE: { [key: string]: JSONTypePropertiesDefinition } = {
    object: objectTypeSpecificProperties,
    array: arrayTypeSpecificProperties,
    string: stringTypeSpecificProperties,
    number: numberTypeSpecificProperties,
    integer: integerTypeSpecificProperties,
    enum: enumTypeSpecificProperties,
    description: descriptionProperty
};

export const DATE_TYPE_REFERENCE = '#/$defs/primitive/date';
export const DATETIME_TYPE_REFERENCE = '#/$defs/primitive/datetime';

export interface JSONSchemaDefinition {
    accessor: string;
    key: string;
    definition: JSONSchemaInfoBasics;
}

export interface JSONTypePropertiesDefinition {
    [key: string]: EntityProperty;
}

export interface JSONSchemaEditorDialogData {
    value: JSONSchemaInfoBasics;
    typeAttributes: JSONTypePropertiesDefinition;
}

export interface ChildrenDeletedEvent {
    compositionType: string;
    index: number;
}
