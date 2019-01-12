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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ApplicationTreeIconsComponent } from './application-tree-icons.component';
import { By } from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ApplicationTreeHelper } from '../application-tree.helper';
import { MatIconModule } from '@angular/material';
import { PROCESS, CONNECTOR, MODEL_TYPE, ModelFilter, OpenFilterAction, OPEN_FILTER } from 'ama-sdk';
import { SetMenuAction, SET_MENU } from '../../../../store/actions';
import { AmaState } from 'ama-sdk';

class ApplicationTreeHelperMock {
    public calledWithType: MODEL_TYPE;
    public loadMock = jest.fn();

    getFilters(): ModelFilter[] {
        return [
            <ModelFilter>{ type: PROCESS, name: '', icon: 'device_hub' },
            <ModelFilter>{ type: CONNECTOR, name: '', icon: 'subject' }
        ];
    }

    getDataAdapter(filterType: MODEL_TYPE) {
        this.calledWithType = filterType;
        return {
            load: this.loadMock
        };
    }
}

describe('ApplicationTreeIconsComponent', () => {
    let fixture: ComponentFixture<ApplicationTreeIconsComponent>,
        component: ApplicationTreeIconsComponent,
        store: Store<AmaState>,
        applicationTreeHelper: ApplicationTreeHelperMock;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [StoreModule.forRoot({}), TranslateModule.forRoot(), NoopAnimationsModule, MatIconModule],
            declarations: [ApplicationTreeIconsComponent],
            providers: [{ provide: ApplicationTreeHelper, useClass: ApplicationTreeHelperMock }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ApplicationTreeIconsComponent);
        component = fixture.componentInstance;
        store = TestBed.get(Store);
        applicationTreeHelper = TestBed.get(ApplicationTreeHelper);

        fixture.detectChanges();
    });

    it('should display the filter icons provided by the applicationTreeHelper', () => {
        const icons = fixture.debugElement.queryAll(By.css('[data-automation-class="application-tree-icon"]'));

        expect(icons.length).toBe(2);
    });

    it('should dispatch the right actions on the icon click', () => {
        spyOn(store, 'dispatch');

        const processIcon = fixture.debugElement.query(By.css('[data-automation-class="application-tree-icon"]'));
        processIcon.triggerEventHandler('click', {});

        const setMenuAction: SetMenuAction = store.dispatch.calls.argsFor(0)[0];
        expect(setMenuAction.type).toBe(SET_MENU);
        expect(setMenuAction.payload).toBe(true);

        const openFilterAction: OpenFilterAction = store.dispatch.calls.argsFor(1)[0];
        expect(openFilterAction.type).toBe(OPEN_FILTER);
        expect(openFilterAction.filterType).toBe(PROCESS);
    });

    it('should the getDataAdapter and load methods with the proper parameters', () => {
        const icons = fixture.debugElement.queryAll(By.css('[data-automation-class="application-tree-icon"]')),
            connectorIcon = icons[1];

        component.applicationId = 'app-id';

        connectorIcon.triggerEventHandler('click', {});

        expect(applicationTreeHelper.calledWithType).toBe(CONNECTOR);
        expect(applicationTreeHelper.loadMock).toHaveBeenCalledWith('app-id');
    });
});
