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

/* cspell: disable */

export const expressionLanguageConfiguration = {
    wordPattern: /(-?\d*\.\d\w*)|([^`~!@#%^&*()\-=+[{\]}\\|;:'",.<>/?\s]+)/g,

    comments: {
        lineComment: '//',
        blockComment: ['/*', '*/']
    },

    brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')']
    ],

    onEnterRules: [
        {
            beforeText: /^\s*\/\*\*(?!\/)([^*]|\*(?!\/))*$/,
            afterText: /^\s*\*\/$/,
            action: { indentAction: 2, appendText: ' * ' }
        },
        {
            beforeText: /^\s*\/\*\*(?!\/)([^*]|\*(?!\/))*$/,
            action: { indentAction: 0, appendText: ' * ' }
        },
        {
            beforeText: /^(\t|( {2}))* \*( ([^*]|\*(?!\/))*)?$/,
            action: { indentAction: 0, appendText: '* ' }
        },
        {
            beforeText: /^(\t|( {2}))* \*\/\s*$/,
            action: { indentAction: 0, removeText: 1 }
        }
    ],

    autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"', notIn: ['string'] },
        { open: '\'', close: '\'', notIn: ['string', 'comment'] },
        { open: '`', close: '`', notIn: ['string', 'comment'] },
        { open: '/**', close: '*/', notIn: ['string'] }
    ],

    folding: {
        markers: {
            start: new RegExp('^\\s*//\\s*#?region\\b'),
            end: new RegExp('^\\s*//\\s*#?endregion\\b')
        }
    }
};

export const expressionLanguageMonarch = {
    defaultToken: '',

    keywords: [
        'and', 'or', 'not', 'eq', 'ne', 'lt', 'gt', 'le', 'ge', 'true', 'false', 'null', 'instanceof', 'empty', 'div', 'mod'
    ],

    variables: [],

    operators: [
        '+', '-', '*', '/', 'div', '%', 'mod',
        'and', '&&', 'or', '||', 'not', '!',
        '==', 'eq', '!=', 'ne', '<', 'lt', '>', 'gt', '<=', 'le', '>=', 'ge',
        'empty', '?', ':'
    ],

    functions: [
        {
            signature: 'now',
            model: {
                $ref: '#/$defs/primitive/date'
            },
            type: 'date',
            documentation: 'Return the current system date.'
        },
        {
            signature: 'list',
            type: 'array',
            documentation: 'Returns a list containing an arbitrary number of elements.',
            parameters: [
                {
                    label: 'elements',
                    documentation: 'obj: the elements to be contained in the list comma-separated'
                }
            ]
        }
    ],

    symbols: /[=><!~?:&|+\-*/^%]+/,
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    digits: /\d+(_+\d+)*/,
    octaldigits: /[0-7]+(_+[0-7]+)*/,
    binarydigits: /[0-1]+(_+[0-1]+)*/,
    hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,

    tokenizer: {
        root: [

        ],

        hostLanguage: [
            [/"(\s)*\$\{/, { token: '@rematch', next: '@expLanguageInDoubleQuoteString', nextEmbedded: '@pop', bracket: '@open' }],
            [/'(\s)*\$\{/, { token: '@rematch', next: '@expLanguageInSingleQuoteString', nextEmbedded: '@pop', bracket: '@open' }],
            [/\$\{/, { token: 'expLang', next: '@expLanguageCounting', nextEmbedded: '@pop', bracket: '@open' }]
        ],

        expLanguageInDoubleQuoteString: [
            [/"(\s)*\$\{/, { token: '@rematch', next: '@expQuotedStart' }],
            [/"/, { token: 'string.expLanguageInDoubleQuoteString', next: '@pop' }],
        ],

        expLanguageInSingleQuoteString: [
            [/'(\s)*\$\{/, { token: '@rematch', next: '@expQuotedStart' }],
            [/'/, { token: 'string.expLanguageInSingleQuoteString', next: '@pop' }],
        ],

        expQuotedStart: [
            [/\$\{/, { token: 'expLang', switchTo: '@expLanguageCounting' }],
            [/"/, { token: 'string.expLanguageInDoubleQuoteString' }],
            [/'/, { token: 'string.expLanguageInSingleQuoteString' }],
        ],

        expLanguageStart: [
            [/\$\{/, { token: 'expLang', next: '@expLanguageCounting', bracket: '@open' }]
        ],

        expLanguageCounting: [
            [/\{/, { token: 'expLang', next: '@expLanguageCounting', bracket: '@open' }],
            [/}/, { token: 'expLang', next: '@pop', bracket: '@close' }],
            { include: 'common' }
        ],

        common: [
            [/[a-z_$][\w$]*/, {
                cases: {
                    '@keywords': 'keyword',
                    '@variables': 'variable',
                    '@default': 'identifier'
                }
            }],

            [/[A-Z][\w$]*/, 'type.identifier'],

            { include: '@whitespace' },

            [/[()[\]]/, '@brackets'],
            [/[<>](?!@symbols)/, '@brackets'],
            [/@symbols/, {
                cases: {
                    '@operators': 'delimiter',
                    '@default': ''
                }
            }],

            [/(@digits)[eE]([-+]?(@digits))?/, 'number.float'],
            [/(@digits)\.(@digits)([eE][-+]?(@digits))?/, 'number.float'],
            [/0[xX](@hexdigits)/, 'number.hex'],
            [/0[oO]?(@octaldigits)/, 'number.octal'],
            [/0[bB](@binarydigits)/, 'number.binary'],
            [/(@digits)/, 'number'],

            [/[;,.]/, 'delimiter'],

            [/"([^"\\]|\\.)*$/, 'string.invalid'],
            [/'([^'\\]|\\.)*$/, 'string.invalid'],
            [/"/, 'string', '@string_double'],
            [/'/, 'string', '@string_single'],
        ],

        whitespace: [
            [/[ \t\r\n]+/, ''],
            [/\/\*/, 'comment', '@comment'],
            [/\/\/.*$/, 'comment'],
        ],

        comment: [
            [/[^/*]+/, 'comment'],
            [/\*\//, 'comment', '@pop'],
            [/[/*]/, 'comment']
        ],

        string_double: [
            [/[^\\"]+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/"/, 'string', '@pop']
        ],

        string_single: [
            [/[^\\']+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/'/, 'string', '@pop']
        ],

        bracketCounting: [
            [/\{/, 'delimiter.bracket', '@bracketCounting'],
            [/\}/, 'delimiter.bracket', '@pop'],
            { include: 'common' }
        ],
    },
};
