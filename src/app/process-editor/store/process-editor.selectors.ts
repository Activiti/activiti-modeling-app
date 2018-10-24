import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProcessEditorState } from './process-editor.state';
import { createProcessName } from 'ama-sdk';
import { selectProcesses } from '../../application-editor/store/selectors/application-tree.selectors';

export const PROCESS_EDITOR_STATE_NAME = 'process-editor';

const getDashboardFeatureState = createFeatureSelector<ProcessEditorState>(PROCESS_EDITOR_STATE_NAME);

export const selectProcess = createSelector(getDashboardFeatureState, (state: ProcessEditorState) => state.process);
export const selectProcessDiagram = createSelector(
    getDashboardFeatureState,
    (state: ProcessEditorState) => state.diagram
);
export const selectLoading = createSelector(getDashboardFeatureState, (state: ProcessEditorState) => state.loading);
export const selectSelectedElement = createSelector(
    getDashboardFeatureState,
    (state: ProcessEditorState) => state.selectedElement
);

export const selectProcessPropertiesArray = createSelector(
    getDashboardFeatureState,
    (state: ProcessEditorState) => {
        if (state.process && state.process.extensions && state.process.extensions.properties) {
            return Object.values(state.process.extensions.properties);
        } else {
            return [];
        }
    }
);

export const selectProcessesKeyLabelArray = createSelector(selectProcesses, processes => {
    return Object.values(processes).map(process => ({
        key: process.id,
        label: createProcessName(process.name)
    }));
});

export const selectProcessCrumb = createSelector(selectProcess, process => {
    return process ? { name: `${createProcessName(process.name)} (${process.version})` } : null;
});

export const selectProcessMappingsFor = serviceId => {
    return createSelector(
        selectProcess,
        process => {
            if (!process || !process.extensions) {
                return {};
            }
            const mapping = process.extensions.variablesMappings;
            return mapping && mapping[serviceId] ? mapping[serviceId] : {};
        }
    );
};
