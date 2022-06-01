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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TabManagerComponent } from './tab-manager.component';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { TabManagerService } from '../../services/tab-manager.service';
import { Model } from '../../api/types';
import { RouterTestingModule } from '@angular/router/testing';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { provideMockStore } from '@ngrx/store/testing';
import * as EntitySelector from '../../store/model-entity.selectors';

const activatedRoute = {
    params: new BehaviorSubject<any>({modelId: 'fake-ui-id'}),
    data: new BehaviorSubject<any>({ modelEntity: 'models'}),
};

const fakeEntityState =  {
    entities: { models: { entities: []}, processes: { entities: [] } }
  };

const fakeModelUI: Model = {
    id: 'fake-ui-id',
    type: 'ui',
    name: 'fake-ui-name',
    description: '',
    version: '',
    creationDate: undefined,
    createdBy: '',
    lastModifiedDate: undefined,
    lastModifiedBy: '',
    projectIds: [],
    scope: null
};

const fakeModelProcess: Model = {
    id: 'fake-process-id',
    type: 'process',
    name: 'fake-process-name',
    description: '',
    version: '',
    creationDate: undefined,
    createdBy: '',
    lastModifiedDate: undefined,
    lastModifiedBy: '',
    projectIds: [],
    scope: null
};

function triggerModelIdChangeWithId(newModelId: string) {
    activatedRoute.params.next( { modelId: newModelId});
}

describe('TabManagerComponent', () => {
    let fixture: ComponentFixture<TabManagerComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                MatTabsModule,
                MatIconModule,
                RouterTestingModule.withRoutes([])
            ],
            declarations: [
                TabManagerComponent
            ],
            providers: [
                { provide: ActivatedRoute, useValue: activatedRoute },
                { provide: TranslationService, useClass: TranslationMock },
                provideMockStore({initialState: fakeEntityState}),
                TabManagerService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(TabManagerComponent);
        spyOn(EntitySelector, 'selectModelEntityByType').and.callFake((modelType, modelId) => {
            if (modelId === fakeModelUI.id) {
                return () => fakeModelUI;
            } else {
                return () => fakeModelProcess;
            }
        });
    });

    it('should show a tab when a navigation to a new model navigation is triggered', async () =>{
        fixture.detectChanges();
        await fixture.whenStable();

        const tabTitle = fixture.nativeElement.querySelector('.ama-tab-title');
        expect(tabTitle).toBeDefined();
        expect(tabTitle).not.toBeNull();
        expect(tabTitle.textContent ).toBe(fakeModelUI.name);
    });

    it('should open a new tab for a model not already opened', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        triggerModelIdChangeWithId('fake-process-id');
        fixture.detectChanges();
        await fixture.whenStable();

        const tabTitles = fixture.nativeElement.querySelectorAll('.ama-tab-title');
        expect(tabTitles).toBeDefined();
        expect(tabTitles).not.toBeNull();
        expect(tabTitles.length).toBe(2);
        expect(tabTitles[1].textContent).toBe(fakeModelProcess.name);
    });

    it('should show set active an already opened tab when the model is clicked', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        triggerModelIdChangeWithId('fake-process-id');
        fixture.detectChanges();
        await fixture.whenStable();

        triggerModelIdChangeWithId('fake-ui-id');
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const activeTabTitle = fixture.nativeElement.querySelector('.mat-tab-label-active .ama-tab-title');
        expect(activeTabTitle).toBeDefined();
        expect(activeTabTitle).not.toBeNull();
        expect(activeTabTitle.textContent).toBe(fakeModelUI.name);

        const tabTitles = fixture.nativeElement.querySelectorAll('.ama-tab-title');
        expect(tabTitles).toBeDefined();
        expect(tabTitles).not.toBeNull();
        expect(tabTitles.length).toBe(2);
    });

    it('should close the tab', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        const closeButton: HTMLButtonElement = fixture.nativeElement.querySelector('.ama-tab-model-close');
        closeButton.click();

        fixture.detectChanges();

        const tabTitles = fixture.nativeElement.querySelectorAll('.ama-tab-title');
        expect(tabTitles.length).toBe(0);
    });

    it('should set as active the previous tab once a tab is closed', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        triggerModelIdChangeWithId('fake-process-id');
        fixture.detectChanges();
        await fixture.whenStable();

        const activeTabTitle = fixture.nativeElement.querySelector('.mat-tab-label-active .ama-tab-title');
        expect(activeTabTitle.textContent).toBe(fakeModelProcess.name);

        const closeButton: HTMLButtonElement = fixture.nativeElement.querySelector('#model-tab-close-button-'+fakeModelProcess.id);
        closeButton.click();

        fixture.detectChanges();

        const tabTitles = fixture.nativeElement.querySelectorAll('.ama-tab-title');
        expect(tabTitles.length).toBe(1);

        const afterDeleteActiveTab = fixture.nativeElement.querySelector('.mat-tab-label-active .ama-tab-title');
        expect(afterDeleteActiveTab.textContent).toBe(fakeModelUI.name);
    });

});
