import { Action } from '@ngrx/store';
import {
    GET_PROCESSES_SUCCESS,
    GetProcessesSuccessAction,
    CREATE_PROCESS_SUCCESS,
    CreateProcessSuccessAction,
    GET_PROCESSES_ATTEMPT,
    GetProcessesAttemptAction,
    DELETE_PROCESS_SUCCESS,
    DeleteProcessSuccessAction
} from '../actions/processes';
import { ApplicationTreeState, INITIAL_APPLICATION_TREE_STATE as init } from 'ama-sdk';
import { Process } from 'ama-sdk';
import { SELECT_APPLICATION, OpenFilterAction, OPEN_FILTER, CLOSE_FILTER, CloseFilterAction } from '../actions/application';
import { UPDATE_PROCESS_SUCCESS, UpdateProcessSuccessAction } from '../../../process-editor/store/process-editor.actions';
const keyBy = require('lodash/keyBy');

export function applicationTreeReducer(state: ApplicationTreeState = init, action: Action): ApplicationTreeState {
    let newState: ApplicationTreeState;

    switch (action.type) {
        case SELECT_APPLICATION:
            newState = initTree(state);
            break;

        case GET_PROCESSES_ATTEMPT:
            newState = getProcesses(state, <GetProcessesAttemptAction>action);
            break;

        case GET_PROCESSES_SUCCESS:
            newState = setProcesses(state, <GetProcessesSuccessAction>action);
            break;

        case CREATE_PROCESS_SUCCESS:
            newState = createProcess(state, <CreateProcessSuccessAction>action);
            break;

        case UPDATE_PROCESS_SUCCESS:
            newState = updateProcess(state, <UpdateProcessSuccessAction>action);
            break;

        case DELETE_PROCESS_SUCCESS:
            newState = deleteProcess(state, <DeleteProcessSuccessAction>action);
            break;

        case OPEN_FILTER:
            newState = openFilter(state, <OpenFilterAction>action);
            break;

        case CLOSE_FILTER:
            newState = closeFilter(state, <CloseFilterAction>action);
            break;

        default:
            newState = Object.assign({}, state);
    }

    return newState;
}

function initTree(state: ApplicationTreeState): ApplicationTreeState {
    return { ...init };
}

function getProcesses(state: ApplicationTreeState, action: GetProcessesAttemptAction): ApplicationTreeState {
    const newState = { ...state };
    newState.loading = { ...state.loading };
    newState.loading.processes = true;
    return newState;
}

function setProcesses(state: ApplicationTreeState, action: GetProcessesSuccessAction): ApplicationTreeState {
    const newState = { ...state };
    newState.processes = keyBy(action.processes, 'id');
    newState.loading = { ...state.loading };
    newState.loading.processes = false;
    newState.loaded = { ...state.loaded };
    newState.loaded.processes = true;
    return newState;
}

function createProcess(state: ApplicationTreeState, action: CreateProcessSuccessAction): ApplicationTreeState {
    const newState = { ...state },
        newProcess = action.process;

    newState.processes = {
        ...state.processes,
        [newProcess.id]: newProcess
    };

    return newState;
}

function updateProcess(state: ApplicationTreeState, action: UpdateProcessSuccessAction): ApplicationTreeState {
    const newState = { ...state },
        oldProcess = state.processes[action.payload.processId],
        newProcess = { ...oldProcess, ...action.payload.metadata };

    newState.processes = {
        ...state.processes,
        [action.payload.processId]: <Process>newProcess
    };

    return newState;
}

function deleteProcess(state: ApplicationTreeState, action: DeleteProcessSuccessAction): ApplicationTreeState {
    const newState = { ...state };
    const processId = action.processId;

    newState.processes = { ...state.processes };
    delete newState.processes[processId];

    return newState;
}

function openFilter(state: ApplicationTreeState, action: OpenFilterAction): ApplicationTreeState {
    const newState = { ...state, openedFilters: [ ...state.openedFilters ] };

    if (newState.openedFilters.indexOf(action.filterType) < 0) {
        newState.openedFilters.push(action.filterType);
    }

    return newState;
}

function closeFilter(state: ApplicationTreeState, action: CloseFilterAction): ApplicationTreeState {
    const newState = {
        ...state,
        openedFilters: state.openedFilters.filter(filter => filter !== action.filterType)
    };

    return newState;
}
