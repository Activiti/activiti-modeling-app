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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ProjectTreeIconsComponent } from './project-tree-icons.component';
import { By } from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectTreeHelper } from '../project-tree.helper';
import { MatIconModule } from '@angular/material';
import { PROCESS, CONNECTOR, MODEL_TYPE, ModelFilter, OpenFilterAction, OPEN_FILTER, AmaState } from '@alfresco-dbp/modeling-shared/sdk';
import { SetMenuAction, SET_MENU } from '../../../../store/actions';

class ProjectTreeHelperMock {
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

describe('ProjectTreeIconsComponent', () => {
    let fixture: ComponentFixture<ProjectTreeIconsComponent>,
        component: ProjectTreeIconsComponent,
        store: Store<AmaState>,
        projectTreeHelper: ProjectTreeHelperMock;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [StoreModule.forRoot({}), TranslateModule.forRoot(), NoopAnimationsModule, MatIconModule],
            declarations: [ProjectTreeIconsComponent],
            providers: [{ provide: ProjectTreeHelper, useClass: ProjectTreeHelperMock }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectTreeIconsComponent);
        component = fixture.componentInstance;
        store = TestBed.get(Store);
        projectTreeHelper = TestBed.get(ProjectTreeHelper);

        fixture.detectChanges();
    });

    it('should display the filter icons provided by the projectTreeHelper', () => {
        const icons = fixture.debugElement.queryAll(By.css('[data-automation-class="project-tree-icon"]'));

        expect(icons.length).toBe(2);
    });

    it('should dispatch the right actions on the icon click', () => {
        spyOn(store, 'dispatch');

        const processIcon = fixture.debugElement.query(By.css('[data-automation-class="project-tree-icon"]'));
        processIcon.triggerEventHandler('click', {});

        const setMenuAction: SetMenuAction = store.dispatch.calls.argsFor(0)[0];
        expect(setMenuAction.type).toBe(SET_MENU);
        expect(setMenuAction.payload).toBe(true);

        const openFilterAction: OpenFilterAction = store.dispatch.calls.argsFor(1)[0];
        expect(openFilterAction.type).toBe(OPEN_FILTER);
        expect(openFilterAction.filterType).toBe(PROCESS);
    });

    it('should the getDataAdapter and load methods with the proper parameters', () => {
        const icons = fixture.debugElement.queryAll(By.css('[data-automation-class="project-tree-icon"]')),
            connectorIcon = icons[1];

        component.projectId = 'app-id';

        connectorIcon.triggerEventHandler('click', {});

        expect(projectTreeHelper.calledWithType).toBe(CONNECTOR);
        expect(projectTreeHelper.loadMock).toHaveBeenCalledWith('app-id');
    });
});
