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

import { Injectable } from '@angular/core';
import { JSONRef, JSONSchemaInfoBasics, JSONSchemaPropertyBasics } from '../../api/types';
import { arrayModelType } from './expression-language/array.model.type';
import { dateModelType } from './expression-language/date.model.type';
import { eventSchema } from './expression-language/event-schema';
import { jsonModelType } from './expression-language/json.model.type';
import { stringModelType } from './expression-language/string.model.type';
import { ModelingType, ModelingTypeMap, ModelingTypeMethodDescription, ModelingTypePropertyDescription } from './modeling-type-provider.service';

@Injectable({
    providedIn: 'root'
})
export class JSONSchemaToModelingTypesService {

    public static readonly EVENT_PREFIX = 'event-';

    getPrimitiveModelingTypesFromJSONSchema(jsonSchema: JSONSchemaInfoBasics): ModelingTypeMap {
        return this.getModelingTypesFromJSONSchema(jsonSchema, null);
    }

    getModelingTypesFromJSONSchema(
        jsonSchema: JSONSchemaInfoBasics,
        schemaName: string,
        ...existingModelingTypes: ModelingTypeMap[]
    ): ModelingTypeMap {
        let modelingTypes = {};
        if (existingModelingTypes?.length > 0) {
            existingModelingTypes.forEach(existingTypes => modelingTypes = { ...modelingTypes, ...existingTypes });
        }
        if (jsonSchema.anyOf) {
            this.addModelingType(this.addTypeFromArrayOfTypes(jsonSchema.anyOf, modelingTypes, schemaName, jsonSchema, schemaName), schemaName, modelingTypes, true);
        } else if (jsonSchema.allOf) {
            this.addModelingType(this.addTypeFromArrayOfTypes(jsonSchema.allOf, modelingTypes, schemaName, jsonSchema, schemaName), schemaName, modelingTypes, true);
        } else if (jsonSchema.type) {
            switch (jsonSchema.type) {
                case 'object':
                    this.addModelingType({
                        id: schemaName,
                        methods: jsonModelType.methods,
                        properties: this.getProperties(jsonSchema.properties, modelingTypes, schemaName, jsonSchema, schemaName)
                    }, schemaName, modelingTypes);
                    break;
                case 'array':
                    this.addModelingType({
                        id: schemaName,
                        methods: arrayModelType.methods,
                        properties: arrayModelType.properties,
                        collectionOf: this.getArrayCollectionType(jsonSchema.items, modelingTypes, schemaName, jsonSchema, schemaName)
                    }, schemaName, modelingTypes);
                    break;
                case 'string':
                    modelingTypes[schemaName] = { ...stringModelType, id: schemaName };
                    break;
                default:
                    modelingTypes[schemaName] = {
                        id: schemaName
                    };
                    break;
            }
        }
        if (existingModelingTypes?.length > 0) {
            existingModelingTypes.forEach(existingTypes => { Object.keys(existingTypes).forEach(key => delete modelingTypes[key]); });
        }
        return modelingTypes;
    }

    getModelingTypesFromEventDataJSONSchema(dataJsonSchema: JSONSchemaInfoBasics, schemaName: string) {
        const dataModelingTypes = this.getModelingTypesFromJSONSchema(dataJsonSchema, JSONSchemaToModelingTypesService.EVENT_PREFIX + schemaName + '-data');
        const eventSchemaModelingTypes = this.getModelingTypesFromJSONSchema(eventSchema, 'event');

        const jsonSchema = {
            allOf: [
                {
                    type: 'event'
                },
                {
                    type: 'object',
                    properties: {
                        data: {
                            type: JSONSchemaToModelingTypesService.EVENT_PREFIX + schemaName + '-data'
                        }
                    }
                }
            ]
        };

        const result = this.getModelingTypesFromJSONSchema(jsonSchema, JSONSchemaToModelingTypesService.EVENT_PREFIX + schemaName, eventSchemaModelingTypes, dataModelingTypes);
        return { ...result, ...dataModelingTypes };
    }

