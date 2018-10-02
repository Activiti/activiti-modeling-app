import { createProcessName, PROCESS_FILE_FORMAT, createConnectorName, CONNECTOR_FILE_FORMAT, createFormName, FORM_FILE_FORMAT } from './create-entries-names';
import { sortEntriesByName } from './sort-entries-by-name';

describe('Common Helpers', () => {

    it('should test createProcessName function', () => {
        const testName = 'testName';
        expect(createProcessName(testName + PROCESS_FILE_FORMAT)).toBe(testName);
    });

    it('should test createConnectorName function', () => {
        const testName = 'testName';
        expect(createConnectorName(testName + CONNECTOR_FILE_FORMAT)).toBe(testName);
    });

    it('should test createFormName function', () => {
        const testName = 'testName';
        expect(createFormName(testName + FORM_FILE_FORMAT)).toBe(testName);
    });

    it('should test sortEntriesByName function', () => {
        const entries = [{ name: 'B' }, { name: 'd' }, { name: 'A' }, { name: 'c' }];
        const sortedEntries = [{ name: 'A' }, { name: 'B' }, { name: 'c' }, { name: 'd' }];

        expect(sortEntriesByName(entries)).toEqual(sortedEntries);
    });

});
