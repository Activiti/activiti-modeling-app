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

import { TranslationMock, TranslationService } from '@alfresco/adf-core';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';
import { first } from 'rxjs/operators';
import { ExpressionSyntax } from '../../../api/types';
import { SnackbarErrorAction } from '../../../store/app.actions';
import { AmaState, MESSAGE } from '../../../store/app.state';
import { LogAction } from '../../../store/logging.actions';
import { ExpressionSimulatorService } from './expression-simulator.service';
import { ExpressionSyntaxProvider, EXPRESSION_SYNTAX_HANDLER } from './expression-syntax.provider';

describe('ExpressionSimulatorService', () => {
    let service: ExpressionSimulatorService;
    const provider: ExpressionSyntaxProvider = {
        type: 'mock' as ExpressionSyntax,
        initExpressionEditor: () => {},
        resolveExpression: () => of('')
    };
    let store: Store<AmaState>;

    const expression = '${a.concat(b).concat(c)}';
    const variables = {
        a: '1',
        b: '23',
        c: '456'
    };

    const mockError = '{ "timestamp": "2022-05-18T13:46:28.782+0000", "status": 400, "error": "Bad Request", "message": "This is an error", "path": "/v1/juel" }';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: EXPRESSION_SYNTAX_HANDLER,
                    useValue: [provider]
                },
                provideMockStore({}),
                { provide: TranslationService, useClass: TranslationMock }
            ]
        });
        service = TestBed.inject(ExpressionSimulatorService);
        store = TestBed.inject(Store);
    });

    it('should call the provider to get the expression', async () => {
        spyOn(provider, 'resolveExpression').and.returnValue(of('123456'));

        const result = await service.getSimulationResult(expression, variables, 'mock' as ExpressionSyntax).pipe(first()).toPromise();

        expect(result).toEqual('123456');

        expect(provider.resolveExpression).toHaveBeenCalledWith(expression, variables);
    });

    it('should call the none expression syntax provider when no expression syntax is provided', async() => {
        const result = await service.getSimulationResult(expression, variables).pipe(first()).toPromise();

        expect(result).toEqual(expression);
    });

    it('should handle error when simulation errors', async () => {
        spyOn(provider, 'resolveExpression').and.returnValue(throwError(new Error(mockError)));
        spyOn(store, 'dispatch');
        let logAction: LogAction;

        try {
            await service.getSimulationResult(expression, variables, 'mock' as ExpressionSyntax).pipe(first()).toPromise();
        } catch (error) {
            expect(JSON.parse(error.message).message).toBe('This is an error');
            logAction = new LogAction({
                type: MESSAGE.ERROR,
                datetime: jasmine.any(Date) as undefined as Date,
                initiator: {
                    key: 'Expression simulator',
                    displayName: 'SDK.EXPRESSION_CODE_EDITOR.JUEL_EXPRESSION_SIMULATOR'
                },
                messages: [JSON.stringify(JSON.parse(error.message), null, 4)]
            });
        }

        expect(store.dispatch).toHaveBeenCalledWith(logAction);
        expect(store.dispatch).toHaveBeenCalledWith(new SnackbarErrorAction('This is an error'));
    });
});
