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
import { TranslateService } from '@ngx-translate/core';
import { expressionLanguageConfiguration, expressionLanguageMonarch } from './expression-language/expression-language.monarch';
import { PrimitiveModelingTypesService } from './primitive-modeling-types.service';

@Injectable({
    providedIn: 'root'
})
export class ExpressionsEditorService {

    static wordRegex = /((\w+((\.?\w+){0,1}(\[\S+\]){0,1}(\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)){0,1})*)|\W)/g;
    static wordRegexSignature = /\w+((\.?\w+){0,1}(\[\S+\]){0,1}(\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)){0,1})*/g;

    private typeTranslation: string;

    constructor(private translateService: TranslateService, private primitiveModelingTypesService: PrimitiveModelingTypesService) {
        this.typeTranslation = this.translateService.instant('SDK.VARIABLES_EDITOR.TABLE.COLUMN_TYPE');
    }

    static getTypeName(
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        parameters: any[],
        primitiveModelingTypesService: PrimitiveModelingTypesService,
        offset = 0
    ): string {
        const lineBeforeCursor = model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 0,
            endLineNumber: position.lineNumber,
            endColumn: position.column
        });
        const words = lineBeforeCursor.match(ExpressionsEditorService.wordRegex);
        let typeName: string = null;

        if (words) {
            const activeTyping = words[words.length - 1 - offset];
            typeName = ExpressionsEditorService.getTypeNameOfWord(activeTyping, parameters, primitiveModelingTypesService, offset);
        }
        return typeName;
    }

    static getTypeNameOfWord(word: string, parameters: any[], primitiveModelingTypesService: PrimitiveModelingTypesService, offset = 0): string {
        const parts = word?.split('.') || [];
        let typeName: string = null;

        for (let index = 0; index < (parts.length - 1 + offset); index++) {
            const element = parts[index];
            if (element.trim().length > 0) {
                const array = element.match(/([a-z][\w]*)\[(\S)*\]/);
                const method = element.match(/([a-z][\w]*)\((\S|\s)*\)/);
                const arrayAfterMethod = element.match(/([a-z][\w]*)\((\S|\s)*\)\[(\S)*\]/);
                if (array) {
                    if (!typeName) {
                        typeName = parameters.find(parameter => parameter.name === array[1])?.type;
                        typeName = primitiveModelingTypesService.getType(typeName)?.collectionOf || 'json';
                    } else {
                        typeName = primitiveModelingTypesService.getType(typeName)?.collectionOf || 'json';
                    }
                } else if (typeName && arrayAfterMethod) {
                    typeName = primitiveModelingTypesService.getType(typeName).methods?.filter(registeredMethod => !!registeredMethod)
                        .find(registeredMethod => registeredMethod.signature.startsWith(arrayAfterMethod[1]))?.type;
                    typeName = primitiveModelingTypesService.getType(typeName)?.collectionOf || 'json';
                } else if (typeName && method) {
                    typeName = primitiveModelingTypesService.getType(typeName).methods?.filter(registeredMethod => !!registeredMethod)
                        .find(registeredMethod => registeredMethod.signature.startsWith(method[1]))?.type;
                } else {
                    if (!typeName) {
                        typeName = parameters.find(parameter => parameter.name === element)?.type;
                    } else {
                        typeName = primitiveModelingTypesService.getType(typeName).properties?.filter(property => !!property)
                            .find(property => property.property === element)?.type;
                    }
                }
            }
            if (!typeName) {
                break;
            }
        }
        return typeName;
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

        return (activeTyping.match(/\,(?=([^"\\]*(\\.|"([^"\\]*\\.)*[^"\\]*"))*[^"]*$)/g) || []).length;
    }

    static getHoverCard(typeName: string, word: string, range: any, typeTranslation: string, primitiveModelingTypesService: PrimitiveModelingTypesService): any {
        let hoverCard;
        if (typeName) {
            const methodHover = primitiveModelingTypesService.getType(typeName).methods?.
                filter(method => !!method).find(method => method.signature === word);
            const propertyHover = primitiveModelingTypesService.getType(typeName).properties?.
                filter(property => !!property).find(property => property.property === word);
            if (methodHover) {
                hoverCard = {
                    range,
                    contents: [{ value: `*${methodHover.signature}*` }]
                };

                if (methodHover.documentation) {
                    hoverCard.contents.push({ value: methodHover.documentation });
                }
                hoverCard.contents.push({ value: typeTranslation + ': ' + methodHover.type });
            } else if (propertyHover) {
                hoverCard = {
                    range,
                    contents: [{ value: `*${propertyHover.property}*` }]
                };
                if (propertyHover.documentation) {
                    hoverCard.contents.push({ value: propertyHover.documentation });
                }
                hoverCard.contents.push({ value: typeTranslation + ': ' + propertyHover.type });
            }
        }
        return hoverCard;
    }

    /**
    * Initializes the monaco editor language for an instance of an expression editor identified by the language
    * @arg language - the identifier of the language. Each expression editor must have a different language as it includes the autocompletion for the available variables there
    * @arg parameters - the variables that can be used inside the expressions
    * @arg hostLanguage - the language of the editor. For example if host language is 'text/html' the editor will colourize everything as html,
    * except the ${...} content that will be colourized as an expression (and will have the autocompletion). **By default this is null**
    * @arg highlightAllText - If there is no **hostLanguage**, then we can tell the language to colorize only the text inside ${...} (*by default*)
    * or all the text (by setting this to ***true***)
    */
    initExpressionEditor(language: string, parameters: any[], hostLanguage: string = null, highlightAllText = false) {
        const languages = monaco.languages.getLanguages();
        if (languages.findIndex(lang => lang.id === language) < 0) {
            monaco.languages.register({ id: language });
            monaco.languages.setMonarchTokensProvider(language, this.getMonarchLanguageDefinition(parameters, hostLanguage, highlightAllText));
            monaco.languages.setLanguageConfiguration(language, expressionLanguageConfiguration as monaco.languages.LanguageConfiguration);
            this.registerCompletionProviderForKeywords(language);
            this.registerCompletionProviderForMethodsAndProperties(language, this.primitiveModelingTypesService, parameters);
            this.registerSignatureProviderForMethods(language, this.primitiveModelingTypesService, parameters);
            this.registerHoverProviderForMethodsAndProperties(language, this.primitiveModelingTypesService, parameters, this.typeTranslation);
        }

        if (parameters) {
            this.registerCompletionProviderForVariables(language, parameters);
            this.registerHoverProviderForVariables(language, parameters, this.typeTranslation);
        }
    }

    colorizeElement(element: HTMLElement, options?: monaco.editor.IColorizerElementOptions) {
        monaco.editor.colorizeElement(element, options || {});
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
                if (word.startColumn === 1 || model.getLineContent(position.lineNumber).substr(position.column - 2, 1) === '.') {
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

    private registerCompletionProviderForVariables(language: string, parameters: any[]) {
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
                            documentation: parameter.markup || parameter.description,
                            range: range,
                        });
                    });
                }
                return { suggestions };
            }
        });
    }

    private registerCompletionProviderForMethodsAndProperties(language: string, primitiveModelingTypesService: PrimitiveModelingTypesService, parameters: any[]) {
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
                const typeName: string = ExpressionsEditorService.getTypeName(model, position, parameters, primitiveModelingTypesService, offset);
                if (typeName) {
                    suggestions = suggestions.concat(primitiveModelingTypesService.getMethodsSuggestionsByType(typeName));
                    suggestions = suggestions.concat(primitiveModelingTypesService.getPropertiesSuggestionsByType(typeName));
                }

                suggestions.map(suggestion => suggestion.range = range);
                return { suggestions };
            }
        });
    }

    private registerSignatureProviderForMethods(language: string, primitiveModelingTypesService: PrimitiveModelingTypesService, parameters: any[]) {
        monaco.languages.registerSignatureHelpProvider(language, {
            signatureHelpTriggerCharacters: ['(', ','],
            signatureHelpRetriggerCharacters: [],
            provideSignatureHelp: (model, position, token) => {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };

                let signatures = [];
                const activeParameter = ExpressionsEditorService.getActiveParameter(model, position);
                let activeSignature = 0;

                const lineBeforeCursor = model.getValueInRange({
                    startLineNumber: position.lineNumber,
                    startColumn: 0,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column
                });
                const words = lineBeforeCursor.match(ExpressionsEditorService.wordRegexSignature);
                if (words) {
                    const offset = word.word.length > 0 ? activeParameter + 1 : activeParameter;
                    const activeTyping = words[words.length - 1 - offset];

                    const typeName: string = ExpressionsEditorService.getTypeNameOfWord(activeTyping, parameters, primitiveModelingTypesService);
                    if (typeName) {
                        const parts = activeTyping.split('.');
                        const activeMethodSignature = parts[parts.length - 1];
                        signatures = primitiveModelingTypesService.getSignatureHelperByType(typeName)
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

    private registerHoverProviderForVariables(language: string, parameters: any[], typeTranslation: string) {
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

                        if (variable.markdown) {
                            hoverCard.contents.push({ value: variable.markdown });
                        } else {
                            if (variable.description) {
                                hoverCard.contents.push({ value: variable.description });
                            }
                            hoverCard.contents.push({ value: typeTranslation + ': ' + variable.type });
                        }
                    }
                }
                return hoverCard;
            }
        });
    }

    private registerHoverProviderForMethodsAndProperties(
        language: string,
        primitiveModelingTypesService: PrimitiveModelingTypesService,
        parameters: any[],
        typeTranslation: string
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
                    const typeName: string = ExpressionsEditorService.getTypeName(model, position, parameters, primitiveModelingTypesService);
                    hoverCard = ExpressionsEditorService.getHoverCard(typeName, word.word, range, typeTranslation, primitiveModelingTypesService);
                }
                return hoverCard;
            }
        });
    }

    private getMonarchLanguageDefinition(parameters: any, hostLanguage: string, highlightAllText: boolean): monaco.languages.IMonarchLanguage {
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
}
