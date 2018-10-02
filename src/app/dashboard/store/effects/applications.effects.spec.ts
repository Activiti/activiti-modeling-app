/*!
 * @license
 * Alfresco Example Modeling Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Modeling Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Modeling Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Modeling Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { TestBed } from '@angular/core/testing';
import { ApplicationsEffects } from './applications.effects';
import { Observable, BehaviorSubject } from 'rxjs';
import { cold, hot } from 'jasmine-marbles';
import { DashboardService } from '../../services/dashboard.service';
import { Store } from '@ngrx/store';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { Router } from '@angular/router';
import { LogService, CoreModule } from '@alfresco/adf-core';
import { DialogService } from '../../../common/services/dialog.service';
import { selectApplicationsLoaded } from '../selectors/dashboard.selectors';
import { provideMockActions } from '@ngrx/effects/testing';
import {
    ShowApplicationsAction,
    GET_APPLICATIONS_ATTEMPT,
    UploadApplicationAttemptAction,
    UploadApplicationSuccessAction,
    CreateApplicationAttemptAction,
    CreateApplicationSuccessAction,
    UpdateApplicationAttemptAction,
    EditApplicationPayload,
    UpdateApplicationSuccessAction,
    DeleteApplicationAttemptAction,
    DeleteApplicationSuccessAction,
    GetApplicationsAttemptAction,
    GetApplicationsSuccessAction
} from '../actions/applications';
import { of } from 'rxjs';
import { AmaApi } from 'ama-sdk';
import { ApplicationApi } from 'ama-sdk';
import { SnackbarInfoAction, SnackbarErrorAction, EntityDialogForm } from '../../../store/actions';
import { mockApplication } from './application.mock';
import { throwError } from 'rxjs';
import { AmaAuthenticationService } from '../../../common/services/ama-authentication.service';

describe('ApplicationsEffects', () => {
    let effects: ApplicationsEffects;
    let metadata: EffectsMetadata<ApplicationsEffects>;
    let actions$: Observable<any>;
    let dashboardService: DashboardService;
    const applicationsLoaded$ = new BehaviorSubject<boolean>(false);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreModule],
            providers: [
                ApplicationsEffects,
                AmaAuthenticationService,
                AmaApi,
                ApplicationApi,
                DashboardService,
                provideMockActions(() => actions$),
                {
                    provide: Router,
                    useValue: { navigate: jest.fn() }
                },
                {
                    provide: LogService,
                    useValue: { error: jest.fn() }
                },
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation((selector) => {
                            if (selector === selectApplicationsLoaded) {
                                return applicationsLoaded$;
                            }

                            return of({});
                        }),
                        dispatch: jest.fn()
                    }
                },
                {
                    provide: DialogService,
                    useValue: { openDialog: jest.fn() }
                }
            ]
        });

        effects = TestBed.get(ApplicationsEffects);
        metadata = getEffectsMetadata(effects);
        dashboardService = TestBed.get(DashboardService);
    });

    describe('ShowApplication', () => {
        it('should dispatch an action', () => {
            expect(metadata.showApplicationsEffect).toEqual({ dispatch: true });
        });

        it('should dispatch a GetApplicationAtteptAction if there are no applications loaded', () => {
            actions$ = hot('a', { a: new ShowApplicationsAction() });
            const expected = cold('b', { b: { type: GET_APPLICATIONS_ATTEMPT } });
            expect(effects.showApplicationsEffect).toBeObservable(expected);
        });

        it('should not dispatch a new GetApplicationAtteptAction if there are apps loaded', () => {
            actions$ = hot('a', { a: new ShowApplicationsAction() });
            const expected = cold('');
            applicationsLoaded$.next(true);
            expect(effects.showApplicationsEffect).toBeObservable(expected);
        });
    });

    describe('UploadApplicationAttempt', () => {
        const mockFile = new File([''], 'filename');

        it('should dispatch an action', () => {
            expect(metadata.uploadApplicationAttemptEffect).toEqual({ dispatch: true });
        });

        it('should trigger the right action on successful upload', () => {
            dashboardService.importApplication = jest.fn().mockReturnValue(of(mockApplication));
            actions$ = hot('a', { a: new UploadApplicationAttemptAction(mockFile) });

            const expected = cold('(bc)', {
                b: new UploadApplicationSuccessAction(mockApplication),
                c: new SnackbarInfoAction('APP.HOME.NEW_MENU.APP_UPLOADED')
            });

            expect(effects.uploadApplicationAttemptEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful update', () => {
            dashboardService.importApplication = jest.fn().mockReturnValue(throwError(new Error()));
            actions$ = hot('a', { a: new UploadApplicationAttemptAction(mockFile) });

            const expected = cold('b', {
                b: new SnackbarErrorAction('APP.APPLICATION.ERROR.UPLOAD_APPLICATION.GENERAL')
            });

            expect(effects.uploadApplicationAttemptEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful update with error 409', () => {
            const error: any = new Error();
            error.status = 409;
            dashboardService.importApplication = jest.fn().mockReturnValue(throwError(error));
            actions$ = hot('a', { a: new UploadApplicationAttemptAction(mockFile) });

            const expected = cold('b', {
                b: new SnackbarErrorAction('APP.APPLICATION.ERROR.UPLOAD_APPLICATION.DUPLICATION')
            });

            expect(effects.uploadApplicationAttemptEffect).toBeObservable(expected);
        });
    });

    describe('CreateApplicationAttemptEffect', () => {
        const appForm: Partial<EntityDialogForm> = { name: 'testName' };

        it('should dispatch an action', () => {
            expect(metadata.createApplicationAttemptEffect).toEqual({ dispatch: true });
        });

        it('should trigger the right action on successful upload', () => {
            dashboardService.createApplication = jest.fn().mockReturnValue(of(mockApplication));
            actions$ = hot('a', { a: new CreateApplicationAttemptAction(appForm) });

            const expected = cold('(bc)', {
                b: new CreateApplicationSuccessAction(mockApplication),
                c: new SnackbarInfoAction('APP.HOME.NEW_MENU.APP_CREATED')
            });

            expect(effects.createApplicationAttemptEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful update', () => {
            dashboardService.createApplication = jest.fn().mockReturnValue(throwError(new Error()));
            actions$ = hot('a', { a: new CreateApplicationAttemptAction(appForm) });

            const expected = cold('b', {
                b: new SnackbarErrorAction('APP.APPLICATION.ERROR.CREATE_APPLICATION.GENERAL')
            });

            expect(effects.createApplicationAttemptEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful update with error 409', () => {
            const error: any = new Error();
            error.status = 409;
            dashboardService.createApplication = jest.fn().mockReturnValue(throwError(error));
            actions$ = hot('a', { a: new CreateApplicationAttemptAction(appForm) });

            const expected = cold('b', {
                b: new SnackbarErrorAction('APP.APPLICATION.ERROR.CREATE_APPLICATION.DUPLICATION')
            });

            expect(effects.createApplicationAttemptEffect).toBeObservable(expected);
        });
    });

    describe('UpdateApplicationAttemptEffect', () => {
        const payload: EditApplicationPayload = { id: 'id', form: { name: 'testName' } };

        it('should dispatch an action', () => {
            expect(metadata.updateApplicationAttemptEffect).toEqual({ dispatch: true });
        });

        it('should trigger the right action on successful upload', () => {
            dashboardService.updateApplication = jest.fn().mockReturnValue(of(mockApplication));
            actions$ = hot('a', { a: new UpdateApplicationAttemptAction(payload) });

            const expected = cold('(bc)', {
                b: new UpdateApplicationSuccessAction(mockApplication),
                c: new SnackbarInfoAction('APP.HOME.NEW_MENU.APP_UPDATED')
            });

            expect(effects.updateApplicationAttemptEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful update', () => {
            dashboardService.updateApplication = jest.fn().mockReturnValue(throwError(new Error()));
            actions$ = hot('a', { a: new UpdateApplicationAttemptAction(payload) });

            const expected = cold('b', {
                b: new SnackbarErrorAction('APP.APPLICATION.ERROR.UPDATE_APPLICATION.GENERAL')
            });

            expect(effects.updateApplicationAttemptEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful update with error 409', () => {
            const error: any = new Error();
            error.status = 409;
            dashboardService.updateApplication = jest.fn().mockReturnValue(throwError(error));
            actions$ = hot('a', { a: new UpdateApplicationAttemptAction(payload) });

            const expected = cold('b', {
                b: new SnackbarErrorAction('APP.APPLICATION.ERROR.UPDATE_APPLICATION.DUPLICATION')
            });

            expect(effects.updateApplicationAttemptEffect).toBeObservable(expected);
        });
    });

    describe('DeleteApplicationAttemptEffect', () => {

        it('should dispatch an action', () => {
            expect(metadata.deleteApplicationAttemptEffect).toEqual({ dispatch: true });
        });

        it('should trigger the right action on successful delete', () => {
            dashboardService.deleteApplication = jest.fn().mockReturnValue(of(mockApplication));
            actions$ = hot('a', { a: new DeleteApplicationAttemptAction(mockApplication.id) });

            const expected = cold('(bc)', {
                b: new DeleteApplicationSuccessAction(mockApplication.id),
                c: new SnackbarInfoAction('APP.HOME.NEW_MENU.APP_DELETED')
            });

            expect(effects.deleteApplicationAttemptEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful delete', () => {
            dashboardService.deleteApplication = jest.fn().mockReturnValue(throwError(new Error()));
            actions$ = hot('a', { a: new DeleteApplicationAttemptAction(mockApplication.id) });

            const expected = cold('b', {
                b: new SnackbarErrorAction('APP.APPLICATION.ERROR.DELETE_APPLICATION')
            });

            expect(effects.deleteApplicationAttemptEffect).toBeObservable(expected);
        });
    });

    describe('GetApplicationsAttemptEffect', () => {

        it('should dispatch an action', () => {
            expect(metadata.getApplicationsAttemptEffect).toEqual({ dispatch: true });
        });

        it('should trigger the right action on successful get', () => {
            dashboardService.fetchApplications = jest.fn().mockReturnValue(of([ mockApplication ]));
            actions$ = hot('a', { a: new GetApplicationsAttemptAction() });

            const expected = cold('b', {
                b: new GetApplicationsSuccessAction([ mockApplication ])
            });

            expect(effects.getApplicationsAttemptEffect).toBeObservable(expected);
        });

        it('should trigger the right action on unsuccessful get', () => {
            dashboardService.fetchApplications = jest.fn().mockReturnValue(throwError(new Error()));
            actions$ = hot('a', { a: new GetApplicationsAttemptAction() });

            const expected = cold('b', {
                b: new SnackbarErrorAction('APP.HOME.ERROR.LOAD_APPLICATIONS')
            });

            expect(effects.getApplicationsAttemptEffect).toBeObservable(expected);
        });
    });
});
