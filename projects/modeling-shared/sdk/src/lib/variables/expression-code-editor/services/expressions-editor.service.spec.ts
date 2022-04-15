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

import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ExpressionSyntax } from '../../../api/types';
import { ExpressionSyntaxProvider, EXPRESSION_SYNTAX_HANDLER } from './expression-syntax.provider';
import { ExpressionsEditorService } from './expressions-editor.service';

describe('ExpressionsEditorService', () => {
    let service: ExpressionsEditorService;
    const provider: ExpressionSyntaxProvider = {
        type: 'mock' as ExpressionSyntax,
        initExpressionEditor: () => { },
        resolveExpression: () => of('')
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: EXPRESSION_SYNTAX_HANDLER,
                    useValue: [provider]
                }
            ]
        });
        service = TestBed.inject(ExpressionsEditorService);
    });

    it('should call the provider when initialization', () => {
        spyOn(provider, 'initExpressionEditor');

        const language = 'mock-language';
        const parameters = [];
        const expressionSyntax = 'mock' as ExpressionSyntax;

        service.initExpressionEditor(language, parameters, expressionSyntax, null, false);

        expect(provider.initExpressionEditor).toHaveBeenCalledWith(language, parameters, null, false);
    });
});
