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

import { Inject, Injectable, Optional } from '@angular/core';
import { EntityProperty, ExpressionSyntax } from '../../../api/types';
import { EXPRESSION_SYNTAX_HANDLER, ExpressionSyntaxProvider, getExpressionSyntaxProviderByType } from './expression-syntax.provider';

@Injectable({
    providedIn: 'root'
})
export class ExpressionsEditorService {

    constructor(@Optional() @Inject(EXPRESSION_SYNTAX_HANDLER) private expressionSyntaxHandlers: ExpressionSyntaxProvider[]) {
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
        expressionSyntax: ExpressionSyntax,
        hostLanguage: string,
        highlightAllText
    ) {
        const handler = getExpressionSyntaxProviderByType(this.expressionSyntaxHandlers, expressionSyntax);

        handler.initExpressionEditor(language, parameters, hostLanguage, highlightAllText);
    }

    colorizeElement(element: HTMLElement, options?: monaco.editor.IColorizerElementOptions) {
        void monaco.editor.colorizeElement(element, options || {});
    }
}
