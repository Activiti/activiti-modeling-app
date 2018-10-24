import { Action } from '@ngrx/store';
import { SET_MENU, SetMenuAction } from '../actions';
import { INITIAL_APP_STATE } from '../states/app.state';
import { SELECT_APPLICATION, SelectApplicationAction } from '../../application-editor/store/actions/application';
import { GotProcessSuccessAction, GET_PROCESS_SUCCESS } from '../../process-editor/store/process-editor.actions';
import { DELETE_PROCESS_SUCCESS, DeleteProcessSuccessAction } from '../../application-editor/store/actions/processes';
import { AppActionTypes, AsyncInitAction } from '../actions/app.actions';
import { SET_APP_DIRTY_STATE, SetAppDirtyStateAction } from 'ama-sdk';
import { AppState } from 'ama-sdk';

export function appReducer(state: AppState = INITIAL_APP_STATE, action: Action): AppState {
    let newState: AppState;

    switch (action.type) {
        case AppActionTypes.AsyncInit:
            newState = ayncInit(state, <AsyncInitAction>action);
            break;

        case SET_MENU:
            newState = setMenuState(state, <SetMenuAction>action);
            break;

        case SELECT_APPLICATION:
            newState = selectApplication(state, <SelectApplicationAction>action);
            break;

        case GET_PROCESS_SUCCESS:
            newState = getProcess(state, <GotProcessSuccessAction>action);
            break;

        case DELETE_PROCESS_SUCCESS:
            newState = deleteProcess(state, <DeleteProcessSuccessAction>action);
            break;

        case SET_APP_DIRTY_STATE:
            newState = setDirtyState(state, <SetAppDirtyStateAction>action);
            break;

        default:
            newState = Object.assign({}, state);
    }

    return newState;
}

function setDirtyState(state: AppState, action: SetAppDirtyStateAction): AppState {
    return { ...state, dirtyState: action.payload };
}

function ayncInit(state: AppState, action: AsyncInitAction): AppState {
    const menuOpened = action.config.menuOpened;

    return {
        ...state,
        ...(menuOpened !== null ? { menuOpened } : {})
    };
}

function deleteProcess(state: AppState, action: DeleteProcessSuccessAction): AppState {
    const newState = Object.assign({}, state);
    newState.selectedProcessId = null;
    return newState;
}

function setMenuState(state: AppState, action: SetMenuAction): AppState {
    const newState = Object.assign({}, state);
    newState.menuOpened = action.payload;
    return newState;
}

function selectApplication(state: AppState, action: SelectApplicationAction): AppState {
    const newState = Object.assign({}, state);
    newState.selectedAppId = action.payload;
    newState.selectedProcessId = null;
    return newState;
}

function getProcess(state: AppState, action: GotProcessSuccessAction): AppState {
    const newState = Object.assign({}, state);
    newState.selectedProcessId = action.payload.process.id;
    return newState;
}
