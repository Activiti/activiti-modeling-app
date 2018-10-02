import { Application } from 'ama-sdk';

export interface ApplicationSummaryEntities {
    [key: string]: Partial<Application>;
}

export interface DashboardState {
    applications: ApplicationSummaryEntities;
    loading: boolean;
    applicationsLoaded: boolean;
}

export const INITIAL_DASHBOARD_STATE: DashboardState = {
    applications: {},
    loading: false,
    applicationsLoaded: false
};
