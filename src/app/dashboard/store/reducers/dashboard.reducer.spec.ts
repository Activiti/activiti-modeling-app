import { dashboardReducer } from './dashboard.reducer';
import {
    DeleteApplicationSuccessAction,
    UploadApplicationSuccessAction,
    GetApplicationsSuccessAction,
    CreateApplicationSuccessAction,
    UpdateApplicationSuccessAction
} from '../actions/applications';
import { INITIAL_DASHBOARD_STATE, DashboardState } from '../state/dashboard.state';
import { Application } from 'ama-sdk';
import { mockApplication } from '../effects/application.mock';

describe('dashboardReducer', () => {

    let initialState: DashboardState;

    beforeEach(() => {
        initialState = { ...INITIAL_DASHBOARD_STATE };
        initialState.applications = {
            '1': { id: '1' },
            '2': { id: '2' },
            '3': { id: '3' }
        };
    });

    describe('GET_APPLICATIONS_SUCCESS', () => {
        const action = new GetApplicationsSuccessAction(<Partial<Application>[]>[mockApplication]);

        it('should load the applications', () => {
            const newState = dashboardReducer(initialState, action);

            expect(newState.applicationsLoaded).toBe(true);
            expect(newState.applications).toEqual({ [mockApplication.id]: mockApplication });
        });
    });

    describe('CREATE_APPLICATION_SUCCESS', () => {
        const action = new CreateApplicationSuccessAction(<Partial<Application>>mockApplication);

        it('should append the application to the list', () => {
            const newState = dashboardReducer(initialState, action);

            expect(newState.applications).toEqual({ ...newState.applications, [mockApplication.id]: mockApplication });
        });
    });

    describe('UPDATE_APPLICATION_SUCCESS', () => {
        const newApplication = { ...mockApplication, name: 'new-name', description: 'new-description' };
        const action = new UpdateApplicationSuccessAction(<Partial<Application>>newApplication);

        it('should update the application in the list', () => {
            const newState = dashboardReducer(initialState, action);

            expect(newState.applications).toEqual({ ...newState.applications, [newApplication.id]: newApplication });
        });
    });

    describe('DELETE_APPLICATION_SUCCESS', () => {
        const action = new DeleteApplicationSuccessAction('2');

        it('should delete the application', () => {
            const newState = dashboardReducer(initialState, action);

            expect(newState.applications['1']).not.toBe(undefined);
            expect(newState.applications['2']).toBe(undefined);
            expect(newState.applications['3']).not.toBe(undefined);
        });
    });

    describe('UPLOAD_APPLICATION_SUCCESS', () => {
        const application = {
            id: '4',
            name: 'test'
        };

        const action = new UploadApplicationSuccessAction(application);

        it('shoudl add a new application to the state', () => {
            const newState = dashboardReducer(initialState, action);
            expect(newState.applications['4']).not.toBe(undefined);
        });
    });
});
