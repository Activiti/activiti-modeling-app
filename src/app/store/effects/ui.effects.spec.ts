/*!
 * @license
 * Alfresco Example Modeling Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Modeling Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Modeling Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Modeling Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { hot, getTestScheduler } from 'jasmine-marbles';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { StorageService } from '@alfresco/adf-core';
import { provideMockActions } from '@ngrx/effects/testing';
import { UiEffects } from './ui.effects';
import { SetMenuAction } from '../actions/ui';
import { AmaTitleService } from '../../common/services/title.service';

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
