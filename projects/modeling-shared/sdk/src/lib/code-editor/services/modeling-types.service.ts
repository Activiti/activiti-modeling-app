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
import { UuidService } from '../../services/uuid.service';
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

    constructor(@Inject(MODELING_TYPES_PROVIDERS) private providers: ModelingTypeProvider[], private uuidService: UuidService) {
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

    getMethodsSuggestionsByType(typeName: string): ModelingTypeSuggestion[] {
        const registeredType = this.getType(typeName);
        return createMemoizedMethodSuggestions(registeredType, this.status);
    }

    getPropertiesSuggestionsByType(typeName: string): ModelingTypeSuggestion[] {
        const registeredType = this.getType(typeName);
        return createMemoizedPropertySuggestions(registeredType, this.status);
    }

    getSignatureHelperByType(typeName: string): ModelingTypeSignatureHelper[] {
        const registeredType = this.getType(typeName);
        return createMemoizedSignatureHelpers(registeredType, this.status);
    }

    getFunctionsSuggestions(functions: ModelingTypeMethodDescription[]): ModelingTypeSuggestion[] {
        return createMemoizedFunctionsSuggestions(functions);
    }
}
