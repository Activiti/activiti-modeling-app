import { ApplicationDataState, INITIAL_APPLICATION_DATA_STATE } from '../state/application-data.state';
import { applicationDataReducer } from './application-data.reducer';
import { SELECT_APPLICATION, GetApplicationSuccessAction } from '../actions/application';
import { Application } from 'ama-sdk';

describe('Application data reducer', () => {
    let initState: ApplicationDataState;

    it ('should handle SELECT_APPLICATION', () => {
        initState = {...INITIAL_APPLICATION_DATA_STATE};
        const newState = applicationDataReducer(initState, {type: SELECT_APPLICATION});

        expect(newState).toEqual(initState);
    });

    it ('should handle GET_APPLICATION_SUCCESS', () => {
        const application: Partial<Application> = {
            type: 'application',
            id: 'appid',
            name: 'appname'
        };
        initState = {...INITIAL_APPLICATION_DATA_STATE};
        const newState = applicationDataReducer(initState, new GetApplicationSuccessAction(application));

        expect(newState.datum).toEqual(application);
    });
});
