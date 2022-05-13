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

import { Store } from '@ngrx/store';
import { ProcessesFilterDataAdapter } from './processes-filter.data-adapter';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { cold } from 'jasmine-marbles';
import { PROCESS, AmaState } from '@alfresco-dbp/modeling-shared/sdk';
import { selectProcessesLoading } from '../store/process-editor.selectors';

describe('ProcessesFilterDataAdapter ', () => {
    let store: Store<AmaState>;
    let processFilterDataAdapter: ProcessesFilterDataAdapter;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [],
            providers: [
                ProcessesFilterDataAdapter,
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation((selector) => {
                            if (selector === selectProcessesLoading) {
                                return of(true);
                            }

                            return of({});
                        }),
                        dispatch: jest.fn()
                    }
                }
            ]
        });
    });

    beforeEach(() => {
        store = TestBed.inject(Store);
        processFilterDataAdapter = TestBed.inject(ProcessesFilterDataAdapter);
    });

    it('should test expanded getter', () => {
        const expanded = processFilterDataAdapter.expandedPredicate([PROCESS]);
        expect(expanded).toBe(true);
    });

    it('should test loading getter', () => {
        const expected = cold('(x|)', { x: true });
        expect(processFilterDataAdapter.loading).toBeObservable(expected);
    });

    it('should test contents getter', () => {
        const expected = cold('(x|)', { x: {} });
        expect(processFilterDataAdapter.contents).toBeObservable(expected);
    });

    it('should test load function', () => {
        spyOn(store, 'dispatch');
        processFilterDataAdapter.load('id');

        expect(store.dispatch).toHaveBeenCalled();
    });
});
