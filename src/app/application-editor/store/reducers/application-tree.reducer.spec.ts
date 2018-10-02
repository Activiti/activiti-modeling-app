import { ApplicationTreeState, INITIAL_APPLICATION_TREE_STATE } from '../state/application-tree.state';
import { applicationTreeReducer } from './application-tree.reducer';
import { SELECT_APPLICATION, OpenFilterAction, CloseFilterAction } from '../actions/application';
import { CONNECTOR, PROCESS } from 'ama-sdk';
import { UpdateProcessSuccessAction } from '../../../process-editor/store/process-editor.actions';
import {
    GetProcessesAttemptAction,
    GetProcessesSuccessAction,
    CreateProcessSuccessAction,
    DeleteProcessSuccessAction
} from '../actions/processes';

describe('ApplicationTreeReducer', () => {
    let initState: ApplicationTreeState;

    initState = {...INITIAL_APPLICATION_TREE_STATE};

    it('should handle SELECT_APPLICATION', () => {
        const newState = applicationTreeReducer(initState, {type: SELECT_APPLICATION});
        expect(newState).toEqual(initState);
    });

    it('should handle GET_PROCESSES_ATTEMPT', () => {
        const newState = applicationTreeReducer(initState, new GetProcessesAttemptAction('appId'));

        expect(newState.loading.processes).toBeTruthy();
    });

    it('should handle GET_PROCESSES_SUCCESS', () => {
        const processes = [
            {
                id: 'id1',
                name: 'name'
            }
        ];
        const newState = applicationTreeReducer(initState, new GetProcessesSuccessAction(processes));

        expect(newState.loading.processes).toBeFalsy();
        expect(newState.loaded.processes).toBeTruthy();
    });

    it ('should handle CREATE_PROCESS_SUCCES', () => {
        const process =   {
            id: 'id1',
            name: 'name'
        };

        const newState = applicationTreeReducer(initState, new CreateProcessSuccessAction(process));

        expect(newState.processes[process.id]).toEqual(process);
    });

    it ('should handle UPDATE_PROCESS_SUCCESS', () => {
        const updateProcessPayload = {
            processId: 'id1',
            content: '',
            metadata: {
                name: 'new name',
                description: ''
            }
        };

        const process =   {
            id: 'id1',
            name: 'name'
        };

        const state = applicationTreeReducer(initState, new CreateProcessSuccessAction(process));
        const newState = applicationTreeReducer(state, new UpdateProcessSuccessAction(updateProcessPayload));

        expect(newState.processes[updateProcessPayload.processId].name).toEqual(updateProcessPayload.metadata.name);
    });

    it ('should handle DELETE_PROCESS_SUCCESS', () => {
        const newState = applicationTreeReducer(initState, new DeleteProcessSuccessAction('processId'));

        expect(newState.processes['processId']).toBeUndefined();
    });

    it('should handle OPEN_FILTER', () => {
        const newState = applicationTreeReducer(initState, new OpenFilterAction(PROCESS));

        expect(newState.openedFilters).toEqual([ PROCESS ]);
    });

    it('should handle CLOSE_FILTER', () => {
        const initialState = { ...initState, openedFilters: [ PROCESS, CONNECTOR ]};
        const newState = applicationTreeReducer(initialState, new CloseFilterAction(PROCESS));

        expect(newState.openedFilters).toEqual([ CONNECTOR ]);
    });
});
