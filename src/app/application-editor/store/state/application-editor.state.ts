import { ApplicationTreeState, INITIAL_APPLICATION_TREE_STATE } from './application-tree.state';
import { ApplicationDataState, INITIAL_APPLICATION_DATA_STATE } from './application-data.state';

export interface ApplicationEditorState {
    application: ApplicationDataState;
    tree: ApplicationTreeState;
}

export const INITIAL_APPLICATION_EDITOR_STATE: ApplicationEditorState = {
    application: INITIAL_APPLICATION_DATA_STATE,
    tree: INITIAL_APPLICATION_TREE_STATE
};
