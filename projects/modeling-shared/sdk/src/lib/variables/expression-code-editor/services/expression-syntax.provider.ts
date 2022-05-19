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

import { InjectionToken, Provider, Type } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EntityProperty, ExpressionSyntax } from '../../../api/types';

export const EXPRESSION_SYNTAX_HANDLER = new InjectionToken<ExpressionSyntaxProvider[]>('expression-syntax-handlers');

export interface ExpressionSyntaxProvider {
    type: ExpressionSyntax;

    initExpressionEditor(
        language: string,
        parameters: EntityProperty[],
        hostLanguage: string,
        highlightAllText
    );

    resolveExpression(expression: string, variables: { [key: string]: any }): Observable<any>;
}

export class NoneExpressionSyntax implements ExpressionSyntaxProvider {
    type = ExpressionSyntax.NONE;

    initExpressionEditor() {
        return;
    }

    resolveExpression(expression: string): Observable<any> {
        return of(expression);
    }

}

export function provideExpressionSyntaxHandler(implementationClass: Type<ExpressionSyntaxProvider>): Provider {
    return {
        provide: EXPRESSION_SYNTAX_HANDLER,
        useExisting: implementationClass,
        multi: true
    };
}

export function getExpressionSyntaxProviderByType(expressionSyntaxHandlers: ExpressionSyntaxProvider[], type: ExpressionSyntax) {
    if (type) {
        for (const handler of expressionSyntaxHandlers) {
            if (handler.type === type) {
                return handler;
            }
        }
    }
    return new NoneExpressionSyntax();
}
