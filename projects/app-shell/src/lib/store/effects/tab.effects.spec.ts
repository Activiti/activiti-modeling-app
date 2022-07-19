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
import { Observable, of } from 'rxjs';
import { hot, getTestScheduler } from 'jasmine-marbles';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { provideMockActions } from '@ngrx/effects/testing';
import { TabManagerEntityService, TabManagerService, UpdateTabDirtyState, UpdateTabTitle } from '@alfresco-dbp/modeling-shared/sdk';
import { TabEffects } from './tab.effects';

describe('TabEffects', () => {
    let effects: TabEffects;
    let metadata: EffectsMetadata<TabEffects>;
    let actions$: Observable<any>;
    let tabManagerService: TabManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TabEffects,
                TabManagerService,
                provideMockActions(() => actions$),
                {
                    provide: TranslationService,
                    useClass: TranslationMock
                },
                {
                    provide: TabManagerEntityService, useValue: {
                        entities$: of([])
                    }
                }
            ]
        });

        effects = TestBed.inject(TabEffects);
        metadata = getEffectsMetadata(effects);
        tabManagerService = TestBed.inject(TabManagerService);
    });

    describe('updateTabTitle', () => {
        it('updateTabTitle effect should NOT dispatch an action', () => {
            expect(metadata.updateTabTitle.dispatch).toBeFalsy();
        });
    });

    it('updateTabTitle should update the tab title', () => {
        const tabManagerSpy = spyOn(tabManagerService, 'updateTabTitle');

        const updateTabTitleAction = new UpdateTabTitle('newName', 'modelId-1');
        actions$ = hot('a', { a: updateTabTitleAction });

        effects.updateTabTitle.subscribe(() => {
        });
        getTestScheduler().flush();

        expect(tabManagerSpy).toHaveBeenCalledWith('newName', 'modelId-1');
    });

    it('updateTabDirtyState should update the tab dirty state', () => {
        const tabManagerSpy = spyOn(tabManagerService, 'updateTabDirtyState');

        const updateTabDirtyStateAction = new UpdateTabDirtyState(true, 'modelId-1');
        actions$ = hot('a', { a: updateTabDirtyStateAction });

        effects.updateTabDirtyState.subscribe(() => {
        });
        getTestScheduler().flush();

        expect(tabManagerSpy).toHaveBeenCalledWith(true, 'modelId-1');
    });
});
