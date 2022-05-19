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
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Action, Store } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { MODEL_IMPORTERS, AmaState, ModelScope, ModelImporter } from '@alfresco-dbp/modeling-shared/sdk';
import { ProjectImportSelectListComponent } from './project-import-select-list.component';
import { HttpClientModule } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
export class ImportModelAttemptAction implements Action {
    readonly type = 'ImportGlobalModel';
    constructor(public projectId: string, public modelId: string) { }
}

const selectionImporters: ModelImporter[] = [{
    type: 'process',
    name: 'MODEL_NAME',
    icon: 'MODEL_ICON',
    getGlobalModels(): Observable<any[]> {
        return of(
            [
                {
                    id: 'global-model-1-id',
                    description: 'desc 1',
                    name: 'global-model-1',
                    projectIds: ['project-id-1', 'project-id-2'],
                    scope: ModelScope.GLOBAL,
                    type: 'MODEL'
                },
                {
                    id: 'global-model-2-id',
                    description: 'desc 2',
                    name: 'global-model-2',
                    projectIds: ['project-id-2'],
                    scope: ModelScope.GLOBAL,
                    type: 'MODEL'
                }
            ]
        );
    },
    action: ImportModelAttemptAction
},
{
    type: 'form',
    name: 'FUNNY_MODEL_NAME',
    icon: 'FUNNY_MODEL_ICON',
    getGlobalModels(): Observable<any[]> {
        return of(
            [
                {
                    id: 'funny-global-model-1-id',
                    description: 'desc 1',
                    name: 'funny-global-model-1',
                    projectIds: ['project-id-1', 'project-id-2'],
                    scope: ModelScope.GLOBAL,
                    type: 'MODEL'
                },
                {
                    id: 'funny-global-model-2-id',
                    description: 'desc 2',
                    name: 'funny-global-model-2',
                    projectIds: ['project-id-2'],
                    scope: ModelScope.GLOBAL,
                    type: 'MODEL'
                },
                {
                    id: 'funny-global-model-3-id',
                    description: 'desc 3',
                    name: 'funny-global-model-3',
                    projectIds: ['project-id-2'],
                    scope: ModelScope.GLOBAL,
                    type: 'MODEL'
                }
            ]
        );
    },
    action: ImportModelAttemptAction
}];

describe('ProjectImportSelectListComponent', () => {
    let fixture: ComponentFixture<ProjectImportSelectListComponent>;
    let component: ProjectImportSelectListComponent;
    let store: Store<AmaState>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                MatIconModule,
                MatTabsModule,
                HttpClientModule
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                { provide: MODEL_IMPORTERS, useValue: selectionImporters },
                {
                    provide: Store,
                    useValue: {
                        dispatch: jest.fn()
                    }
                }
            ],
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [ProjectImportSelectListComponent]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectImportSelectListComponent);
        store = TestBed.inject(Store);
        component = fixture.componentInstance;
        component.projectId = 'project-id-1';
        fixture.detectChanges();
    });

    it('should filter global models by project Id', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.items.length).toBe(1);
        expect(component.items[0].displayName).toEqual('global-model-2');
    });

    it('should show models related to the importer selected', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        const tabs = Array.from(fixture.nativeElement.querySelectorAll('.ama-model-importer-tab-group div.mat-tab-label'));
        const dataTab: any = tabs[1];
        dataTab.dispatchEvent(new Event('click'));

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.items.length).toBe(2);
        expect(component.items[0].displayName).toEqual('funny-global-model-2');
        expect(component.items[1].displayName).toEqual('funny-global-model-3');
    });

    it('should dispatch action when item selected', () => {
        const dispatchSpy = spyOn(store, 'dispatch');

        component.onImport('global-model-2-id', selectionImporters[0]);

        const importAction: ImportModelAttemptAction = dispatchSpy.calls.argsFor(0)[0];
        expect(importAction.type).toBe('ImportGlobalModel');
        expect(importAction.modelId).toBe('global-model-2-id');
        expect(importAction.projectId).toBe('project-id-1');
        expect(store.dispatch).toHaveBeenCalledWith(importAction);
    });
});
