import { createSelector } from '@ngrx/store';
import { selectLoadings, selectApplicationTree, ApplicationTreeState } from 'ama-sdk';
import { PROCESS } from 'ama-sdk';

export const selectOpenedFilters = createSelector(selectApplicationTree,
    (state: ApplicationTreeState) => {
        const openedFilters = state.openedFilters;
        return openedFilters.length ? openedFilters : [PROCESS];
    }
);

export const selectProcessesLoading = createSelector(selectLoadings, loading => !!loading.processes);
export const selectProcessesLoaded = createSelector(selectApplicationTree, state => state.loaded.processes);
export const selectProcesses = createSelector(selectApplicationTree, state => state.processes);
export const selectProcessesArray = createSelector(selectProcesses, processes => Object.values(processes));
