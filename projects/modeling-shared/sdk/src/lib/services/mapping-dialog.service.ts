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

import { ServiceParameterMapping, ConnectorParameter, MappingType, EntityProperty } from '../api/types';
import { Subject, Observable } from 'rxjs';

export interface MappingDialogData {
    inputMapping?: ServiceParameterMapping;
    inputParameters?: ConnectorParameter[];
    outputMapping?: ServiceParameterMapping;
    outputParameters?: ConnectorParameter[];
    processProperties: EntityProperty[];
    mappingType: VariableMappingType;
    selectedRow?: number;
    selectedProcessVariable?: string;
    selectedOutputParameter?: string;
    theme$: Observable<string>;
    inputMappingUpdate$?: Subject<ServiceParameterMapping>;
    outputMappingUpdate$?: Subject<ServiceParameterMapping>;
}

export enum VariableMappingType {
    input = 'input',
    output = 'output'
}

export interface MappingRowModel {
    name: string;
    description?: string;
    value: any;
    required?: boolean;
    type?: string;
    mappingValueType: MappingValueType;
}

export enum MappingValueType {
    variable = 'variable',
    value = 'value',
    expression = 'expression'
}

export abstract class MappingDialogService {
    abstract getDataSourceValue(dataSource: MappingRowModel[], i: number): any;
    abstract getDataSourceName(dataSource: MappingRowModel[], i: number): any;
    abstract setDataSourceValue(dataSource: MappingRowModel[], i: number, value: any);
    abstract dataSourceInit(mapping: ServiceParameterMapping, parameters: ConnectorParameter[], properties: EntityProperty[]): MappingRowModel[];
    abstract createMappingFromDataSource(dataSource: MappingRowModel[]): ServiceParameterMapping;

    getFilteredProcessVariables(dataSource: MappingRowModel[], processProperties: EntityProperty[], i: number): EntityProperty[] {
        let filteredProcessVariables = processProperties.filter(() => true);
        const element = dataSource[i];
        if (element.type) {
            filteredProcessVariables = processProperties.filter(variable => variable.type === element.type);
        }
        dataSource.forEach(mapping => {
            if (mapping.value && mapping.value !== element.value) {
                const index = filteredProcessVariables.findIndex(variable => variable.name === mapping.value);
                if (index >= 0) {
                    filteredProcessVariables.splice(index, 1);
                }
            }
        });

        return filteredProcessVariables;
    }

    initMappingValue(dataSource: MappingRowModel[], i: number): { variableValue: string, valueValue: any, expressionValue: string } {
        let expressionValue = '';
        let variableValue = undefined;
        let valueValue = undefined;

        switch (dataSource[i].mappingValueType) {
            case MappingValueType.variable:
                variableValue = this.getDataSourceValue(dataSource, i);
                break;
            case MappingValueType.value:
                valueValue = this.getDataSourceValue(dataSource, i);
                break;
            case MappingValueType.expression:
                if (typeof this.getDataSourceValue(dataSource, i) === 'string') {
                    expressionValue = this.getDataSourceValue(dataSource, i);
                } else {
                    expressionValue = JSON.stringify(this.getDataSourceValue(dataSource, i), null, 4);
                }
                break;
        }

        return { variableValue, valueValue, expressionValue };
    }

    getMappingValueTypeFromMappingType(type: MappingType, value: any): MappingValueType {
        switch (type) {
            case MappingType.variable:
                return MappingValueType.variable;
            case MappingType.static:
                return MappingValueType.value;
            case MappingType.value:
            default:
                if (JSON.stringify(value).includes('${')) {
                    return MappingValueType.expression;
                } else {
                    return MappingValueType.value;
                }
        }
    }

    initExpressionEditor(language: string, parameters: any[]) {
        const suggestions: monaco.languages.CompletionItem[] = [];
        parameters.forEach(parameter => {
            suggestions.push({
                label: parameter.name,
                kind: monaco.languages.CompletionItemKind.Text,
                insertText: '${' + parameter.name + '}',
                documentation: 'type: ' + parameter.type
            });
        });

        const expression: monaco.languages.IShortMonarchLanguageAction = 'expression';
        const rules: monaco.languages.IMonarchLanguageRule[] = [[/[\$]\{([^\}]*)\}/, expression]];
        const languagesDef = {
            tokenizer: {
                root: rules
            }
        };

        const themeNames = ['dark-theme', 'vs-dark', 'vs-light'];
        const themeRules: monaco.editor.ITokenThemeRule[] = [{ token: 'expression', foreground: '008800' }];
        let baseTheme: monaco.editor.BuiltinTheme;
        const themes = [];
        themeNames.forEach(themeName => {
            switch (themeName) {
                case 'dark-theme':
                    baseTheme = 'hc-black';
                    break;
                case 'vs-dark':
                    baseTheme = 'vs-dark';
                    break;
                default:
                    baseTheme = 'vs';
                    break;
            }
            themes.push({
                base: baseTheme,
                inherit: true,
                rules: themeRules,
                colors: undefined
            });
        });

        this.updateEditorLanguageSettings(language, languagesDef, themeNames, themes, suggestions);
    }

    updateEditorLanguageSettings(
        language: string,
        languagesDef?: monaco.languages.IMonarchLanguage,
        themeNames?: string[],
        themes?: monaco.editor.IStandaloneThemeData[],
        suggestions?: monaco.languages.CompletionItem[]) {

        const languages = monaco.languages.getLanguages();
        if (languages.findIndex(lang => lang.id === language) < 0) {
            monaco.languages.register({ id: language });
        }

        if (languagesDef) {
            monaco.languages.setMonarchTokensProvider(language, languagesDef);
        }

        if (themeNames && themes) {
            for (let i = 0; i < themeNames.length; i++) {
                monaco.editor.defineTheme(themeNames[i], themes[i]);
            }
        }

        if (suggestions) {
            monaco.languages.registerCompletionItemProvider(language, {
                provideCompletionItems: function (model, position) {
                    return { suggestions };
                }
            });
        }
    }

    removeEditorLanguageSettings(language: string) {
        const languages = monaco.languages.getLanguages();
        if (languages.findIndex(lang => lang.id === language) >= 0) {
            monaco.languages.registerCompletionItemProvider(language, {
                provideCompletionItems: function (model, position) {
                    return { suggestions: [] };
                }
            });
        }
    }
}
