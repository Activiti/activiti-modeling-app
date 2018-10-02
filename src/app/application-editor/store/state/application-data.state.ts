import { Application } from 'ama-sdk';

export interface ApplicationDataState {
    datum: Partial<Application>;
    loading: boolean;
    error?: any;
}

export const INITIAL_APPLICATION_DATA_STATE: ApplicationDataState = {
    datum: null,
    loading: false
};
