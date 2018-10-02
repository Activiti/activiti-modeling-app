import { Process, ARTIFACT_TYPE } from 'ama-sdk';

export interface ProcessSummaryEntities {
    [processId: string]: Partial<Process>;
}

export interface ApplicationTreeState {
    processes: ProcessSummaryEntities;
    openedFilters: ARTIFACT_TYPE[];
    loading: {
        processes: boolean;
    };
    loaded: {
        processes: boolean;
    };
}

export const INITIAL_APPLICATION_TREE_STATE: ApplicationTreeState = {
    processes: {},
    openedFilters: [],
    loading: {
        processes: false
    },
    loaded: {
        processes: false
    },
};
