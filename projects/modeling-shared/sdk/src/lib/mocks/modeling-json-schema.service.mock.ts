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

export const expectedItems = [
    {
        displayName: 'SDK.VARIABLE_TYPE_INPUT.PRIMITIVE_PROPERTIES_TYPES',
        iconName: 'assignment_turned_in',
        isCustomIcon: false,
        provider: 'registered-inputs',
        children: [
            {
                displayName: 'boolean',
                iconName: 'assignment_turned_in',
                isCustomIcon: false,
                provider: 'registered-inputs',
                typeId: ['boolean'],
                value: {
                    $ref: '#/$defs/primitive/boolean'
                }
            },
            {
                displayName: 'employee',
                iconName: 'assignment_turned_in',
                isCustomIcon: false,
                provider: 'registered-inputs',
                typeId: ['employee'],
                value: {
                    $ref: '#/$defs/primitive/employee'
                }
            },
            {
                displayName: 'integer',
                iconName: 'assignment_turned_in',
                isCustomIcon: false,
                provider: 'registered-inputs',
                typeId: ['integer'],
                value: {
                    $ref: '#/$defs/primitive/integer'
                }
            },
            {
                displayName: 'string',
                iconName: 'assignment_turned_in',
                isCustomIcon: false,
                provider: 'registered-inputs',
                typeId: ['string'],
                value: {
                    $ref: '#/$defs/primitive/string'
                }
            }
        ]
    }
];

export const expectedHierarchy = [
    {
        displayName: 'SDK.VARIABLE_TYPE_INPUT.PRIMITIVE_PROPERTIES_TYPES',
        iconName: 'assignment_turned_in',
        isCustomIcon: false,
        provider: 'registered-inputs',
        children: [
            {
                displayName: 'boolean',
                iconName: 'assignment_turned_in',
                isCustomIcon: false,
                provider: 'registered-inputs',
                typeId: ['boolean'],
                value: {
                    $ref: '#/$defs/primitive/boolean'
                }
            },
            {
                displayName: 'integer',
                iconName: 'assignment_turned_in',
                isCustomIcon: false,
                provider: 'registered-inputs',
                typeId: ['integer'],
                value: {
                    $ref: '#/$defs/primitive/integer'
                }
            },
            {
                displayName: 'string',
                iconName: 'assignment_turned_in',
                isCustomIcon: false,
                provider: 'registered-inputs',
                typeId: ['string'],
                value: {
                    $ref: '#/$defs/primitive/string'
                }
            }
        ]
    },
    {
        displayName: 'SDK.PROPERTY_TYPE_SELECTOR.CREATE_MODEL',
        description: 'SDK.PROPERTY_TYPE_SELECTOR.CREATE_MODEL_DESCRIPTION',
        isCustomIcon: false,
        iconName: 'note_alt',
        value: {},
        provider: 'PropertyTypeSelectorSmartComponent'
    }
];

export const expectedRegisteredInputsItems = {
    displayName: 'SDK.VARIABLE_TYPE_INPUT.PRIMITIVE_PROPERTIES_TYPES',
    iconName: 'assignment_turned_in',
    isCustomIcon: false,
    provider: 'registered-inputs',
    children: [
        {
            displayName: 'boolean',
            iconName: 'assignment_turned_in',
            isCustomIcon: false,
            provider: 'registered-inputs',
            typeId: ['boolean']
        },
        {
            displayName: 'integer',
            iconName: 'assignment_turned_in',
            isCustomIcon: false,
            provider: 'registered-inputs',
            typeId: ['integer']
        },
        {
            displayName: 'string',
            iconName: 'assignment_turned_in',
            isCustomIcon: false,
            provider: 'registered-inputs',
            typeId: ['string']
        }
    ]
};
