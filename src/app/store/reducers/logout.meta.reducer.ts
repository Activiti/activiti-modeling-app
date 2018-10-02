import { AppActionTypes } from '../actions/app.actions';
import { INITIAL_APP_STATE } from '../states/app.state';

export function logoutMetaReducer(reducer) {
    return function logoutReducer(state, action) {
        if (action.type === AppActionTypes.Logout) {
            return reducer({ ...INITIAL_APP_STATE }, action);
        }
        return reducer(state, action);
    };
}