    private addTypeFromArrayOfTypes(
        jsonTypesArray: JSONSchemaPropertyBasics[] | JSONRef[] | JSONSchemaInfoBasics[],
        modelingTypes: ModelingTypeMap,
        typeName: string,
        originalJsonSchema: JSONSchemaInfoBasics,
        schemaName: string
    ): ModelingType {
        const items: ModelingType[] = this.getModelingTypesFromArray(typeName, jsonTypesArray, modelingTypes, originalJsonSchema, schemaName);
        return this.mergeTypes(items, typeName);
    }

    private mergeTypes(items: ModelingType[], typeName: string) {
        let methods = [];
        let properties = [];
        let collectionOf = null;

        items.forEach(item => {
            if (item?.methods) {
                item.methods.forEach(method => {
                    if (!methods.find(existingMethod => method.signature === existingMethod.signature && method.parameters === existingMethod.parameters)) {
                        methods = methods.concat(method);
                    }
                });
            }
            if (item?.properties) {
                item.properties.forEach(itemProperty => {
                    if (!properties.find(existingProperty => itemProperty.property === existingProperty.property)) {
                        properties = properties.concat(itemProperty);
                    }
                });
            }
            if (item?.collectionOf) {
                collectionOf = item.collectionOf;
            }
        });

        const modelingType: ModelingType = {
            id: typeName,
            methods: methods,
            properties: properties
        };

        if (collectionOf) {
            modelingType.collectionOf = collectionOf;
        }

        return modelingType;
    }

    private getModelingTypesFromArray(
        name: string,
        jsonTypesArray: JSONSchemaPropertyBasics[] | JSONRef[] | JSONSchemaInfoBasics[],
        modelingTypes: ModelingTypeMap,
        originalJsonSchema: JSONSchemaInfoBasics,
        schemaName: string
    ): ModelingType[] {
        const modelingTypesArray: ModelingType[] = [];
        jsonTypesArray.forEach(type => {
            const typeName = this.getType(name, type, modelingTypes, null, originalJsonSchema, schemaName);
            modelingTypesArray.push(modelingTypes[typeName]);
        });
        return modelingTypesArray;
    }

    private getProperties(
        properties: JSONSchemaPropertyBasics,
        modelingTypes: ModelingTypeMap,
        prefix: string,
        originalJsonSchema: JSONSchemaInfoBasics,
        schemaName: string
    ): ModelingTypePropertyDescription[] {
        const typeProperties: ModelingTypePropertyDescription[] = [];
        if (properties) {
            Object.keys(properties).forEach(property => {
                typeProperties.push({
                    property,
                    documentation: properties[property].description,
                    type: this.getType(property, properties[property], modelingTypes, prefix, originalJsonSchema, schemaName)
                });
            });
        }
        return typeProperties;
    }

