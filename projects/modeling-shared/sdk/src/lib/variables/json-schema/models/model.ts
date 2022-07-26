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

export const TYPES: JSONSchemaTypeDropdownDefinition = {
    multiple: true,
    groups: true,
    groupOptions: [
        {
            name: 'SDK.JSON_SCHEMA_EDITOR.TYPES_GROUPS.JSON_SCHEMA_TYPES',
            value: [
                { label: 'array', id: 'array' },
                { label: 'boolean', id: 'boolean' },
                { label: 'integer', id: 'integer' },
                { label: 'object', id: 'object' },
                { label: 'number', id: 'number' },
                { label: 'string', id: 'string' }
            ]
        },
        {
            name: 'SDK.JSON_SCHEMA_EDITOR.TYPES_GROUPS.MODELING_APP',
            value: [
                { label: 'date', id: 'date' },
                { label: 'datetime', id: 'datetime' },
                { label: 'file', id: 'file' },
                { label: 'folder', id: 'folder' }
            ]
        },
        {
            name:
                'SDK.JSON_SCHEMA_EDITOR.TYPES_GROUPS.ENUMERATION',
            value: [
                { label: 'enum', id: 'enum' }
            ]
        },
        {
            name: 'SDK.JSON_SCHEMA_EDITOR.TYPES_GROUPS.COMPOSITION',
            value: [
                { label: 'allOf', id: 'allOf' },
                { label: 'anyOf', id: 'anyOf' },
                { label: 'oneOf', id: 'oneOf' },
                { label: 'ref', id: 'ref' }
            ]
        }
    ]
};

export interface JSONSchemaTypeDropdownDefinition {
    multiple: boolean,
    groups: boolean,
    groupOptions?: {
        name: string;
        value: {
            label: string;
            id: string;
        }[]
    }[];
    options?: {
        label: string;
        id: string;
    }[]
}

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
export const FILE_TYPE_REFERENCE = '#/$defs/primitive/file';
export const FOLDER_TYPE_REFERENCE = '#/$defs/primitive/folder';

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
    dataModelType: string;
    allowCustomAttributes: boolean;
    allowAttributesPreview: boolean;
    schema: JSONSchemaInfoBasics;
    accessor: string[];
}

export interface ChildrenDeletedEvent {
    compositionType: string;
    index: number;
}

export interface JsonNodeCustomization {
    key: {
        disabled: boolean;
        hide: boolean;
        value?: string;
    },
    required: {
        disabled: boolean;
        hide: boolean;
        value?: boolean;
    }
    type: {
        disabled: boolean;
        hide: boolean;
        static: boolean;
        value?: string[];
        definitions?: JSONSchemaTypeDropdownDefinition;
        references: {
            whiteList?: string[];
            blackList?: string[];
        };
    },
    title: {
        disabled: boolean;
        hide: boolean;
        value?: string;
    },
    buttonTooltips: {
        anyOf: string;
        allOf: string;
        oneOf: string;
        property: string;
        definition: string;
    }
}

export class DefaultJsonNodeCustomization implements JsonNodeCustomization {
    key = {
        disabled: false,
        hide: false
    };

    required = {
        disabled: false,
        hide: false
    };

    type = {
        disabled: false,
        hide: false,
        static: false,
        definitions: TYPES,
        references: {
            blackList: []
        }
    };

    title = {
        disabled: false,
        hide: false
    };

    buttonTooltips = {
        anyOf: 'SDK.JSON_SCHEMA_EDITOR.ADD_CHILD_ANY_OF',
        allOf: 'SDK.JSON_SCHEMA_EDITOR.ADD_CHILD_ALL_OF',
        oneOf: 'SDK.JSON_SCHEMA_EDITOR.ADD_CHILD_ONE_OF',
        property: 'SDK.JSON_SCHEMA_EDITOR.ADD_PROPERTY',
        definition: 'SDK.JSON_SCHEMA_EDITOR.ADD_DEFINITION',
    };
}
