import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApplicationEditorState } from '../state/application-editor.state';

export const APPLICATION_EDITOR_STATE_NAME = 'application-editor';

const getApplicationEditorFeatureState = createFeatureSelector<ApplicationEditorState>(APPLICATION_EDITOR_STATE_NAME);

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
