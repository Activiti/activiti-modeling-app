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

import { Observable, of } from 'rxjs';
import { JSONSchemaInfoBasics } from '../api/types';
import { ModelingJsonSchema, ModelingJsonSchemaProvider, ModelsWithJsonSchemaMap } from '../services/modeling-json-schema-provider.service';
import { PropertyTypeItem } from '../variables/properties-viewer/property-type-item/models';

export const expectedPrimitivesInputsItems: PropertyTypeItem = {
    displayName: 'SDK.VARIABLE_TYPE_INPUT.PRIMITIVE_PROPERTIES_TYPES',
    iconName: 'assignment_turned_in',
    isCustomIcon: false,
    provider: 'primitives',
    children: [
        {
            displayName: 'boolean',
            iconName: 'assignment_turned_in',
            isCustomIcon: false,
            provider: 'primitives',
            typeId: ['boolean'],
            value: {
                $ref: '#/$defs/primitive/boolean'
            }
        },
        {
            displayName: 'integer',
            iconName: 'assignment_turned_in',
            isCustomIcon: false,
            provider: 'primitives',
            typeId: ['integer'],
            value: {
                $ref: '#/$defs/primitive/integer'
            }
        },
        {
            displayName: 'json',
            iconName: 'assignment_turned_in',
            isCustomIcon: false,
            provider: 'primitives',
            typeId: ['json'],
            value: {
                $ref: '#/$defs/primitive/json'
            }
        },
        {
            displayName: 'string',
            iconName: 'assignment_turned_in',
            isCustomIcon: false,
            provider: 'primitives',
            typeId: ['string'],
            value: {
                $ref: '#/$defs/primitive/string'
            }
        }
    ]
};

export const expectedRegisteredInputsItems: PropertyTypeItem = {
    displayName: 'SDK.VARIABLE_TYPE_INPUT.CUSTOM_INPUTS_PROPERTIES_TYPES',
    iconName: 'assignment',
    isCustomIcon: false,
    provider: 'registered-inputs',
    children: [
        {
            displayName: 'employee',
            iconName: 'assignment',
            isCustomIcon: false,
            provider: 'registered-inputs',
            typeId: ['employee'],
            value: {
                $ref: '#/$defs/primitive/employee'
            }
        },
        {
            displayName: 'other-boolean',
            iconName: 'assignment',
            isCustomIcon: false,
            provider: 'registered-inputs',
            typeId: ['other-boolean'],
            value: {
                $ref: '#/$defs/primitive/other-boolean'
            }
        }
    ]
};

export class MockModelingJsonSchemaProvider extends ModelingJsonSchemaProvider<JSONSchemaInfoBasics> {
    getProviderName(): string {
        return 'mock-json-schema-provider';
    }
    getProviderIcon(): string {
        return 'mock-icon';
    }
    getProviderTranslatedName(): string {
        return 'mock-name';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected retrieveModels(projectId: string): Observable<ModelsWithJsonSchemaMap<JSONSchemaInfoBasics>> {
        const models = {
            sample: {
                type: 'string'
            }
        };
        return of(models);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected transformModelToJsonSchemas(projectId: string, modelName: string, schema: JSONSchemaInfoBasics): ModelingJsonSchema[] {
        return [{
            projectId,
            schema,
            typeId: [this.getProviderName(), modelName]
        }];
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getPropertyTypeItems(projectId: string): Observable<PropertyTypeItem> {
        const rootItem: PropertyTypeItem = {
            displayName: this.getProviderTranslatedName(),
            iconName: this.getProviderIcon(),
            isCustomIcon: this.isCustomIcon(),
            provider: this.getProviderName(),
            children: [
                {
                    displayName: 'sample',
                    iconName: this.getProviderIcon(),
                    isCustomIcon: this.isCustomIcon(),
                    provider: this.getProviderName(),
                    description: 'sample',
                    typeId: [this.getProviderName(), 'sample']
                }
            ]
        };

        return of(rootItem);
    }
}

export const expectedCustomJSONProvider: PropertyTypeItem = {
    displayName: 'mock-name',
    iconName: 'mock-icon',
    isCustomIcon: false,
    provider: 'mock-json-schema-provider',
    children: [
        {
            displayName: 'sample',
            iconName: 'mock-icon',
            isCustomIcon: false,
            provider: 'mock-json-schema-provider',
            description: 'sample',
            typeId: ['mock-json-schema-provider', 'sample'],
            value: {
                $ref: '#/$defs/mock-json-schema-provider/sample',
            }
        }
    ]
};

export const expectedCreateModelItems: PropertyTypeItem = {
    displayName: 'SDK.PROPERTY_TYPE_SELECTOR.CREATE_MODEL',
    description: 'SDK.PROPERTY_TYPE_SELECTOR.CREATE_MODEL_DESCRIPTION',
    isCustomIcon: false,
    iconName: 'note_alt',
    value: {},
    provider: 'PropertyTypeSelectorSmartComponent'
};

export const expectedHierarchy: PropertyTypeItem[] = [
    expectedPrimitivesInputsItems,
    expectedRegisteredInputsItems,
    expectedCustomJSONProvider,
    expectedCreateModelItems
];
