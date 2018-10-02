import { createSelector } from '@ngrx/store';
import { AppState, selectApp } from 'ama-sdk';

export const selectMenuOpened = createSelector(selectApp, (state: AppState) => state.menuOpened);
export const selectSelectedAppId = createSelector(selectApp, (state: AppState) => state.selectedAppId);
export const selectSelectedProcessId = createSelector(selectApp, (state: AppState) => state.selectedProcessId);
export const selectAppDirtyState = createSelector(selectApp, (state: AppState) => state.dirtyState);