    private getType(
        name: string,
        property: JSONSchemaInfoBasics,
        modelingTypes: ModelingTypeMap,
        prefix: string,
        originalJsonSchema: JSONSchemaInfoBasics,
        schemaName: string
    ): string {
        let typeName = this.getTypeName(prefix, name);
        if (property.anyOf) {
            this.addModelingType(this.addTypeFromArrayOfTypes(property.anyOf, modelingTypes, typeName, originalJsonSchema, schemaName), typeName, modelingTypes, true);
        } else if (property.allOf) {
            this.addModelingType(this.addTypeFromArrayOfTypes(property.allOf, modelingTypes, typeName, originalJsonSchema, schemaName), typeName, modelingTypes, true);
        } else if (property.type) {
            if (Array.isArray(property.type)) {
                const items = [];
                property.type.forEach(item => {
                    const itemName = this.getType(name, item, modelingTypes, prefix, originalJsonSchema, schemaName);
                    items.push(modelingTypes[itemName]);
                });
                const modelingType = this.mergeTypes(items, typeName);
                this.addModelingType(modelingType, typeName, modelingTypes);
            } else {
                switch (property.type) {
                    case 'object':
                        this.addModelingType({
                            id: typeName,
                            methods: jsonModelType.methods,
                            properties: this.getProperties(property.properties, modelingTypes, typeName, originalJsonSchema, schemaName)
                        }, typeName, modelingTypes);
                        break;
                    case 'array':
                        this.addModelingType({
                            id: typeName,
                            methods: arrayModelType.methods || [],
                            properties: arrayModelType.properties || [],
                            collectionOf: this.getArrayCollectionType(property.items, modelingTypes, typeName, originalJsonSchema, schemaName)
                        }, typeName, modelingTypes);
                        break;
                    case 'string':
                        if (!schemaName) {
                            this.addModelingType({
                                id: 'string',
                                properties: stringModelType.properties || [],
                                methods: stringModelType.methods || []
                            }, 'string', modelingTypes);
                        }
                        typeName = 'string';
                        break;
                    case 'number':
                        if (!schemaName) {
                            this.addModelingType({
                                id: 'integer'
                            }, 'integer', modelingTypes);
                        }
                        typeName = 'integer';
                        break;
                    default:
                        if (!schemaName) {
                            this.addModelingType({
                                id: property.type
                            }, property.type, modelingTypes);
                        }
                        typeName = property.type;
                        break;
                }
            }
        } else if (property.$ref) {
            typeName = this.getTypeFromReference(property.$ref, modelingTypes, originalJsonSchema, schemaName);
        }
        return typeName;
    }

    private getTypeFromReference($ref: string, modelingTypes: ModelingTypeMap, originalJsonSchema: JSONSchemaInfoBasics, schemaName: string): string {
        const path = $ref.split('/');
        let jsonNode = originalJsonSchema;
        for (let index = 1; index < path.length - 1; index++) {
            jsonNode = jsonNode[path[index]];
        }
        const nodeName = path[path.length - 1];
        return this.getType(nodeName, jsonNode[nodeName], modelingTypes, schemaName ? schemaName : null, originalJsonSchema, schemaName);
    }

    private getArrayCollectionType(
        items: JSONRef[] | JSONSchemaPropertyBasics[] | JSONSchemaInfoBasics,
        modelingTypes: ModelingTypeMap,
        prefix: string,
        originalJsonSchema: JSONSchemaInfoBasics,
        schemaName: string
    ): string {
        let typeName: string;
        const name = 'array';
        if (Array.isArray(items)) {
            let methods: ModelingTypeMethodDescription[] = [];
            let properties: ModelingTypePropertyDescription[] = [];
            items.forEach(item => {
                if (item.$ref) {
                    typeName = this.getType(name, item, modelingTypes, prefix, originalJsonSchema, schemaName);
                } else {
                    Object.keys(item).forEach(key => {
                        typeName = this.getType(key, item, modelingTypes, prefix, originalJsonSchema, schemaName);
                        methods = methods.concat(modelingTypes[typeName].methods);
                        properties = properties.concat(modelingTypes[typeName].properties);
                    });
                    typeName = this.getTypeName(name, prefix);
                    this.addModelingType({
                        id: typeName,
                        methods: methods,
                        properties: properties
                    }, this.getTypeName(name, prefix), modelingTypes);
                }
            });
        } else {
            typeName = this.getType(name, items, modelingTypes, prefix, originalJsonSchema, schemaName);
        }
        return typeName;
    }

    private addModelingType(modelingType: ModelingType, typeName: string, modelingTypes: ModelingTypeMap, force = false) {
        if (typeName && (!modelingTypes[typeName] || force)) {

            if (typeName === 'date' || typeName === 'datetime') {
                modelingType = { ...dateModelType, id: typeName };
            }

            modelingTypes[typeName] = modelingType;
        }
    }

    private getTypeName(prefix: string, name: string) {
        let typeName = name;
        if (name) {
            typeName = prefix ? prefix + '-' + name : name;
        }
        return typeName;
    }
}
