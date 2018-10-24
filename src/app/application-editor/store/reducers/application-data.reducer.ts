import { Action } from '@ngrx/store';
import { GET_APPLICATION_SUCCESS, GetApplicationSuccessAction, SELECT_APPLICATION } from '../actions/application';
import { INITIAL_APPLICATION_DATA_STATE as init, ApplicationDataState } from 'ama-sdk';

export function applicationDataReducer(state: ApplicationDataState = init, action: Action): ApplicationDataState {
    let newState: ApplicationDataState;

    switch (action.type) {
        case SELECT_APPLICATION:
            newState = initApplication(state);
            break;

        case GET_APPLICATION_SUCCESS:
            newState = setApplication(state, <GetApplicationSuccessAction>action);
            break;

        default:
            newState = Object.assign({}, state);
    }

    return newState;
}

function initApplication(state: ApplicationDataState): ApplicationDataState {
    return { ...init };
}

function setApplication(state: ApplicationDataState, action: GetApplicationSuccessAction): ApplicationDataState {
    const newState = Object.assign({}, state);
    newState.datum = action.payload;
    return newState;
}
