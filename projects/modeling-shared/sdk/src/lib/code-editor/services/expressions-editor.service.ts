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

@Injectable({
    providedIn: 'root'
})
export class ExpressionsEditorService {
    themeNames = ['dark-theme', 'vs-dark', 'vs-light'];
    suggestions: monaco.languages.CompletionItem[] = [];
    expression: monaco.languages.IShortMonarchLanguageAction = 'expression';
    rules: monaco.languages.IMonarchLanguageRule[] = [[/[\$]\{([^\}]*)\}/, this.expression]];
    themeRules: monaco.editor.ITokenThemeRule[] = [{ token: 'expression', foreground: '008800' }];
    themes = [];
    languagesDef = {
        tokenizer: {
            root: this.rules
        }
    };

    initExpressionEditor(language: string, parameters: any[]) {
        this.suggestions = [];
        parameters.forEach(parameter => {
            this.suggestions.push({
                label: parameter.name,
                kind: monaco.languages.CompletionItemKind.Text,
                insertText: '${' + parameter.name + '}',
                documentation: 'type: ' + parameter.type
            });
        });

        let baseTheme: monaco.editor.BuiltinTheme;
        this.themeNames.forEach(themeName => {
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
            this.themes.push({
                base: baseTheme,
                inherit: true,
                rules: this.themeRules,
                colors: undefined
            });
        });

        this.updateEditorLanguageSettings(language, this.languagesDef, this.themeNames, this.themes, this.suggestions);
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
                provideCompletionItems: (model, position) => {
                    return { suggestions };
                }
            });
        }
    }

    removeEditorLanguageSettings(language: string) {
        const languages = monaco.languages.getLanguages();
        if (languages.findIndex(lang => lang.id === language) >= 0) {
            monaco.languages.registerCompletionItemProvider(language, {
                provideCompletionItems: (model, position) => {
                    return { suggestions: [] };
                }
            });
        }
    }
}
