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
import { arrayModelType } from './expression-language/array.model.type';
import { contentMetadataModelType } from './expression-language/content-metadata.model.type';
import { contentModelType } from './expression-language/content.model.type';
import { dateModelType } from './expression-language/date.model.type';
import { fileModelType } from './expression-language/file.model.type';
import { folderModelType } from './expression-language/folder.model.type';
import { jsonModelType } from './expression-language/json.model.type';
import { stringModelType } from './expression-language/string.model.type';
const memoize = require('lodash/memoize');

export interface ModelingType {
    id: string;
    hidden?: boolean;
    collectionOf?: string;
    methods?: ModelingTypeMethodDescription[];
    properties?: ModelingTypePropertyDescription[];
}
export interface ModelingTypeMethodDescription {
    signature: string;
    type: string;
    documentation?: string;
    parameters?: ModelingMethodParameter[];
}

export interface ModelingMethodParameter {
    label: string;
    documentation?: string;
}

export interface ModelingTypePropertyDescription {
    property: string;
    type: string;
    documentation?: string;
}

export interface ModelingTypeSuggestion {
    label: string;
    filterText: string;
    kind: number;
    insertText: string;
    documentation: string;
    detail: string;
    insertTextRules?: number;
    command?: any;
}

export interface ModelingTypeSignatureHelper {
    label: string;
    documentation: string;
    parameters: ModelingMethodParameter[];
    method: ModelingTypeMethodDescription;
}

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

const createMemoizedMethodSuggestions = memoize(
    (type: ModelingType) => {
        const suggestions = [];
        if (type && type.methods) {
            type.methods.filter(method => !!method).forEach(method => suggestions.push(getMethodSuggestion(method)));
        }
        return suggestions;
    },
    (type: ModelingType) => type.id
);

const createMemoizedPropertySuggestions = memoize(
    (type: ModelingType) => {
        const suggestions = [];
        if (type && type.properties) {
            type.properties.filter(property => !!property).forEach(property => suggestions.push(getPropertySuggestion(property)));
        }
        return suggestions;
    },
    (type: ModelingType) => type.id
);

const createMemoizedSignatureHelpers = memoize(
    (type: ModelingType) => {
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
    (type: ModelingType) => type.id
);

const createMemoizedPrimitiveTypes = memoize(
    (): { [id: string]: ModelingType } => {
        const types: { [id: string]: ModelingType } = {};

        types.boolean = {
            id: 'boolean'
        };
        types.integer = {
            id: 'integer'
        };
        types.string = stringModelType;
        types.json = jsonModelType;
        types.date = dateModelType;
        types.datetime = { ...dateModelType, id: 'datetime' };
        types.array = arrayModelType;
        types.file = fileModelType;
        types.folder = folderModelType;

        types.content = contentModelType;
        types['content-metadata'] = contentMetadataModelType;

        types['array-string'] = {
            id: 'array-string',
            methods: arrayModelType.methods,
            properties: arrayModelType.properties,
            collectionOf: 'string',
            hidden: true
        };

        return types;
    },
    () => 'primitive'
);

@Injectable({
    providedIn: 'root'
})
export class PrimitiveModelingTypesService {
    getPrimitiveModelingTypes(): { [id: string]: ModelingType } {
        return createMemoizedPrimitiveTypes();
    }

    getType(typeName: string): ModelingType {
        return this.getPrimitiveModelingTypes()[typeName];
    }

    getMethodsSuggestionsByType(typeName: string): ModelingTypeSuggestion[] {
        const registeredType = this.getType(typeName);
        return createMemoizedMethodSuggestions(registeredType);
    }

    getPropertiesSuggestionsByType(typeName: string): ModelingTypeSuggestion[] {
        const registeredType = this.getType(typeName);
        return createMemoizedPropertySuggestions(registeredType);
    }

    getSignatureHelperByType(typeName: string): ModelingTypeSignatureHelper[] {
        const registeredType = this.getType(typeName);
        return createMemoizedSignatureHelpers(registeredType);
    }

}
