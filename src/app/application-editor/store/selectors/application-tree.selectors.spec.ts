import { selectOpenedFilters } from './application-tree.selectors';
import { PROCESS, FORM, PLUGIN } from 'ama-sdk';

describe('Application tree selectors', () => {

    describe('selectOpenedFilters', () => {
        it ('should return [PROCESS] by default if nothing is opened', () => {
            const state = {
                'application-editor': {
                    tree: { openedFilters: [] }
                }
            };

            const openedFilters = selectOpenedFilters(state);

            expect(openedFilters).toEqual([PROCESS]);
        });

        it ('should return the array something if something is already in there', () => {
            const state = {
                'application-editor': {
                    tree: { openedFilters: [ FORM, PLUGIN ] }
                }
            };

            const openedFilters = selectOpenedFilters(state);

            expect(openedFilters).toEqual([ FORM, PLUGIN ]);
        });
    });
});
