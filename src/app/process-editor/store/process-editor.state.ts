import { Process, ProcessDiagramData } from 'ama-sdk';

export interface SelectedProcessElement {
    id: string;
    type: string;
    name?: string;
}

export interface ProcessEditorState {
    loading: boolean;
    process: Process;
    diagram: ProcessDiagramData;
    selectedElement: SelectedProcessElement;
    dirty: boolean;
}

export const INITIAL_PROCESS_EDITOR_STATE: ProcessEditorState = {
    loading: false,
    process: null,
    diagram: null,
    selectedElement: null,
    dirty: false
};
