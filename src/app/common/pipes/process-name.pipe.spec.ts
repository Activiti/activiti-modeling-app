import { ProcessNamePipe } from './process-name.pipe';
import * as hellper from '../helpers/create-entries-names';

describe('ProcessNamePipe', () => {
    let pipe: ProcessNamePipe;

    beforeEach(() => {
        pipe = new ProcessNamePipe();
    });

    it('providing no value returns fallback', () => {
        expect(pipe.transform(undefined, [])).toBe(undefined);
    });

    it('providing value returns expected result', () => {
        spyOn(hellper, 'createProcessName');

        pipe.transform('name.bpmn', []);
        expect(hellper.createProcessName).toHaveBeenCalledWith('name.bpmn');
    });
});
