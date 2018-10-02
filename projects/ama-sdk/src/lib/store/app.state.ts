export interface AppState {
    menuOpened: boolean;
    selectedAppId: string | null;
    selectedProcessId: string | null;
    dirtyState: boolean;
}

export interface AmaState {
    app: AppState;
}
