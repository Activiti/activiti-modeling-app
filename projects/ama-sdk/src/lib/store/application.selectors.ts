import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApplicationEditorState } from './application.state';
import { ApplicationTreeState } from './application-tree.state';

export const APPLICATION_EDITOR_STATE_NAME = 'application-editor';

export const getApplicationEditorFeatureState = createFeatureSelector<ApplicationEditorState>(APPLICATION_EDITOR_STATE_NAME);

export const selectApplication = createSelector(
    getApplicationEditorFeatureState,
    (state: ApplicationEditorState) => state.application.datum
);

export const selectApplicationLoading = createSelector(
    getApplicationEditorFeatureState,
    (state: ApplicationEditorState) => state.application.loading
);

export const selectApplicationTree = createSelector(
    getApplicationEditorFeatureState,
    (state: ApplicationEditorState) => state.tree
);

export const selectLoadings = createSelector(selectApplicationTree, (state: ApplicationTreeState) => state.loading);
