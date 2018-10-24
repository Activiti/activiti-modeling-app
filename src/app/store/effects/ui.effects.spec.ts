 /*!
 * @license
 * Copyright 2018 Alfresco, Inc. and/or its affiliates.
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
import { Observable } from 'rxjs';
import { hot, getTestScheduler } from 'jasmine-marbles';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { StorageService } from '@alfresco/adf-core';
import { provideMockActions } from '@ngrx/effects/testing';
import { UiEffects } from './ui.effects';
import { SetMenuAction } from '../actions/ui';
import { AmaTitleService } from 'ama-sdk';

describe('UiEffects', () => {
    let effects: UiEffects;
    let metadata: EffectsMetadata<UiEffects>;
    let actions$: Observable<any>;
    let storageService: StorageService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                UiEffects,
                StorageService,
                AmaTitleService,
                provideMockActions(() => actions$)
            ]
        });

        effects = TestBed.get(UiEffects);
        metadata = getEffectsMetadata(effects);

        storageService = TestBed.get(StorageService);
    });

    describe('setMenu', () => {
        it('setMenu effect should NOT dispatch an action', () => {
            expect(metadata.setMenu).toEqual({ dispatch: false });
        });
    });

    it('setMenu should modify the localstorage', () => {
        storageService.setItem('menuOpened', 'true');
        const setMenuAction = new SetMenuAction(false);
        actions$ = hot('a', { a: setMenuAction });

        effects.setMenu.subscribe(() => {});
        getTestScheduler().flush();

        expect(storageService.getItem('menuOpened')).toBe('false');
    });
});
