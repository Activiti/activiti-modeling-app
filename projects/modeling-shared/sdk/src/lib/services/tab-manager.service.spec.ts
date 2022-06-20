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
import { of } from 'rxjs';
import { TabManagerEntityService } from '../components/tab-manager/tab-manager-entity.service';
import { TabManagerService } from './tab-manager.service';


describe('TabManagerService', () => {
    let service: TabManagerService;
    let entityService: TabManagerEntityService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                {
                    provide: TabManagerEntityService, useValue: {
                        updateOneInCache: jasmine.createSpy(),
                        entities$: of([])
                    }
                }
            ]
        });

        service = TestBed.inject(TabManagerService);
        entityService = TestBed.inject(TabManagerEntityService);
    });

    it('should not update title when tab is not found in tabs registry', (done) => {
        service.updateTabTitle('new-name', 'id-1');
        entityService.entities$.subscribe((tabs) => {
            expect(tabs).toEqual([]);
            done();
        });
    });

    it('should update title when tab is found in tabs registry', () => {
        service.updateTabTitle('new-name', 'model-1');

        expect(entityService.updateOneInCache).toHaveBeenCalledWith({id : 'model-1', title: 'new-name'});
    });

});
