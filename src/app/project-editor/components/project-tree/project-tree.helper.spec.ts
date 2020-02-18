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
import { ProjectTreeHelper } from './project-tree.helper';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { PROCESS, MODEL_FILTERS } from '@alfresco-dbp/modeling-shared/sdk';

describe('ProjectTreeHelper ', () => {
    let service: ProjectTreeHelper;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [],
            providers: [
                ProjectTreeHelper,
                {
                    provide: MODEL_FILTERS, useValue: {
                        type: PROCESS,
                        name: 'name',
                        icon: 'icon',
                        adapter: {
                            expandedPredicate: () => {},
                            contents: { subscribe: () => {} },
                            loading: { subscribe: () => {} },
                            load: () => {}
                        },
                        order: 0
                    }, multi: true
                },
                {
                    provide: Store, useValue: {select: jest.fn().mockReturnValue(of({}))}
                }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        service = TestBed.get(ProjectTreeHelper);
    });

    it ('getDataAdapter should return a filterData adapter',  () => {
        const dataAdapter = service.getDataAdapter(PROCESS);

        expect(dataAdapter).toBeDefined();
        expect(dataAdapter.expandedPredicate).toBeDefined();
        expect(dataAdapter.contents.subscribe).toBeDefined();
        expect(dataAdapter.loading.subscribe).toBeDefined();
        expect(dataAdapter.load).toBeDefined();
    });
});
