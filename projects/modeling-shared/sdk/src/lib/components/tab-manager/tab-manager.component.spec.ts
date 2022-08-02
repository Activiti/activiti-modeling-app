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
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TabManagerService } from '../../services/tab-manager.service';
import { Model } from '../../api/types';
import { RouterTestingModule } from '@angular/router/testing';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as EntitySelector from '../../store/model-entity.selectors';
import * as AppStateSelector from '../../store/app.selectors';
import { ModelOpenedAction } from '../../store/project.actions';
import { DialogService } from '@alfresco-dbp/adf-candidates/core/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { EntityCacheEffects, EntityDataModule, EntityDataService } from '@ngrx/data';
import { TabManagerEntityService } from './tab-manager-entity.service';
import { EffectsModule } from '@ngrx/effects';
import { ScannedActionsSubject } from '@ngrx/store';
import { TabModel } from '../../models/tab.model';
import { map } from 'rxjs/operators';
import { entityMetaData } from './tab-manager.module';
import { UnsavedPageGuard } from '../../model-editor/public-api';

const activatedRoute = {
    url: new Observable<any[]>(),
    params: new BehaviorSubject<any>({ modelId: 'fake-ui-id' }),
    data: new BehaviorSubject<any>({ modelEntity: 'models' }),
};

const fakeEntityState = {
    entities: { models: { entities: [] }, processes: { entities: [] } }
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
    activatedRoute.params.next({ modelId: newModelId });
}

