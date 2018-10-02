import { createSelector } from '@ngrx/store';
import { ApplicationTreeState } from '../state/application-tree.state';
import { selectApplicationTree } from './application-editor.selectors';

export const selectLoadings = createSelector(selectApplicationTree, (state: ApplicationTreeState) => state.loading);
export const selectOpenedFilters = createSelector(selectApplicationTree, state => state.openedFilters);

export const selectProcessesLoading = createSelector(selectLoadings, loading => !!loading.processes);
export const selectProcessesLoaded = createSelector(selectApplicationTree, state => state.loaded.processes);
export const selectProcesses = createSelector(selectApplicationTree, state => state.processes);
export const selectProcessesArray = createSelector(selectProcesses, processes => Object.values(processes));
