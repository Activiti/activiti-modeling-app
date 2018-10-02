import { ApplicationEffects } from './application.effects';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { APSApiModule } from 'ama-sdk';
import { ApplicationEditorService } from '../../services/application-editor.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { LogService, AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ExportApplicationAction } from '../actions/application';
import { hot, getTestScheduler,  } from 'jasmine-marbles';
import { DownloadResourceService } from '../../../common/services/download-resource';

describe('Application Effects', () => {
    let effects: ApplicationEffects;
    let metadata: EffectsMetadata<ApplicationEffects>;
    let actions$: Observable<any>;
    let service: ApplicationEditorService;
    let downloadService: DownloadResourceService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [APSApiModule.forRoot()],
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
                }]
        });

        effects = TestBed.get(ApplicationEffects);
        metadata = getEffectsMetadata(effects);
        service = TestBed.get(ApplicationEditorService);
        downloadService = TestBed.get(DownloadResourceService);

    });


    it('ExportApplication effect should not dispatch an action', () =>
        expect(metadata.exportApplicatonEffect).toEqual({ dispatch: false })
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
});
