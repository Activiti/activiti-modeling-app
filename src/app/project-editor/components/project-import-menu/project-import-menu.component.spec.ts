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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatMenuModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Action, Store } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { MODEL_IMPORTERS, AmaState, ModelScope } from '@alfresco-dbp/modeling-shared/sdk';
import { ProjectImportMenuComponent } from './project-import-menu.component';
import { HttpClientModule } from '@angular/common/http';

export class ImportModelAttemptAction implements Action {
    readonly type = 'ImportGlobalModel';
    constructor(public projectId: string, public modelId: string) { }
}

describe('ProjectImportMenuComponent', () => {
    let fixture: ComponentFixture<ProjectImportMenuComponent>;
    let component: ProjectImportMenuComponent;
    let store: Store<AmaState>;

    beforeEach(async(() => {

        const importer = {
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
        };

        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                MatIconModule,
                MatMenuModule,
                HttpClientModule
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                { provide: MODEL_IMPORTERS, multi: true, useValue: importer },
                {
                    provide: Store,
                    useValue: {
                        dispatch: jest.fn()
                    }
                }
            ],
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [ProjectImportMenuComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectImportMenuComponent);
        store = TestBed.get(Store);
        component = fixture.componentInstance;
        component.type = 'process';
        component.projectId = 'project-id-1';
        component.ngOnChanges();
        fixture.detectChanges();
    });

    it('should filter global models by project Id', () => {
        expect(component.items.length).toBe(1);
        expect(component.items[0].displayName).toEqual('global-model-2');
    });

    it('should dispatch action when item selected', () => {
        spyOn(store, 'dispatch');

        component.onImport('global-model-2-id');

        const importAction: ImportModelAttemptAction = store.dispatch.calls.argsFor(0)[0];
        expect(importAction.type).toBe('ImportGlobalModel');
        expect(importAction.modelId).toBe('global-model-2-id');
        expect(importAction.projectId).toBe('project-id-1');
        expect(store.dispatch).toHaveBeenCalledWith(importAction);
    });
});
