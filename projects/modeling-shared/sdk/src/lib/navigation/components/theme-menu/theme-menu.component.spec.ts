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

import { CoreTestingModule } from '@alfresco/adf-core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ChangeThemeAction } from '../../../store/app.actions';
import { AmaState } from '../../../store/app.state';
import { ThemeMenuComponent } from './theme-menu.component';
import { appThemes } from './themes';

describe('ThemeMenuComponent', () => {

    let fixture: ComponentFixture<ThemeMenuComponent>;
    let component: ThemeMenuComponent;
    let store: Store<AmaState>;
    const appState = {
        selectedTheme: {
            className: 'light-theme'
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                CoreTestingModule
            ],
            providers: [{
                provide: Store,
                useValue: {
                    select: jest.fn().mockImplementation((selector) => {
                        if (selector === 'app') {
                            return of(appState);
                        }
                        return of({});
                    }),
                    dispatch: jest.fn()
                }
            }]
        });

        fixture = TestBed.createComponent(ThemeMenuComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(Store);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should dispatch ChangeThemeAction when selected', () => {
        spyOn(store, 'dispatch');
        fixture.detectChanges();
        component.changeTheme(appThemes[1].className);

        expect(store.dispatch).toHaveBeenCalledWith(new ChangeThemeAction({theme: appThemes[1].className}));
    });
});
