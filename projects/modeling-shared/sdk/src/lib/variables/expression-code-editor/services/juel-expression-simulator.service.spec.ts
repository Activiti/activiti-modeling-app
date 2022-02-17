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
import { AlfrescoApiService, AppConfigService, TranslationMock, TranslationService } from '@alfresco/adf-core';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { first } from 'rxjs/operators';
import { SnackbarErrorAction } from '../../../store/app.actions';
import { AmaState, MESSAGE } from '../../../store/app.state';
import { LogAction } from '../../../store/logging.actions';
import { JuelExpressionSimulatorService } from './juel-expression-simulator.service';

describe('JuelExpressionSimulatorService', () => {
    let service: JuelExpressionSimulatorService;
    let api: AlfrescoApiService;
    let store: Store<AmaState>;

    const expression = '${a.concat(b).concat(c)}';
    const variables = {
        a: '1',
        b: '23',
        c: '456'
    };
    const oauth2Auth = { oauth2Auth: { callCustomApi: jest.fn() } };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: AlfrescoApiService,
                    useValue: {
                        getInstance: () => oauth2Auth
                    }
                },
                {
                    provide: AppConfigService,
                    useValue: {
                        get: () => 'https://alfresco.com'
                    }
                },
                provideMockStore({}),
                { provide: TranslationService, useClass: TranslationMock }
            ]
        });
        service = TestBed.inject(JuelExpressionSimulatorService);
        api = TestBed.inject(AlfrescoApiService);
        store = TestBed.inject(Store);
    });

    it('should return result when simulation is success', async () => {
        jest.spyOn(api.getInstance().oauth2Auth, 'callCustomApi').mockReturnValue(Promise.resolve({ result: '123456' }));
        const url = 'https://alfresco.com/modeling-service/v1/juel';

        const result = await service.getSimulationResult(expression, variables).pipe(first()).toPromise();

        expect(result).toEqual('123456');

        expect(api.getInstance().oauth2Auth.callCustomApi).toHaveBeenCalledWith(
            url,
            'POST',
            null,
            null,
            null,
            null,
            { expression, variables },
            ['application/json'],
            ['application/json']
        );
    });

    it('should handle error when simulation errors', async () => {
        jest.spyOn(api.getInstance().oauth2Auth, 'callCustomApi').mockReturnValue(Promise.reject(Error('{"error":"This is an error"}')));
        spyOn(store, 'dispatch');
        let logAction: LogAction;

        try {
            await service.getSimulationResult(expression, variables).pipe(first()).toPromise();
        } catch (error) {
            expect(JSON.parse(error.message).error).toBe('This is an error');
            logAction = new LogAction({
                type: MESSAGE.ERROR,
                datetime: jasmine.any(Date) as undefined as Date,
                initiator: {
                    key: 'JUEL expression simulator',
                    displayName: 'SDK.EXPRESSION_CODE_EDITOR.JUEL_EXPRESSION_SIMULATOR'
                },
                messages: [JSON.stringify(JSON.parse(error.message), null, 4)]
            });
        }

        expect(store.dispatch).toHaveBeenCalledWith(logAction);
        expect(store.dispatch).toHaveBeenCalledWith(new SnackbarErrorAction('This is an error'));
    });
});
