import { AppState, AmaState } from 'ama-sdk';

export const INITIAL_APP_STATE: AppState = {
    selectedAppId: null,
    selectedProcessId: null,
    menuOpened: true,
    dirtyState: false
};

export const INITIAL_STATE: AmaState = {
    app: INITIAL_APP_STATE
};