describe('TabManagerComponent', () => {
    let fixture: ComponentFixture<TabManagerComponent>;
    let mockStore: MockStore;
    let location: Location;
    let dispatchSpy: jest.SpyInstance;
    let dirtyStateSpy: any;
    let router: Router;
    let tabManagerEntityService: TabManagerEntityService;
    let tabListMock = [];
    const tabSubjectMock = new BehaviorSubject<TabModel[]>(tabListMock);
    let unsavedPageGuard: UnsavedPageGuard = null;
    let tabManagerService: TabManagerService = null;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                MatTabsModule,
                MatIconModule,
                RouterTestingModule.withRoutes([]),
                MatDialogModule,
                EntityDataModule.forRoot({
                    entityMetadata: entityMetaData
                }),
                EffectsModule.forRoot([])
            ],
            declarations: [
                TabManagerComponent
            ],
            providers: [
                { provide: ActivatedRoute, useValue: activatedRoute },
                { provide: TranslationService, useClass: TranslationMock },
                provideMockStore({ initialState: fakeEntityState }),
                {
                    provide: Router,
                    useValue: { navigate: jest.fn(() => Promise.resolve(true)) }
                },
                TabManagerService,
                DialogService,
                TabManagerEntityService,
                { provide: UnsavedPageGuard, useValue: {
                    openDirtyStateDialog: jest.fn()
                }},
                { provide: EntityCacheEffects, useValue: {} },
                { provide: EntityDataService, useValue: null },
                ScannedActionsSubject
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        tabManagerService = TestBed.inject(TabManagerService);
        tabManagerEntityService = TestBed.inject(TabManagerEntityService);
        tabManagerEntityService.entities$ = tabSubjectMock.asObservable();
        tabManagerEntityService.filteredEntities$ = tabSubjectMock.asObservable().pipe(map((tabs) => tabs.filter(tab => tab.active)));
        fixture = TestBed.createComponent(TabManagerComponent);
        mockStore = TestBed.inject(MockStore);
        location = TestBed.inject(Location);
        dispatchSpy = jest.spyOn(mockStore, 'dispatch');
        jest.spyOn(fixture.componentInstance, 'canDeactivate').mockReturnValue(of(true));
        dirtyStateSpy = jest.spyOn(AppStateSelector, 'selectAppDirtyState');
        router = TestBed.inject(Router);
        unsavedPageGuard = TestBed.inject(UnsavedPageGuard);

        spyOn(EntitySelector, 'selectModelEntityByType').and.callFake((modelType, modelId) => {
            if (modelId === fakeModelUI.id) {
                return () => fakeModelUI;
            } else {
                return () => fakeModelProcess;
            }
        });

        spyOn(tabManagerEntityService, 'addOneToCache').and.callFake((tabModel) => {
            tabListMock.push(tabModel);
            tabSubjectMock.next(tabListMock);
        });

        spyOn(tabManagerEntityService, 'removeOneFromCache').and.callFake((tabModel) => {
            const removeTabIndex = tabListMock.findIndex((tab) => tab.id === tabModel.id);
            tabListMock.splice(removeTabIndex, 1);
            tabSubjectMock.next(tabListMock);
        });

        spyOn(tabManagerEntityService, 'updateOneInCache').and.callFake((tabModel) => {
            const updateIndex = tabListMock.findIndex((tab) => tab.id === tabModel.id);
            tabListMock[updateIndex] = tabModel;
            tabSubjectMock.next(tabListMock);
        });

        spyOn(tabManagerEntityService, 'updateManyInCache').and.callFake((changedTabModels: TabModel[]) => {
            tabListMock.map(tab => changedTabModels.find(changedTab => changedTab.id === tab.id) || tab);
            tabSubjectMock.next(tabListMock);
        });
    });

    afterEach(() => {
        tabListMock = [];
        tabSubjectMock.next([]);
        fixture.destroy();
        jest.clearAllMocks();
    });

    it('should show a tab when a navigation to a new model navigation is triggered', async () => {
        dirtyStateSpy.mockReturnValue(false);
        triggerModelIdChangeWithId('fake-ui-id');

        fixture.detectChanges();
        await fixture.whenStable();

        const tabTitle = fixture.nativeElement.querySelector('.ama-tab-title');
        expect(tabTitle).toBeDefined();
        expect(tabTitle).not.toBeNull();
        expect(tabTitle.textContent).toBe(fakeModelUI.name);
    });

    it('should open a new tab for a model not already opened', async () => {
        dirtyStateSpy.mockReturnValue(false);
        triggerModelIdChangeWithId('fake-ui-id');
        fixture.detectChanges();

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
        dirtyStateSpy.mockReturnValue(false);
        triggerModelIdChangeWithId('fake-ui-id');
        fixture.detectChanges();

        triggerModelIdChangeWithId('fake-process-id');
        fixture.detectChanges();
        await fixture.whenStable();

        triggerModelIdChangeWithId('fake-ui-id');
        fixture.detectChanges();
        await fixture.whenStable();

        const activeTabTitle = fixture.nativeElement.querySelector('.mat-tab-label-active .ama-tab-title');
        expect(activeTabTitle).toBeDefined();
        expect(activeTabTitle).not.toBeNull();
        expect(activeTabTitle.textContent).toBe(fakeModelUI.name);

        const tabTitles = fixture.nativeElement.querySelectorAll('.ama-tab-title');
        expect(tabTitles).toBeDefined();
        expect(tabTitles).not.toBeNull();
        expect(tabTitles.length).toBe(2);
    });

    it('should set as active the previous tab once a tab is closed', async () => {
        dirtyStateSpy.mockReturnValue(false);
        jest.spyOn(unsavedPageGuard, 'openDirtyStateDialog').mockReturnValue(of(true));
        triggerModelIdChangeWithId('fake-ui-id');
        fixture.detectChanges();

        triggerModelIdChangeWithId('fake-process-id');
        fixture.detectChanges();
        await fixture.whenStable();

        const activeTabTitle = fixture.nativeElement.querySelector('.mat-tab-label-active .ama-tab-title');
        expect(activeTabTitle.textContent).toBe(fakeModelProcess.name);

        const closeButton: HTMLButtonElement = fixture.nativeElement.querySelector('#model-tab-close-button-' + fakeModelProcess.id);
        closeButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        const tabTitles = fixture.nativeElement.querySelectorAll('.ama-tab-title');
        expect(tabTitles.length).toBe(1);

        const afterDeleteActiveTab = fixture.nativeElement.querySelector('.mat-tab-label-active .ama-tab-title');
        expect(afterDeleteActiveTab.textContent).toBe(fakeModelUI.name);
    });

    it('should close the tab', async () => {
        dirtyStateSpy.mockReturnValue(false);
        jest.spyOn(unsavedPageGuard, 'openDirtyStateDialog').mockReturnValue(of(true));
        triggerModelIdChangeWithId('fake-ui-id');
        fixture.detectChanges();

        const closeButton: HTMLButtonElement = fixture.nativeElement.querySelector('.ama-tab-model-close');
        closeButton.click();

        fixture.detectChanges();

        const tabTitles = fixture.nativeElement.querySelectorAll('.ama-tab-title');
        expect(tabTitles.length).toBe(0);
    });

    it('when no tabs are opened should navigate back to the project url', async () => {
        jest.spyOn(location, 'path').mockReturnValue('/project/whatever-project-id/ui/fake-ui-id');
        jest.spyOn(unsavedPageGuard, 'openDirtyStateDialog').mockReturnValue(of(true));
        dirtyStateSpy.mockReturnValue(false);
        triggerModelIdChangeWithId('fake-ui-id');
        fixture.detectChanges();

        const closeButton: HTMLButtonElement = fixture.nativeElement.querySelector('.ama-tab-model-close');
        closeButton.click();

        fixture.detectChanges();
        await fixture.whenStable();
        expect(router.navigate).toHaveBeenCalledWith(['','project','whatever-project-id'], jasmine.any(Object));
    });

    it('should prevent the tab from closing if the app is in dirty state', async () => {
        triggerModelIdChangeWithId('fake-ui-id');
        jest.spyOn(unsavedPageGuard, 'openDirtyStateDialog').mockReturnValue(of(false));
        fixture.detectChanges();

        tabManagerService.updateTabDirtyState(true, 'fake-ui-id');

        const closeButton: HTMLButtonElement = fixture.nativeElement.querySelector('.ama-tab-model-close');
        closeButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        const tabTitles = fixture.nativeElement.querySelectorAll('.ama-tab-title');
        expect(tabTitles.length).toBe(1);
    });

    it('should trigger a MODEL_OPENED action when opening tab', async () => {
        const expectedModelOpenedAction = new ModelOpenedAction({ id: fakeModelProcess.id, type: fakeModelProcess.type });
        fixture.detectChanges();
        triggerModelIdChangeWithId('fake-process-id');
        fixture.detectChanges();
        await fixture.whenStable();

        expect(dispatchSpy).toHaveBeenCalledWith(expectedModelOpenedAction);
        const dispatchCallList = dispatchSpy.mock.calls.flat();
        const filteredCalls = dispatchCallList.filter((call) => call.type === expectedModelOpenedAction.type);
        expect(filteredCalls.length).toBe(1);
        dispatchSpy.mockRestore();
    });

    it('should update the url when clicking on a tab', async () => {
        jest.spyOn(location, 'path').mockReturnValue('/project/whatever-project-id/ui/fake-ui-id');
        triggerModelIdChangeWithId('fake-ui-id');
        fixture.detectChanges();

        triggerModelIdChangeWithId('fake-process-id');
        fixture.detectChanges();
        await fixture.whenStable();

        const uiTab = fixture.nativeElement.querySelector('[data-automation-id="model-tab-title-' + fakeModelUI.id + '"]');
        uiTab.click();

        fixture.detectChanges();
        expect(router.navigate).toHaveBeenCalledWith(['', 'project', 'whatever-project-id','process', 'fake-process-id'], jasmine.any(Object));
    });

    it('should navigate correctly on the last element of the tab list when is replaced in its position', async () => {
        jest.spyOn(location, 'path').mockReturnValue('/project/whatever-project-id/ui/fake-ui-id');
        jest.spyOn(unsavedPageGuard, 'openDirtyStateDialog').mockReturnValue(of(true));
        triggerModelIdChangeWithId('fake-ui-id');
        fixture.detectChanges();

        triggerModelIdChangeWithId('fake-process-id');
        fixture.detectChanges();
        await fixture.whenStable();

        triggerModelIdChangeWithId('fake-ui-id');
        fixture.detectChanges();
        await fixture.whenStable();

        const closeButton: HTMLButtonElement = fixture.nativeElement.querySelector('#model-tab-close-button-' + fakeModelUI.id);
        closeButton.click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(router.navigate).toHaveBeenLastCalledWith(['', 'project', 'whatever-project-id','process', 'fake-process-id'], jasmine.any(Object));
    });
});
