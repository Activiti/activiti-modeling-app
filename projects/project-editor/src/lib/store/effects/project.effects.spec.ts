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

import { ProjectEffects } from './project.effects';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, throwError, of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { DialogService } from '@alfresco-dbp/adf-candidates/core/dialog';
import {
    ACMApiModule, DownloadResourceService, BlobService, SnackbarErrorAction, ExportProjectAction, ModelingJSONSchemaService, GetProjectAttemptAction, TabManagerEntityService
} from '@alfresco-dbp/modeling-shared/sdk';
import { ProjectEditorService } from '../../services/project-editor.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { LogService, AlfrescoApiService, AlfrescoApiServiceMock, TranslationService, TranslationMock } from '@alfresco/adf-core';
import { Router } from '@angular/router';
import { hot, getTestScheduler, cold } from 'jasmine-marbles';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

describe('Project Effects', () => {
    let effects: ProjectEffects;
    let metadata: EffectsMetadata<ProjectEffects>;
    let actions$: Observable<any>;
    let service: ProjectEditorService;
    let downloadService: DownloadResourceService;
    let modelingJSONSchemaService: ModelingJSONSchemaService;

    const mockDialog = {
        close: jest.fn()
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ACMApiModule.forRoot(),
                MatDialogModule
            ],
            providers: [
                DialogService,
                ProjectEffects,
                {
                    provide: ModelingJSONSchemaService,
                    useValue: {
                        initializeProjectSchema: () => jest.fn()
                    }
                },
                { provide: MatDialogRef, useValue: mockDialog },
                provideMockActions(() => actions$),
                {
                    provide: Router,
                    useValue: { navigate: jest.fn() }
                },
                {
                    provide: AlfrescoApiService,
                    useClass: AlfrescoApiServiceMock
                },
                {
                    provide: LogService,
                    useValue: { error: jest.fn() }
                },
                {
                    provide: TranslationService,
                    useClass: TranslationMock
                },
                {
                    provide: Store,
                    useValue: { dispatch: jest.fn(), select: jest.fn() }
                },
                {
                    provide: ProjectEditorService,
                    useValue: { fetchProject: jest.fn(), exportProject: jest.fn().mockReturnValue(of()) }
                },
                {
                    provide: BlobService,
                    useValue: { convert2Json: jest.fn().mockReturnValue(of({ message: 'test', errors: [{ description: 'd1' }, { description: 'd2' }, { description: 'd3' }] })) }
                },
                {
                    provide: TabManagerEntityService, useValue: {
                        updateOneInCache: jasmine.createSpy(),
                        entities$: of([])
                    }
                }
            ]
        });

        effects = TestBed.inject(ProjectEffects);
        metadata = getEffectsMetadata(effects);
        service = TestBed.inject(ProjectEditorService);
        downloadService = TestBed.inject(DownloadResourceService);
        modelingJSONSchemaService = TestBed.inject(ModelingJSONSchemaService);

    });

    it('ExportProject effect should dispatch an action', () => {
        expect(metadata.exportApplicationEffect.dispatch).toBeTruthy();
    });

    it('ExportProject effect should call downloadResource', () => {
        const mockPayload: any = {
            projectId: 'id1',
            projectName: 'Project 1'
        };

        spyOn(service, 'exportProject');
        spyOn(downloadService, 'downloadResource');
        service.exportProject = jest.fn().mockReturnValue(of(mockPayload));

        actions$ = hot('a', { a: new ExportProjectAction(mockPayload) });
        effects.exportApplicationEffect.subscribe(() => { });
        getTestScheduler().flush();
        expect(service.exportProject).toHaveBeenCalledWith('id1');
        getTestScheduler().flush();
        expect(downloadService.downloadResource).toHaveBeenCalledWith('Project 1', mockPayload, '.zip');
    });

    it('ExportProject effect should dispatch OpenConfirmDialogAction on error', () => {
        const error: any = new Error();
        error.error = { response: { body: new Blob() } };
        const exportProject: jest.Mock = <jest.Mock>service.exportProject;
        exportProject.mockReturnValue(throwError(error));

        actions$ = hot('a', { a: new ExportProjectAction({ projectId: '', projectName: '' }) });
        const expectedSnackBarAction = new SnackbarErrorAction('PROJECT_EDITOR.ERROR.EXPORT_PROJECT');
        const expected = cold('b', {
            b: expectedSnackBarAction
        });

        expect(effects.exportApplicationEffect).toBeObservable(expected);
    });

    it('GetProject effect should initialize json schema for project', () => {
        const mockPayload: any = {
            projectId: 'id1',
            projectName: 'Project 1'
        };

        spyOn(service, 'fetchProject');
        spyOn(modelingJSONSchemaService, 'initializeProjectSchema');
        service.fetchProject = jest.fn().mockReturnValue(of(mockPayload));

        actions$ = hot('a', { a: new GetProjectAttemptAction('id1') });
        effects.getProjectEffect.subscribe(() => { });
        getTestScheduler().flush();
        expect(service.fetchProject).toHaveBeenCalledWith('id1');
        getTestScheduler().flush();
        expect(modelingJSONSchemaService.initializeProjectSchema).toHaveBeenCalledWith('id1');
    });
});
