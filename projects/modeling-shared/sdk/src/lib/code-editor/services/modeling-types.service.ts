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

import { Inject, Injectable } from '@angular/core';
import { JSONSchemaInfoBasics } from '../../api/types';
import { JSONSchemaToEntityPropertyService } from '../../services/json-schema-to-entity-property.service';
import { ModelingJSONSchemaService } from '../../services/modeling-json-schema.service';
import { UuidService } from '../../services/uuid.service';
import { primitiveTypesSchema } from './expression-language/primitive-types-schema';
import {
    ModelingType,
    ModelingTypeMap as ModelingTypesMap,
    ModelingTypeMethodDescription,
    ModelingTypePropertyDescription,
    ModelingTypeProvider,
    ModelingTypeSignatureHelper,
    ModelingTypeSuggestion,
    MODELING_TYPES_PROVIDERS,
    ProviderModelingTypeMap
} from './modeling-type-provider.service';
const memoize = require('lodash/memoize');

function getMethodSuggestion(method: ModelingTypeMethodDescription): ModelingTypeSuggestion {
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

function getPropertySuggestion(property: ModelingTypePropertyDescription): ModelingTypeSuggestion {
    return {
        label: property.property,
        filterText: property.property,
        kind: 9,
        insertText: property.property,
        documentation: property.documentation,
        detail: property.type
    };
}

function getMethodLabel(method: ModelingTypeMethodDescription): string {
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

const createMemoizedModelingTypes = memoize(
    (modelingTypesByProvider: ProviderModelingTypeMap, status: string) => {
        const modelingTypes = {};
        Object.keys(modelingTypesByProvider).forEach(provider => {
            const types = modelingTypesByProvider[provider];
            Object.keys(types).forEach(type => modelingTypes[type] = types[type]);
        });
        return modelingTypes;
    },
    (modelingTypesByProvider: ProviderModelingTypeMap, status: string) => status
);

const createMemoizedMethodSuggestions = memoize(
    (type: ModelingType, status: string) => {
        const suggestions = [];
        if (type && type.methods) {
            type.methods.filter(method => !!method).forEach(method => suggestions.push(getMethodSuggestion(method)));
        }
        return suggestions;
    },
    (type: ModelingType, status: string) => type.id + '_' + status
);

const createMemoizedFunctionsSuggestions = memoize(
    (functions: ModelingTypeMethodDescription[]) => {
        const suggestions = [];
        if (functions) {
            functions.filter(primitiveFunction => !!primitiveFunction).forEach(primitiveFunction => suggestions.push(getMethodSuggestion(primitiveFunction)));
        }
        return suggestions;
    },
    (functions: ModelingTypeMethodDescription[]) => 'functions'
);

const createMemoizedPropertySuggestions = memoize(
    (type: ModelingType, status: string) => {
        const suggestions = [];
        if (type && type.properties) {
            type.properties.filter(property => !!property).forEach(property => suggestions.push(getPropertySuggestion(property)));
        }
        return suggestions;
    },
    (type: ModelingType, status: string) => type.id + '_' + status
);

const createMemoizedSignatureHelpers = memoize(
    (type: ModelingType, status: string) => {
        const signatures = [];
        if (type && type.methods) {
            type.methods.filter(method => !!method).forEach(method => signatures.push({
                label: getMethodLabel(method),
                documentation: method.documentation,
                parameters: method.parameters,
                method: method
            }));
        }
        return signatures;
    },
    (type: ModelingType, status: string) => type.id + '_' + status
);

@Injectable({
    providedIn: 'root'
})
export class ModelingTypesService {

    private modelingTypesByProvider: ProviderModelingTypeMap = {};
    private status: string;

    constructor(
        @Inject(MODELING_TYPES_PROVIDERS) private providers: ModelingTypeProvider[],
        private uuidService: UuidService,
        private modelingJSONSchemaService: ModelingJSONSchemaService,
        private jSONSchemaToEntityPropertyService: JSONSchemaToEntityPropertyService) {
        this.providers.forEach(provider => {
            provider.modelingTypesUpdated$.subscribe(typesMap => {
                this.updateProviderAndStatus(provider, typesMap);
            });
        });
    }

    private updateProviderAndStatus(provider: ModelingTypeProvider, typesMap: ModelingTypesMap) {
        this.status = this.uuidService.generate();
        this.modelingTypesByProvider[provider.getProviderName()] = typesMap;
    }

    getModelingTypesByProvider(): ProviderModelingTypeMap {
        return this.modelingTypesByProvider;
    }

    getModelingTypes(): ModelingTypesMap {
        return createMemoizedModelingTypes(this.modelingTypesByProvider, this.status);
    }

    getType(typeName: string): ModelingType {
        return this.getModelingTypes()[typeName];
    }

    getMethodsByModelSchema(modelSchema: JSONSchemaInfoBasics): ModelingTypeMethodDescription[] {
        const typeName = this.modelingJSONSchemaService.getPrimitiveType(modelSchema);
        let methods: ModelingTypeMethodDescription[] = [];
        if (Array.isArray(typeName)) {
            typeName.forEach(type => {
                this.getModelingTypes()[type].methods.forEach(method => {
                    if (methods.findIndex(element => this.methodsEquality(element, method)) === -1) {
                        methods.push(method);
                    }
                });
            });
        } else {
            methods = [...(this.getModelingTypes()[typeName].methods || [])] ;
        }
        return methods;
    }

    private methodsEquality(method1: ModelingTypeMethodDescription, method2: ModelingTypeMethodDescription): boolean {
        return method1.signature === method2.signature && method1.parameters?.length === method2.parameters?.length;
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
        } else if (Array.isArray(flattenedModelSchema.type)) {
            flattenedModelSchema.type.forEach(model => {
                if (typeof model !== 'string') {
                    this.getPropertiesByModelSchema(model).forEach(property => properties.push(property));
                }
            });
        } else {
            const typeName = this.modelingJSONSchemaService.getPrimitiveType(modelSchema);
            if (Array.isArray(typeName)) {
                typeName.forEach(type => this.getType(type).properties?.forEach(property => properties.push(property)));
            } else {
                this.getType(typeName).properties?.forEach(property => properties.push(property));
            }
        }

        return properties;
    }

    getMethodsSuggestionsByType(typeName: string): ModelingTypeSuggestion[] {
        const registeredType = this.getType(typeName);
        return createMemoizedMethodSuggestions(registeredType, this.status);
    }

    getMethodsSuggestionsByModelSchema(modelSchema: JSONSchemaInfoBasics): ModelingTypeSuggestion[] {
        return this.getMethodsByModelSchema(modelSchema).map(method => getMethodSuggestion(method));
    }

    getPropertiesSuggestionsByType(typeName: string): ModelingTypeSuggestion[] {
        const registeredType = this.getType(typeName);
        return createMemoizedPropertySuggestions(registeredType, this.status);
    }

    getPropertiesSuggestionsByModelSchema(modelSchema: JSONSchemaInfoBasics): ModelingTypeSuggestion[] {
        return this.getPropertiesByModelSchema(modelSchema).map(property => getPropertySuggestion(property));
    }

    getSignatureHelperByType(typeName: string): ModelingTypeSignatureHelper[] {
        const registeredType = this.getType(typeName);
        return createMemoizedSignatureHelpers(registeredType, this.status);
    }

    getSignatureHelperByModelSchema(modelSchema: JSONSchemaInfoBasics): ModelingTypeSignatureHelper[] {
        const methods = this.getMethodsByModelSchema(modelSchema);

        const signatures = [];

        methods.filter(method => !!method).forEach(method => signatures.push({
            label: getMethodLabel(method),
            documentation: method.documentation,
            parameters: method.parameters,
            method: method
        }));

        return signatures;
    }

    getFunctionsSuggestions(functions: ModelingTypeMethodDescription[]): ModelingTypeSuggestion[] {
        return createMemoizedFunctionsSuggestions(functions);
    }

    getModelSchemaFromEntityProperty(property: { type: string, model?: JSONSchemaInfoBasics }): JSONSchemaInfoBasics {
        if (property) {
            const modelSchema = property.model || primitiveTypesSchema.$defs.primitive[property.type] || {};
            return this.modelingJSONSchemaService.flatSchemaReference(modelSchema);
        } else {
            return {};
        }
    }
}
