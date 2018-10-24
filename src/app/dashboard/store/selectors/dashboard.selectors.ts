import { DashboardState } from '../state/dashboard.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const DASHBOARD_STATE_NAME = 'dashboard';

const getDashboardFeatureState = createFeatureSelector<DashboardState>(DASHBOARD_STATE_NAME);

const selectLoadingFromState = (state: DashboardState) => state.loading;
const selectApplicationsLoadedFromState = (state: DashboardState) => state.applicationsLoaded;
const selectApplicationSummariesFromState = (state: DashboardState) => state.applications;

export const selectLoading = createSelector(getDashboardFeatureState, selectLoadingFromState);
export const selectApplicationsLoaded = createSelector(getDashboardFeatureState, selectApplicationsLoadedFromState);
export const selectApplicationSummaries = createSelector(getDashboardFeatureState, selectApplicationSummariesFromState);
export const selectApplicationsArray = createSelector(selectApplicationSummaries, application => Object.values(application));
