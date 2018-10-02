import { logoutMetaReducer } from './logout.meta.reducer';
import { INITIAL_APP_STATE } from '../states/app.state';
import { AppActionTypes } from '../actions/app.actions';

describe('logoutMetaReducer', () => {
    let logoutReducer: any;
    const state = {
        whatever: 'Badabooom'
    };

    const testReducer = (currentState, action) => ({ ...currentState, reducerCalledWith: action.message });

    beforeEach(() => {
        logoutReducer = logoutMetaReducer(testReducer);
    });

    it('should return the state, with the testReducer applied on it, if the action is NOT the logout action', () => {
        const expectedMessage = 'Meow',
            action = { type: 'Not logout, not at all', message: expectedMessage };

        const newState = logoutReducer(state, action);

        expect(newState).toEqual({
            ...state,
            reducerCalledWith: expectedMessage
        });
    });

    it('should return the INITIAL_APP_STATE, with the testReducer applied on it, if the action is the logout action', () => {
        const expectedMessage = 'Meow',
            action = { type: AppActionTypes.Logout, message: expectedMessage };

        const newState = logoutReducer(state, action);

        expect(newState).toEqual({
            ...INITIAL_APP_STATE,
            reducerCalledWith: expectedMessage
        });
    });
});
