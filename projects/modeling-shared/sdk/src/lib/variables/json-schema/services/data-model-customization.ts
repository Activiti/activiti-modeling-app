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
    DATETIME_TYPE_REFERENCE,
    DATE_TYPE_REFERENCE,
    FILE_TYPE_REFERENCE,
    FOLDER_TYPE_REFERENCE,
    JsonNodeCustomization,
    JSONTypePropertiesDefinition,
    TYPE
} from '../models/model';

export const DATA_MODEL_CUSTOMIZATION = new InjectionToken<DataModelCustomizer[]>('data-model-customizers');

export abstract class DataModelCustomizer {

    public static readonly PROTECTED_ATTRIBUTES = ['type', '$ref', '$defs', 'anyOf', 'allOf', 'oneOf', 'properties', 'required', 'title', 'items'];

    abstract getDataModelType(): string;

    getTypes(schema: JSONSchemaInfoBasics, accessor: string[]): string[] {
        const value = this.getNodeFromSchemaAndAccessor(schema, accessor);
        let types: string[] = [];
        if (Array.isArray(value.type)) {
            value.type.forEach(element => {
                if (typeof element === 'string') {
                    types = types.concat(this.getTypes({ type: element }, ['root']));
                } else {
                    types = types.concat(this.getTypes(element, ['root']));
                }
            });
        } else {
            if (value.type) {
                types.push(value.type as string);
            }
        }

        if (value.$ref) {
            if (value.$ref === DATE_TYPE_REFERENCE) {
                types.push('date');
            } else if (value.$ref === DATETIME_TYPE_REFERENCE) {
                types.push('datetime');
            } else if (value.$ref === FILE_TYPE_REFERENCE) {
                types.push('file');
            } else if (value.$ref === FOLDER_TYPE_REFERENCE) {
                types.push('folder');
            } else {
                types.push('ref');
            }

        } if (value.enum) {
            types.push('enum');
        }

        if (value.anyOf) {
            types.push('anyOf');
        }

        if (value.allOf) {
            types.push('allOf');
        }

        if (value.oneOf) {
            types.push('oneOf');
        }

        return [...new Set(types)];
    }

    setType(type: string, schema: JSONSchemaInfoBasics, accessor: string[], added: boolean) {
        const value = this.getNodeFromSchemaAndAccessor(schema, accessor);
        switch (type) {
            case 'date':
                if (added) {
                    value.$ref = DATE_TYPE_REFERENCE;
                } else {
                    delete value.$ref;
                }
                break;
            case 'datetime':
                if (added) {
                    value.$ref = DATETIME_TYPE_REFERENCE;
                } else {
                    delete value.$ref;
                }
                break;
            case 'file':
                if (added) {
                    value.$ref = FILE_TYPE_REFERENCE;
                } else {
                    delete value.$ref;
                }
                break;
            case 'folder':
                if (added) {
                    value.$ref = FOLDER_TYPE_REFERENCE;
                } else {
                    delete value.$ref;
                }
                break;
            case 'enum':
                if (added) {
                    value.enum = [];
                } else {
                    delete value.enum;
                }
                break;
            case 'ref':
                if (added) {
                    value.$ref = '#/$defs';
                } else {
                    delete value.$ref;
                }
                break;
            case 'allOf':
                if (added) {
                    value.allOf = [];
                } else {
                    delete value.allOf;
                }
                break;
            case 'anyOf':
                if (added) {
                    value.anyOf = [];
                } else {
                    delete value.anyOf;
                }
                break;
            case 'oneOf':
                if (added) {
                    value.oneOf = [];
                } else {
                    delete value.oneOf;
                }
                break;
            default:
                if (added) {
                    this.addType(type, value);
                    if (type === 'array') {
                        value.items = this.addItem(schema, accessor);
                    }
                    if (type === 'object') {
                        value.properties = this.addProperty(schema, accessor);
                    }
                } else {
                    this.removeType(type, value);
                    if (type === 'array') {
                        delete value.items;
                    }
                    if (type === 'object') {
                        delete value.properties;
                    }
                }
                break;
        }
    }

    protected addType(type: string, value: JSONSchemaInfoBasics) {
        if (value.type) {
            if (Array.isArray(value.type)) {
                (value.type as string[]).push(type);
            } else {
                const newType: string[] = [];
                newType.push(value.type);
                newType.push(type);
                value.type = newType;
            }
        } else {
            value.type = type;
        }
    }

    protected removeType(type: string, value: JSONSchemaInfoBasics) {
        if (Array.isArray(value.type)) {
            const index = (value.type as string[]).indexOf(type);
            if (index > -1) {
                value.type.splice(index, 1);
            }
            if (value.type.length === 1 && typeof value.type[0] === 'string') {
                value.type = value.type[0];
            }
        } else {
            delete value.type;
        }
    }

    updateNodeCustomization(schema: JSONSchemaInfoBasics, accessor: string[], customization: JsonNodeCustomization) {
        return;
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
        let value = schema;

        for (let index = 1; index < accessor.length; index++) {
            value = value[accessor[index]];
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
