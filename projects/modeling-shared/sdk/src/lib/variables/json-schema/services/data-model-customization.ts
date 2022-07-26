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

/* eslint-disable @typescript-eslint/no-unused-vars */
import { InjectionToken, Type } from '@angular/core';
import { JSONSchemaInfoBasics } from '../../../api/types';
import {
    DefaultJsonNodeCustomization,
    JsonNodeCustomization,
    JSONTypePropertiesDefinition,
    TYPE
} from '../models/model';

export const DATA_MODEL_CUSTOMIZATION = new InjectionToken<DataModelCustomizer[]>('data-model-customizers');

export abstract class DataModelCustomizer {

    public static readonly PROTECTED_ATTRIBUTES = ['type', '$ref', '$defs', 'anyOf', 'allOf', 'oneOf', 'properties', 'required', 'title', 'items'];

    abstract getDataModelType(): string;

    getNodeCustomization(schema: JSONSchemaInfoBasics, accessor: string[]): JsonNodeCustomization {
        return new DefaultJsonNodeCustomization();
    }

    getPropertiesDefinitionForType(schema: JSONSchemaInfoBasics, accessor: string[], type: string): JSONTypePropertiesDefinition {
        return TYPE[type];
    }

    getProtectedAttributesByType(schema: JSONSchemaInfoBasics, accessor: string[], type: string): string[] {
        return DataModelCustomizer.PROTECTED_ATTRIBUTES;
    }

    addProperty(schema: JSONSchemaInfoBasics, accessor: string[]): JSONSchemaInfoBasics {
        return {};
    }

    addItem(schema: JSONSchemaInfoBasics, accessor: string[]): JSONSchemaInfoBasics {
        return { type: 'string' };
    }

    addDefinition(schema: JSONSchemaInfoBasics, accessor: string[]): JSONSchemaInfoBasics {
        return { type: 'object', title: '' };
    }

    addChild(schema: JSONSchemaInfoBasics, accessor: string[], type: string): JSONSchemaInfoBasics {
        return { type: 'object' };
    }

    protected getNodeFromSchemaAndAccessor(schema: JSONSchemaInfoBasics, accessor: string[]): JSONSchemaInfoBasics {
        let value = { ...schema };

        for (let index = 1; index < accessor.length; index++) {
            value = { ...value[accessor[index]] };
        }

        return value;
    }
}

export function provideDataModelCustomization(implementationClass: Type<DataModelCustomizer>) {
    return {
        provide: DATA_MODEL_CUSTOMIZATION,
        useClass: implementationClass,
        multi: true
    };
}
