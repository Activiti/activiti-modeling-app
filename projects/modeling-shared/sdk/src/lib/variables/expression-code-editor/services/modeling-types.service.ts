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

/* eslint-disable max-lines */

import { Injectable } from '@angular/core';
import { JSONSchemaInfoBasics, JSONSchemaPropertyBasics } from '../../../api/types';
import { JSONSchemaToEntityPropertyService } from '../../../services/json-schema-to-entity-property.service';
import { ModelingJSONSchemaService } from '../../../services/modeling-json-schema.service';
import { arrayModelType } from './expression-language/array.model.type';
import { dateModelType } from './expression-language/date.model.type';
import { enumModelType } from './expression-language/enum.model.type';
import { eventSchema } from './expression-language/event-schema';
import { executionModelType } from './expression-language/execution.model.type';
import { jsonModelType } from './expression-language/json.model.type';
import { primitiveTypesSchema } from './expression-language/primitive-types-schema';
import { stringModelType } from './expression-language/string.model.type';
import {
    ModelingType, ModelingTypeMap, ModelingTypeMethodDescription, ModelingTypePropertyDescription, ModelingTypeSignatureHelper, ModelingTypeSuggestion
} from './modeling-type.model';

@Injectable({
    providedIn: 'root'
})
export class ModelingTypesService {

    private registeredTypes: ModelingTypeMap;

    constructor(
        private modelingJSONSchemaService: ModelingJSONSchemaService,
        private jSONSchemaToEntityPropertyService: JSONSchemaToEntityPropertyService
    ) {
        this.registeredTypes = this.getPrimitiveModelingTypesFromJSONSchema();
        this.registeredTypes['enum'] = { ...enumModelType, id: 'enum' };
        this.registeredTypes['execution'] = { ...executionModelType, id: 'execution' };
    }

    getRegisteredType(type: string): ModelingType {
        return this.registeredTypes[type];
    }

    getMethodsByModelSchema(modelSchema: JSONSchemaInfoBasics): ModelingTypeMethodDescription[] {
        const typeName = this.modelingJSONSchemaService.getPrimitiveTypes(modelSchema);
        const methods: ModelingTypeMethodDescription[] = [];
        typeName.forEach(type => {
            this.getRegisteredType(type).methods.forEach(method => {
                if (methods.findIndex(element => this.methodsEquality(element, method)) === -1) {
                    methods.push(method);
                }
            });
        });

        return methods;
    }

    private methodsEquality(method1: ModelingTypeMethodDescription, method2: ModelingTypeMethodDescription): boolean {
        return JSON.stringify(method1) === JSON.stringify(method2);
    }

    getPropertiesByModelSchema(modelSchema: JSONSchemaInfoBasics): ModelingTypePropertyDescription[] {
        const flattenedModelSchema = this.modelingJSONSchemaService.flatSchemaReference(modelSchema);
        const properties = [];

        if (flattenedModelSchema.properties) {
            this.jSONSchemaToEntityPropertyService.getEntityPropertiesFromJSONSchema(flattenedModelSchema).forEach(property => properties.push({
                type: property.type,
                property: property.name,
                documentation: property.description,
                model: property.model
            }));
        }

        if (flattenedModelSchema.allOf) {
            flattenedModelSchema.allOf.forEach(model => this.getPropertiesByModelSchema(model).forEach(property => properties.push(property)));
        } else if (flattenedModelSchema.anyOf) {
            flattenedModelSchema.anyOf.forEach(model => this.getPropertiesByModelSchema(model).forEach(property => properties.push(property)));
        } else if (flattenedModelSchema.oneOf) {
            flattenedModelSchema.oneOf.forEach(model => this.getPropertiesByModelSchema(model).forEach(property => properties.push(property)));
        } else if (Array.isArray(flattenedModelSchema.type)) {
            flattenedModelSchema.type.forEach(model => {
                if (typeof model !== 'string') {
                    this.getPropertiesByModelSchema(model).forEach(property => properties.push(property));
                }
            });
        } else {
            const typeName = this.modelingJSONSchemaService.getPrimitiveTypes(modelSchema);
            typeName.forEach(type => this.getRegisteredType(type).properties?.forEach(property => properties.push(property)));
        }

        return properties;
    }

    getMethodsSuggestionsByModelSchema(modelSchema: JSONSchemaInfoBasics): ModelingTypeSuggestion[] {
        return this.getMethodsByModelSchema(modelSchema).map(method => this.getMethodSuggestion(method));
    }

    getPropertiesSuggestionsByModelSchema(modelSchema: JSONSchemaInfoBasics): ModelingTypeSuggestion[] {
        return this.getPropertiesByModelSchema(modelSchema).map(property => this.getPropertySuggestion(property));
    }

