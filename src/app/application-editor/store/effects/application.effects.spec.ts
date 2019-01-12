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

import { ApplicationEffects } from './application.effects';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, throwError, of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { ACMApiModule, OpenConfirmDialogAction, DownloadResourceService, Blob2JsonService } from 'ama-sdk';
import { ApplicationEditorService } from '../../services/application-editor.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { LogService, AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-core';
import { Router } from '@angular/router';
import { ExportApplicationAction } from '../actions/application';
import { hot, getTestScheduler, cold } from 'jasmine-marbles';

describe('Application Effects', () => {
    let effects: ApplicationEffects;
    let metadata: EffectsMetadata<ApplicationEffects>;
    let actions$: Observable<any>;
    let service: ApplicationEditorService;
    let downloadService: DownloadResourceService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ACMApiModule.forRoot()],
            providers: [
                ApplicationEffects,
                DownloadResourceService,
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
                    provide: Store,
                    useValue: {dispatch: jest.fn(), select: jest.fn()}
                },
                {
                    provide: ApplicationEditorService,
                    useValue: {fetchApplication: jest.fn(), exportApplication: jest.fn().mockReturnValue(of())}
                },
                {
                    provide: Blob2JsonService,
                    useValue: { convert: jest.fn().mockReturnValue(of({ message: 'test', errors: [ {description: 'd1'}, {description: 'd2'}, {description: 'd3'} ] })) }
                }
            ]
        });

        effects = TestBed.get(ApplicationEffects);
        metadata = getEffectsMetadata(effects);
        service = TestBed.get(ApplicationEditorService);
        downloadService = TestBed.get(DownloadResourceService);

    });


    it('ExportApplication effect should dispatch an action', () =>
        expect(metadata.exportApplicatonEffect).toEqual({ dispatch: true })
    );

    it('ExportApplication effect should call downloadResource', () => {
        const mockPayload = {
            applicationId: 'id1',
            applicationName: 'Application 1'
        };

        spyOn(service, 'exportApplication');
        spyOn(downloadService, 'downloadResource');
        service.exportApplication = jest.fn().mockReturnValue(of(mockPayload));

        actions$ = hot('a', { a: new ExportApplicationAction(mockPayload) });
        effects.exportApplicatonEffect.subscribe( () => {} );
        getTestScheduler().flush();
        expect(service.exportApplication).toHaveBeenCalledWith('id1');
        getTestScheduler().flush();
        expect(downloadService.downloadResource).toHaveBeenCalledWith('Application 1', mockPayload, '.zip');
    });

    it('ExportApplication effect should dispatch OpenConfirmDialogAction on error', () => {
        const error: any = new Error();
        error.error = { response: { body: new Blob() }};
        const exportApplication: jest.Mock = <jest.Mock>service.exportApplication;
        exportApplication.mockReturnValue(throwError(error));

        actions$ = hot('a', { a: new ExportApplicationAction({ applicationId: '', applicationName: '' }) });
        const expected = cold('b', {
            b: new OpenConfirmDialogAction({ dialogData: {
                title: 'test',
                subtitle: 'APP.DIALOGS.ERROR.SUBTITLE',
                errors: ['d1', 'd2', 'd3']
            }})
        });

        expect(effects.exportApplicatonEffect).toBeObservable(expected);
    });
});

