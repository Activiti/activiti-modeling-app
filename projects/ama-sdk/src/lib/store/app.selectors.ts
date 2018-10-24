import { createSelector } from '@ngrx/store';
import { AmaState, AppState } from './app.state';
import { selectApplication } from './application.selectors';

export const selectApp = (state: AmaState) => state.app;

export const selectSelectedAppId = createSelector(selectApp, (state: AppState) => state.selectedAppId);
export const selectAppDirtyState = createSelector(selectApp, (state: AppState) => state.dirtyState);

export const selectApplicationCrumb = createSelector(selectApplication, application => {
    return application ? { url: `/applications/${application.id}`, name: application.name } : null;
});

export const selectSelectedProcessId = createSelector(selectApp, (state: AppState) => state.selectedProcessId);
