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
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ExpressionSyntax } from '../../../api/types';
import { LogFactoryService } from '../../../services/log-factory.service';
import { SnackbarErrorAction } from '../../../store/app.actions';
import { AmaState } from '../../../store/app.state';
import { ExpressionSyntaxProvider, EXPRESSION_SYNTAX_HANDLER, getExpressionSyntaxProviderByType } from './expression-syntax.provider';

@Injectable({
    providedIn: 'root'
})
export class ExpressionSimulatorService {

    constructor(@Optional() @Inject(EXPRESSION_SYNTAX_HANDLER) private expressionSyntaxHandlers: ExpressionSyntaxProvider[],
                private store: Store<AmaState>,
                private logFactory: LogFactoryService) { }

    private logInitiator = {
        key: 'Expression simulator',
        displayName: 'SDK.EXPRESSION_CODE_EDITOR.JUEL_EXPRESSION_SIMULATOR'
    };

    /**
    * Gets Simulated result for the requested payload
    * @param expression The expression to be evaluated
    * @param variables A key value map containing the variable values for the simulation
    * @return return `Observable of the evaluated expression`
    */
    getSimulationResult(expression: string, variables: { [key: string]: any }, expressionSyntax?: ExpressionSyntax): Observable<any> {
        const handler = getExpressionSyntaxProviderByType(this.expressionSyntaxHandlers, expressionSyntax);

        return handler.resolveExpression(expression, variables).pipe(
            catchError((error: Error) => {
                const errorMessage = JSON.parse(error.message);
                if (Array.isArray(errorMessage)) {
                    this.logError(errorMessage.flatMap((e) => e.severity ? (e.message + ' ' + e.severity) : e.message || JSON.stringify(e)).join('\n '), errorMessage);
                } else {
                    this.logError(errorMessage.message || JSON.stringify(errorMessage), errorMessage);
                }
                return throwError(error);
            })
        );
    }

    private logError(errorMessage: string, error: any) {
        this.store.dispatch(this.logFactory.logError(this.logInitiator, JSON.stringify(error, null, 4)));
        this.store.dispatch(new SnackbarErrorAction(errorMessage));
    }
}