    getSignatureHelperByModelSchema(modelSchema: JSONSchemaInfoBasics): ModelingTypeSignatureHelper[] {
        const methods = this.getMethodsByModelSchema(modelSchema);

        const signatures = [];

        methods.filter(method => !!method).forEach(method => signatures.push({
            label: this.getMethodLabel(method),
            documentation: method.documentation,
            parameters: method.parameters,
            method: method
        }));

        return signatures;
    }

    getModelSchemaFromEntityProperty(property: { type: string; model?: JSONSchemaInfoBasics }): JSONSchemaInfoBasics {
        if (property) {
            const modelSchema = property.model || primitiveTypesSchema.$defs.primitive[property.type] || {};
            return this.modelingJSONSchemaService.flatSchemaReference(modelSchema, true);
        } else {
            return {};
        }
    }

    getFunctionsSuggestions(functions: { signature: string; type: string; documentation: string }[]): any {
        const suggestions = [];
        if (functions) {
            functions.filter(primitiveFunction => !!primitiveFunction).forEach(primitiveFunction => suggestions.push(this.getMethodSuggestion(primitiveFunction)));
        }
        return suggestions;
    }

    getEventJsonSchemaFromDataSchema(dataSchema: JSONSchemaInfoBasics): JSONSchemaInfoBasics {
        const result = this.modelingJSONSchemaService.deepCopy(eventSchema);
        result.properties.data = this.modelingJSONSchemaService.flatSchemaReference(dataSchema, true);
        return result;
    }

    getPrimitiveModelingTypesFromJSONSchema(): ModelingTypeMap {
        return this.getModelingTypesFromJSONSchema(primitiveTypesSchema, null);
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
        } else if (jsonSchema.oneOf) {
            this.addModelingType(this.addTypeFromArrayOfTypes(jsonSchema.oneOf, modelingTypes, schemaName, jsonSchema, schemaName), schemaName, modelingTypes, true);
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

    private getMethodSuggestion(method: ModelingTypeMethodDescription): ModelingTypeSuggestion {
        let replaceParameters = '';
        let parameters = '';

        for (let index = 0; index < method.parameters?.length; index++) {
            const parameter = method.parameters[index];
            replaceParameters += '${' + (index + 1) + ':' + parameter.label + '}';
            parameters += parameter.label;
            if ((index + 1) < method.parameters?.length) {
                replaceParameters += ', ';
                parameters += ', ';
            }
        }

        const label = `${method.signature}(${parameters})` + (method.type ? `: ${method.type}` : '');
        const insertText = `${method.signature}(${replaceParameters})`;

        return {
            label,
            filterText: method.signature,
            kind: 0,
            insertText,
            documentation: method.documentation,
            detail: method.type,
            insertTextRules: method.parameters?.length >= 1 ? 4 : undefined,
            command: method.parameters?.length >= 1 ? { id: 'editor.action.triggerParameterHints' } : undefined
        };
    }

    private getPropertySuggestion(property: ModelingTypePropertyDescription): ModelingTypeSuggestion {
        return {
            label: property.property,
            filterText: property.property,
            kind: 9,
            insertText: property.property,
            documentation: property.documentation,
            detail: property.type
        };
    }

    private getMethodLabel(method: ModelingTypeMethodDescription): string {
        let parameters = '';

        for (let index = 0; index < method.parameters?.length; index++) {
            const parameter = method.parameters[index];
            parameters += parameter.label;
            if ((index + 1) < method.parameters?.length) {
                parameters += ', ';
            }
        }

        return `${method.signature}(${parameters})` + (method.type ? `: ${method.type}` : '');
    }

    private addTypeFromArrayOfTypes(
        jsonTypesArray: JSONSchemaPropertyBasics[] | JSONSchemaInfoBasics[],
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
        jsonTypesArray: JSONSchemaPropertyBasics[] | JSONSchemaInfoBasics[],
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
        } else if (property.oneOf) {
            this.addModelingType(this.addTypeFromArrayOfTypes(property.oneOf, modelingTypes, typeName, originalJsonSchema, schemaName), typeName, modelingTypes, true);
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
                        if (typeName === 'date' || typeName === 'datetime') {
                            this.addModelingType({ ...dateModelType, id: typeName }, typeName, modelingTypes);
                        } else {
                            this.addModelingType({
                                id: 'string',
                                properties: stringModelType.properties || [],
                                methods: stringModelType.methods || []
                            }, 'string', modelingTypes);
                            typeName = 'string';
                        }
                    } else {
                        typeName = 'string';
                    }
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
        items: JSONSchemaPropertyBasics[] | JSONSchemaInfoBasics,
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
