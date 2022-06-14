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
import { TabManagerService } from './tab-manager.service';

describe('TabManagerService', () => {
    let service: TabManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: TranslationService, useClass: TranslationMock }
            ]
        });

        service = TestBed.inject(TabManagerService);
    });

    it('should not update title when tab is not found in tabs registry', (done) => {
        service.tabs = [];
        service.updateTabTitle('new-name', 'id-1');
        service.tabs$.subscribe((tabs) => {
            expect(tabs).toEqual([]);
            done();
        });
    });

    it('should update title when tab is found in tabs registry', (done) => {
        service.tabs = [{
            tabId: 1,
            title: 'tab-1',
            icon: '',
            active: true,
            tabData: {
                modelId: 'model-1',
                modelType: 'connector'
            }
        }];
        service.updateTabTitle('new-name', 'model-1');
        service.tabs$.subscribe((tabs) => {
            const foundTab = tabs.find(tab => tab.tabData.modelId === 'model-1');
            expect(foundTab.title).toBe('new-name');
            done();
        });
    });
});
