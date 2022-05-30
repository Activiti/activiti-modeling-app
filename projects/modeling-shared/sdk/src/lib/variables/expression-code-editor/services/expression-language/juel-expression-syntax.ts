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

import { AlfrescoApiService, AppConfigService, TranslationService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { from, Observable, } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntityProperty, ExpressionSyntax, JSONSchemaInfoBasics } from '../../../../api/types';
import { ExpressionSyntaxProvider } from '../expression-syntax.provider';
import { ModelingTypeMethodDescription } from '../modeling-type.model';
import { ModelingTypesService } from '../modeling-types.service';
import { expressionLanguageMonarch, expressionLanguageConfiguration } from './expression-language.monarch';

@Injectable({
    providedIn: 'root'
})
export class JuelExpressionSyntax implements ExpressionSyntaxProvider {

    static wordRegex = /(\w+(\((.)*\))?(\[(.)*\])?\.?)+/g;

    type = ExpressionSyntax.JUEL;

    constructor(
        private translationService: TranslationService,
        private modelingTypesService: ModelingTypesService,
        private alfrescoApiService: AlfrescoApiService,
        private appConfigService: AppConfigService,
    ) {
    }

    static getModelSchema(
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        parameters: EntityProperty[],
        modelingTypesService: ModelingTypesService,
        offset = 0
    ): JSONSchemaInfoBasics {
        const lineBeforeCursor = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 0,
            endLineNumber: position.lineNumber,
            endColumn: position.column
        });
        const words = lineBeforeCursor.match(JuelExpressionSyntax.wordRegex);
        let modelSchema: JSONSchemaInfoBasics = null;

        if (words) {
            let activeTyping = words[words.length - 1];
            activeTyping = activeTyping.endsWith('.') ? activeTyping.substring(0, activeTyping.length - 1) : activeTyping;
            modelSchema = JuelExpressionSyntax.getModelSchemaOfWord(activeTyping, parameters, modelingTypesService, offset);
        }
        return modelSchema;
    }

    static getModelSchemaOfWord(word: string, parameters: EntityProperty[], modelingTypesService: ModelingTypesService, offset = 0): JSONSchemaInfoBasics {
        const parts = word?.split('.') || [];
        let modelSchema: JSONSchemaInfoBasics = null;

        for (let index = 0; index < (parts.length - 1 + offset); index++) {
            const element = parts[index];
            if (element.trim().length > 0) {
                const array = element.match(/([a-z][\w]*)\[(\S)*\]/);
                const method = element.match(/([a-z][\w]*)\((\S|\s)*\)/);
                const arrayAfterMethod = element.match(/([a-z][\w]*)\((\S|\s)*\)\[(\S)*\]/);
                if (array) {
                    modelSchema = JuelExpressionSyntax.getModelSchemaFromArrayAccess(modelSchema, modelingTypesService, parameters, array);
                } else if (modelSchema && arrayAfterMethod) {
                    modelSchema = JuelExpressionSyntax.getModelSchemaFromArrayAfterMethod(modelSchema, modelingTypesService, arrayAfterMethod);
                } else if (method) {
                    modelSchema = JuelExpressionSyntax.getModelSchemaFromMethodCall(modelSchema, modelingTypesService, method);
                } else {
                    modelSchema = JuelExpressionSyntax.getModelSchemaFromLiteral(modelSchema, modelingTypesService, parameters, element);
                }
            }
            if (!modelSchema) {
                break;
            }
        }
        return modelSchema;
    }

    private static getModelSchemaFromLiteral(modelSchema: JSONSchemaInfoBasics, modelingTypesService: ModelingTypesService, parameters: EntityProperty[], element: string) {
        if (!modelSchema) {
            modelSchema = modelingTypesService.getModelSchemaFromEntityProperty(parameters.find(parameter => parameter.name === element))
                || JuelExpressionSyntax.getModelSchemaFromLanguageFunctions(element, modelingTypesService);
        } else {
            modelSchema = modelingTypesService.getModelSchemaFromEntityProperty(
                modelingTypesService.getPropertiesByModelSchema(modelSchema)
                    .filter(property => !!property)
                    .find(property => property.property === element)
            );
        }
        return modelSchema;
    }

    private static getModelSchemaFromMethodCall(modelSchema: JSONSchemaInfoBasics, modelingTypesService: ModelingTypesService, method: RegExpMatchArray) {
        let methodDescription: ModelingTypeMethodDescription;
        if (modelSchema) {
            methodDescription = modelingTypesService.getMethodsByModelSchema(modelSchema)
                .filter(registeredMethod => !!registeredMethod)
                .find(registeredMethod => registeredMethod.signature.startsWith(method[1]));
        } else {
            methodDescription = expressionLanguageMonarch.functions.filter(registeredMethod => !!registeredMethod)
                .find(registeredMethod => registeredMethod.signature.startsWith(method[1]));
        }

        if (methodDescription?.isArrayAccessor && methodDescription?.type === 'json') {
            modelSchema = JuelExpressionSyntax.extractItemsModelSchema(modelSchema);
        } else if (methodDescription?.isSameTypeAsObject && methodDescription?.type === 'json') {
        } else {
            modelSchema = modelingTypesService.getModelSchemaFromEntityProperty(methodDescription);
        }
        return modelSchema;
    }

    private static getModelSchemaFromArrayAfterMethod(modelSchema: JSONSchemaInfoBasics, modelingTypesService: ModelingTypesService, arrayAfterMethod: RegExpMatchArray) {
        modelSchema = modelingTypesService.getModelSchemaFromEntityProperty(
            modelingTypesService.getMethodsByModelSchema(modelSchema)
                .filter(registeredMethod => !!registeredMethod)
                .find(registeredMethod => registeredMethod.signature.startsWith(arrayAfterMethod[1]))
        );
        modelSchema = JuelExpressionSyntax.extractItemsModelSchema(modelSchema);
        return modelSchema;
    }

    private static getModelSchemaFromArrayAccess(
        modelSchema: JSONSchemaInfoBasics,
        modelingTypesService: ModelingTypesService,
        parameters: EntityProperty[],
        array: RegExpMatchArray
    ) {
        if (!modelSchema) {
            modelSchema = modelingTypesService.getModelSchemaFromEntityProperty(parameters.find(parameter => parameter.name === array[1]));
            modelSchema = JuelExpressionSyntax.extractItemsModelSchema(modelSchema);
        } else {
            modelSchema = JuelExpressionSyntax.extractItemsModelSchema(modelSchema);
        }
        return modelSchema;
    }

    static extractItemsModelSchema(modelSchema: JSONSchemaInfoBasics): JSONSchemaInfoBasics {
        let schema: JSONSchemaInfoBasics = modelSchema?.items;
        if (modelSchema?.allOf) {
            const arraySchemas = modelSchema.allOf.filter(model => model.type === 'array');
            if (arraySchemas.length === 1) {
                schema = arraySchemas[0].items;
            } else if (arraySchemas.length > 0) {
                schema = { allOf: arraySchemas.map(model => model.items) };
            }
        } else if (modelSchema?.anyOf) {
            const arraySchemas = modelSchema.anyOf.filter(model => model.type === 'array');
            if (arraySchemas.length === 1) {
                schema = arraySchemas[0].items;
            } else if (arraySchemas.length > 1) {
                schema = { anyOf: arraySchemas.map(model => model.items) };
            }
        } else if (modelSchema?.oneOf) {
            const arraySchemas = modelSchema.oneOf.filter(model => model.type === 'array');
            if (arraySchemas.length === 1) {
                schema = arraySchemas[0].items;
            } else if (arraySchemas.length > 1) {
                schema = { oneOf: arraySchemas.map(model => model.items) };
            }
        } else if (Array.isArray(modelSchema?.type)) {
            schema = { type: [] };
            modelSchema.type.forEach(model => {
                if (model === 'array') {
                    (schema.type as JSONSchemaInfoBasics[]).push(modelSchema.items);
                } else if (model.type === 'array') {
                    (schema.type as JSONSchemaInfoBasics[]).push(model.items);
                }
            });

            if (schema.type.length === 1) {
                schema = schema.type[0] as JSONSchemaInfoBasics;
            }
        }
        return schema || {};
    }

    static getModelSchemaFromLanguageFunctions(element: string, modelingTypesService: ModelingTypesService): JSONSchemaInfoBasics {
        const endIndex = element.indexOf('(');
        const functionSignature = element.substr(0, endIndex > 0 ? endIndex : element.length);
        return modelingTypesService.getModelSchemaFromEntityProperty(
            expressionLanguageMonarch.functions.find(primitiveFunction => primitiveFunction.signature === functionSignature)
        );
    }

    static getActiveParameter(model: monaco.editor.ITextModel, position: monaco.Position): number {
        const lineBeforeCursor = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 0,
            endLineNumber: position.lineNumber,
            endColumn: position.column
        });
        const words = lineBeforeCursor.replace('\t', '').split(' ');
        const activeTyping = words[words.length - 1];

        return (activeTyping.match(/,(?=([^"\\]*(\\.|"([^"\\]*\\.)*[^"\\]*"))*[^"]*$)/g) || []).length;
    }

    static getHoverCard(
        modelSchema: JSONSchemaInfoBasics,
        word: string, range: any,
        modelingTypesService: ModelingTypesService,
        translationService: TranslationService
    ): any {
        let hoverCard;
        if (modelSchema) {

            const methodHover = modelingTypesService.getMethodsByModelSchema(modelSchema).
                filter(method => !!method).find(method => method.signature === word);

            const propertyHover = modelingTypesService.getPropertiesByModelSchema(modelSchema).
                filter(property => !!property).find(property => property.property === word);

            if (methodHover) {
                hoverCard = {
                    range,
                    contents: [{ value: `*${methodHover.signature}*` }]
                };

                if (methodHover.documentation) {
                    hoverCard.contents.push({ value: translationService.instant(methodHover.documentation) });
                }
                hoverCard.contents.push({ value: translationService.instant('SDK.VARIABLES_EDITOR.TABLE.COLUMN_TYPE') + ': ' + methodHover.type });
            } else if (propertyHover) {
                hoverCard = {
                    range,
                    contents: [{ value: `*${propertyHover.property}*` }]
                };
                if (propertyHover.documentation) {
                    hoverCard.contents.push({ value: translationService.instant(propertyHover.documentation) });
                }
                hoverCard.contents.push({ value: translationService.instant('SDK.VARIABLES_EDITOR.TABLE.COLUMN_TYPE') + ': ' + propertyHover.type });
            }
        }
        return hoverCard;
    }

    private registerCompletionProviderForKeywords(language: string) {
        monaco.languages.registerCompletionItemProvider(language, {
            provideCompletionItems: (model, position) => {
                const word = model.getWordAtPosition(position) || model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };
                const suggestions = [];
                if (word.startColumn === 1 || model.getLineContent(position.lineNumber).substr(position.column - 2, 1) !== '.') {
                    expressionLanguageMonarch.keywords.forEach(keyword => {
                        suggestions.push({
                            label: keyword,
                            insertText: keyword,
                            kind: monaco.languages.CompletionItemKind.Keyword,
                            range: range,
                        });
                    });
                }
                return { suggestions };
            }
        });
    }

    private registerCompletionProviderForFunctions(language: string, modelingTypesService: ModelingTypesService) {
        monaco.languages.registerCompletionItemProvider(language, {
            provideCompletionItems: (model, position) => {
                const word = model.getWordAtPosition(position) || model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };
                let suggestions = [];
                if (word.startColumn === 1 || model.getLineContent(position.lineNumber).substr(position.column - 2, 1) !== '.') {
                    suggestions = suggestions.concat(modelingTypesService.getFunctionsSuggestions(expressionLanguageMonarch.functions));
                }
                suggestions.map(suggestion => suggestion.range = range);
                return { suggestions };
            }
        });
    }

    private registerCompletionProviderForVariables(language: string, parameters: EntityProperty[], translationService: TranslationService) {
        monaco.languages.registerCompletionItemProvider(language, {
            provideCompletionItems: (model, position) => {
                const word = model.getWordAtPosition(position) || model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };
                const suggestions = [];
                if (word.startColumn === 1 || model.getLineContent(position.lineNumber).substr(position.column - 2, 1) !== '.') {
                    parameters.forEach(parameter => {
                        suggestions.push({
                            label: parameter.name,
                            detail: parameter.type,
                            kind: monaco.languages.CompletionItemKind.Variable,
                            insertText: parameter.name,
                            documentation: parameter['markup'] || translationService.instant(parameter.description),
                            range: range,
                        });
                    });
                }
                return { suggestions };
            }
        });
    }

    private registerCompletionProviderForMethodsAndProperties(
        language: string,
        modelingTypesService: ModelingTypesService,
        parameters: EntityProperty[]
    ) {
        monaco.languages.registerCompletionItemProvider(language, {
            triggerCharacters: ['.'],
            provideCompletionItems: (model, position) => {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };

                let suggestions = [];
                const offset = word.word.length === 0 ? 1 : 0;
                const modelSchema: JSONSchemaInfoBasics = JuelExpressionSyntax.getModelSchema(model, position, parameters, modelingTypesService, offset);
                if (modelSchema) {
                    suggestions = suggestions.concat(modelingTypesService.getMethodsSuggestionsByModelSchema(modelSchema));
                    suggestions = suggestions.concat(modelingTypesService.getPropertiesSuggestionsByModelSchema(modelSchema));
                }

                suggestions.map(suggestion => suggestion.range = range);
                return { suggestions };
            }
        });
    }

    private registerSignatureProviderForMethods(language: string, modelingTypesService: ModelingTypesService, parameters: EntityProperty[]) {
        monaco.languages.registerSignatureHelpProvider(language, {
            signatureHelpTriggerCharacters: ['(', ','],
            signatureHelpRetriggerCharacters: [],
            provideSignatureHelp: (model, position) => {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };

                let signatures = [];
                const activeParameter = JuelExpressionSyntax.getActiveParameter(model, position);
                let activeSignature = 0;

                const lineBeforeCursor = model.getValueInRange({
                    startLineNumber: position.lineNumber,
                    startColumn: 0,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column
                });
                const words = lineBeforeCursor.match(JuelExpressionSyntax.wordRegex);
                if (words) {
                    const offset = word.word.length > 0 ? activeParameter + 1 : activeParameter;
                    const activeTyping = words[words.length - 1 - offset];

                    const modelSchema: JSONSchemaInfoBasics = JuelExpressionSyntax.getModelSchemaOfWord(activeTyping, parameters, modelingTypesService);
                    if (modelSchema) {
                        const parts = activeTyping.split('.');
                        const activeMethodSignature = parts[parts.length - 1];
                        signatures = modelingTypesService.getSignatureHelperByModelSchema(modelSchema)
                            .filter(signature => signature.method.signature.startsWith(activeMethodSignature));
                        activeSignature = signatures.findIndex(signature => signature.parameters?.length > activeParameter) || 0;
                    }
                }
                signatures.map(signature => signature.range = range);
                return {
                    activeParameter,
                    activeSignature,
                    signatures
                };

            }
        });
    }

    private registerHoverProviderForVariables(language: string, parameters: EntityProperty[], translationService: TranslationService) {
        monaco.languages.registerHoverProvider(language, {
            provideHover: function (model, position) {
                const word = model.getWordAtPosition(position);
                let hoverCard;
                if (word) {
                    const range = {
                        startLineNumber: position.lineNumber,
                        endLineNumber: position.lineNumber,
                        startColumn: word.startColumn,
                        endColumn: word.endColumn
                    };
                    const variableName = word.word;
                    const variable = parameters?.find(parameter => parameter.name === variableName);
                    if (variable) {
                        hoverCard = {
                            range,
                            contents: [{ value: `*${variable.name}*` }]
                        };

                        if (variable['markup']) {
                            hoverCard.contents.push({ value: variable['markup'] });
                        } else {
                            if (variable.description) {
                                hoverCard.contents.push({ value: translationService.instant(variable.description) });
                            }
                            hoverCard.contents.push({ value: translationService.instant('SDK.VARIABLES_EDITOR.TABLE.COLUMN_TYPE') + ': ' + variable.type });
                        }
                    }
                }
                return hoverCard;
            }
        });
    }

    private registerHoverProviderForFunctions(language: string, translationService: TranslationService) {
        monaco.languages.registerHoverProvider(language, {
            provideHover: function (model, position) {
                const word = model.getWordAtPosition(position);
                let hoverCard;
                if (word) {
                    const range = {
                        startLineNumber: position.lineNumber,
                        endLineNumber: position.lineNumber,
                        startColumn: word.startColumn,
                        endColumn: word.endColumn
                    };

                    const functionHover = expressionLanguageMonarch.functions.
                        filter(primitiveFunction => !!primitiveFunction).find(primitiveFunction => primitiveFunction.signature === word.word);

                    if (functionHover) {
                        hoverCard = {
                            range,
                            contents: [{ value: `*${functionHover.signature}*` }]
                        };

                        if (functionHover.documentation) {
                            hoverCard.contents.push({ value: translationService.instant(functionHover.documentation) });
                        }
                        hoverCard.contents.push({ value: translationService.instant('SDK.VARIABLES_EDITOR.TABLE.COLUMN_TYPE') + ': ' + functionHover.type });
                    }
                }
                return hoverCard;
            }
        });
    }

    private registerHoverProviderForMethodsAndProperties(
        language: string,
        modelingTypesService: ModelingTypesService,
        parameters: EntityProperty[],
        translationService: TranslationService
    ) {
        monaco.languages.registerHoverProvider(language, {
            provideHover: function (model, position) {
                const word = model.getWordAtPosition(position);
                let hoverCard;
                if (word) {
                    const range = {
                        startLineNumber: position.lineNumber,
                        endLineNumber: position.lineNumber,
                        startColumn: word.startColumn,
                        endColumn: word.endColumn
                    };
                    const modelSchema: JSONSchemaInfoBasics = JuelExpressionSyntax.getModelSchema(model, position, parameters, modelingTypesService);
                    hoverCard = JuelExpressionSyntax.getHoverCard(modelSchema, word.word, range, modelingTypesService, translationService);
                }
                return hoverCard;
            }
        });
    }

    private getMonarchLanguageDefinition(
        parameters: EntityProperty[],
        hostLanguage: string,
        highlightAllText: boolean
    ): monaco.languages.IMonarchLanguage {
        const languageDef = { ...expressionLanguageMonarch, variables: [], defaultToken: '' };
        parameters?.forEach(parameter => {
            languageDef.variables.push(parameter.name);
        });

        if (hostLanguage) {
            languageDef.defaultToken = 'string';
            languageDef.tokenizer.root = [[/[\s|\S]/, { token: '@rematch', next: '@hostLanguage', nextEmbedded: hostLanguage }]];
            languageDef.tokenizer.hostLanguage = [
                [/"(\s)*\$\{/, { token: '@rematch', next: '@expLanguageInDoubleQuoteString', nextEmbedded: '@pop', bracket: '@open' }],
                [/'(\s)*\$\{/, { token: '@rematch', next: '@expLanguageInSingleQuoteString', nextEmbedded: '@pop', bracket: '@open' }],
                [/\$\{/, { token: 'expLang', next: '@expLanguageCounting', nextEmbedded: '@pop', bracket: '@open' }],
                [/[\s|\S]/, { token: '', next: '@hostLanguage', nextEmbedded: hostLanguage, bracket: undefined }]
            ];
        } else {
            if (highlightAllText) {
                languageDef.tokenizer.root = [{ include: 'common' }];
            } else {
                languageDef.tokenizer.root = [{ include: 'expLanguageStart' }];
            }
        }
        return languageDef as monaco.languages.IMonarchLanguage;
    }

    /**
    * Initializes the monaco editor language for an instance of an expression editor identified by the language
    * @arg language - the identifier of the language. Each expression editor must have a different language as it includes the autocompletion for the available variables there
    * @arg parameters - the variables that can be used inside the expressions
    * * @arg expressionSyntax - the language syntax. Expression syntaxes supported are 'juel' (by default)
    * @arg hostLanguage - the language of the editor. For example if host language is 'text/html' the editor will colourize everything as html,
    * except the ${...} content that will be colourized as an expression (and will have the autocompletion). **By default this is null**
    * @arg highlightAllText - If there is no **hostLanguage**, then we can tell the language to colorize only the text inside ${...} (*by default*)
    * or all the text (by setting this to ***true***)
    */
    initExpressionEditor(
        language: string,
        parameters: EntityProperty[],
        hostLanguage: string = null,
        highlightAllText = false
    ) {
        const languages = monaco?.languages?.getLanguages() || [];
        if (languages.findIndex(lang => lang.id === language) < 0) {
            monaco.languages.register({ id: language });
            monaco.languages.setMonarchTokensProvider(language, this.getMonarchLanguageDefinition(parameters, hostLanguage, highlightAllText));
            monaco.languages.setLanguageConfiguration(language, expressionLanguageConfiguration as monaco.languages.LanguageConfiguration);
            this.registerCompletionProviderForKeywords(language);
            this.registerCompletionProviderForMethodsAndProperties(language, this.modelingTypesService, parameters);
            this.registerHoverProviderForMethodsAndProperties(language, this.modelingTypesService, parameters, this.translationService);
            this.registerCompletionProviderForFunctions(language, this.modelingTypesService);
            this.registerSignatureProviderForMethods(language, this.modelingTypesService, parameters);
            this.registerHoverProviderForFunctions(language, this.translationService);

        }

        if (parameters) {
            this.registerCompletionProviderForVariables(language, parameters, this.translationService);
            this.registerHoverProviderForVariables(language, parameters, this.translationService);
        }
    }

    resolveExpression(expression: string, variables: { [key: string]: any }): Observable<any> {
        const url = `${this.getHostName()}/modeling-service/v1/juel`;
        const api = this.alfrescoApiService.getInstance().oauth2Auth;

        const apiCall = api.callCustomApi(url, 'POST', null, null, null, null, { expression, variables }, ['application/json'], ['application/json']);

        return from(apiCall).pipe(
            map((response: { result: any }) => response.result)
        );
    }

    private getHostName(): string {
        return this.appConfigService.get('bpmHost', '').match(/^(?:https?:)?(?:\/\/)?([^/?]+)/g)[0];
    }

}
