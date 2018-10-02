import { Action } from '@ngrx/store';
import { ProcessEditorState, INITIAL_PROCESS_EDITOR_STATE } from './process-editor.state';
import {
    GET_PROCESS_SUCCESS,
    GotProcessSuccessAction,
    GET_PROCESS_ATTEMPT,
    SELECT_MODELER_ELEMENT,
    SelectModelerElementAction,
    UpdateProcessSuccessAction,
    UPDATE_PROCESS_SUCCESS,
    RemoveDiagramElementAction,
    REMOVE_DIAGRAM_ELEMENT,
    UPDATE_SERVICE_PARAMETERS,
    UpdateServiceParametersAction
} from './process-editor.actions';
import { UPDATE_PROCESS_VARIABLES, UpdateProcessVariablesAction } from './process-variables.actions';

export function processEditorReducer(
    state: ProcessEditorState = { ...INITIAL_PROCESS_EDITOR_STATE },
    action: Action
): ProcessEditorState {
    let newState: ProcessEditorState;

    switch (action.type) {
        case GET_PROCESS_ATTEMPT:
            newState = { ...state, loading: true };
            break;

        case GET_PROCESS_SUCCESS:
            newState = gotProcessData(INITIAL_PROCESS_EDITOR_STATE, <GotProcessSuccessAction>action);
            break;

        case SELECT_MODELER_ELEMENT:
            newState = setSelectedElement(state, <SelectModelerElementAction>action);
            break;

        case UPDATE_PROCESS_SUCCESS:
            newState = updateProcess(state, <UpdateProcessSuccessAction> action);
            break;

        case REMOVE_DIAGRAM_ELEMENT:
            newState = removeElement(state, <RemoveDiagramElementAction> action);
            break;

        case UPDATE_PROCESS_VARIABLES:
            newState = updateProcessVariables(state, <UpdateProcessVariablesAction> action);
            break;

        case UPDATE_SERVICE_PARAMETERS:
            newState = updateProcessVariablesMapping(state, <UpdateServiceParametersAction> action);
            break;

        default:
            newState = Object.assign({}, state);
    }

    return newState;
}

function updateProcessVariablesMapping(state: ProcessEditorState, action: UpdateServiceParametersAction): ProcessEditorState {
    const newState = { ...state };
    newState.process = { ...state.process };
    newState.process.extensions = { ...state.process.extensions };
    newState.process.extensions.variablesMappings = { ...state.process.extensions.variablesMappings };
    newState.process.extensions.variablesMappings[action.serviceId] = { ...action.serviceParameterMappings };

    return newState;
}

function removeElement(state: ProcessEditorState, action: RemoveDiagramElementAction): ProcessEditorState {
    if (state.selectedElement && state.selectedElement.id === action.element.id) {
        return {
            ...state,
            selectedElement: null,
        };
    }

    return { ...state };
}

function gotProcessData(state: ProcessEditorState, action: GotProcessSuccessAction): ProcessEditorState {
    return {
        ...state,
        loading: false,
        process: action.payload.process,
        diagram: action.payload.diagram
    };
}

function updateProcess(state: ProcessEditorState, action: UpdateProcessSuccessAction): ProcessEditorState {
    return {
        ...state,
        process: {
            ...state.process,
            name: action.payload.metadata.name,
            description: action.payload.metadata.description,
        }
    };
}

function setSelectedElement(state: ProcessEditorState, action: SelectModelerElementAction): ProcessEditorState {
    return {
        ...state,
        selectedElement: action.element
    };
}

function updateProcessVariables(state: ProcessEditorState, actions: UpdateProcessVariablesAction): ProcessEditorState {
    const extensions = { ...state.process.extensions };
    extensions.properties = actions.properties;

    return {
        ...state,
        process: { ...state.process, extensions }
    };
}
