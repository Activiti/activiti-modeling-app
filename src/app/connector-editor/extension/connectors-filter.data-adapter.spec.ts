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

import { TestBed, async } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ConnectorsFilterDataAdapter } from './connectors-filter.data-adapter';
import { CONNECTOR, selectProjectConnectorsArray, CONNECTOR_SELECTORS_TOKEN, AmaState } from '@alfresco-dbp/modeling-shared/sdk';
import { cold } from 'jasmine-marbles';
import { selectConnectorsLoading, selectSelectedConnectorId } from '../store/connector-editor.selectors';

describe('ConnectorsFilterDataAdapter ', () => {
    let store: Store<AmaState>;
    let connectorsFilterDataAdapter: ConnectorsFilterDataAdapter;

    const mockConnector = {
        type: CONNECTOR,
        id: 'mock-id',
        name: 'mock-name',
        description: 'mock-description',
        projectId: 'mock-app-id'
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MatDialogModule, NoopAnimationsModule],
            declarations: [],
            providers: [
                ConnectorsFilterDataAdapter,
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation((selector) => {
                            if (selector === selectConnectorsLoading) {
                                return of(true);
                            } else if (selector === selectProjectConnectorsArray) {
                                return of([mockConnector, {...mockConnector, template: 'slackConnector'}, {...mockConnector, template: null}]);
                            } else if (selector === selectSelectedConnectorId) {
                                return of(mockConnector.id);
                            }

                            return of({});
                        }),
                        dispatch: jest.fn()
                    }
                },
                { provide: CONNECTOR_SELECTORS_TOKEN, useValue: selectProjectConnectorsArray }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        store = TestBed.get(Store);
        connectorsFilterDataAdapter = TestBed.get(ConnectorsFilterDataAdapter);
    });

    it('should test expanded getter', () => {
        const expanded = connectorsFilterDataAdapter.expandedPredicate([CONNECTOR]);
        expect(expanded).toBe(true);
    });

    it('should test loading getter', () => {
        const expected = cold('(x|)', { x: true });
        expect(connectorsFilterDataAdapter.loading).toBeObservable(expected);
    });

    it('should test contents getter', () => {
        const expected = cold('(x|)', { x: [mockConnector, {...mockConnector, template: 'slackConnector'}, {...mockConnector, template: null}] });
        expect(connectorsFilterDataAdapter.contents).toBeObservable(expected);
    });

    it('should test load function', () => {
        spyOn(store, 'dispatch');
        connectorsFilterDataAdapter.load('id');

        expect(store.dispatch).toHaveBeenCalled();
    });
});
