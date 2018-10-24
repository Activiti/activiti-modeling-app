import { getEmptyDiagram } from './empty-diagram';
import { formatUuid } from 'ama-sdk';

describe('Empty diagram', () => {
    const buidlXML = (process) => {
        const generatedDiagram = getEmptyDiagram(process);
        const parser = new DOMParser();
        const diagram = parser.parseFromString(generatedDiagram, 'text/xml');

        return diagram;
    };

    it('Test when description is missing', () => {
        const mockProcess = {
            id: 'id1',
            name: 'process1'
        };

        const diagram = buidlXML(mockProcess);
        const documentation = diagram.getElementsByTagName('bpmn2:documentation');
        const id = diagram.getElementsByTagName('bpmn2:process')[0].getAttribute('id');
        const name = diagram.getElementsByTagName('bpmn2:process')[0].getAttribute('name');

        expect(documentation[0].textContent).toBe('');
        expect(id).toBe(formatUuid(mockProcess.name, mockProcess.id));
        expect(name).toBe('process1');
    });

    it('Test when description is present', () => {
        const mockProcess = {
            id: 'id1',
            name: 'process1',
            description: 'desc'
        };

        const diagram = buidlXML(mockProcess);
        const documentation = diagram.getElementsByTagName('bpmn2:documentation');
        const id = diagram.getElementsByTagName('bpmn2:process')[0].getAttribute('id');
        const name = diagram.getElementsByTagName('bpmn2:process')[0].getAttribute('name');

        expect(documentation[0].textContent).toBe('desc');
        expect(id).toBe(formatUuid(mockProcess.name, mockProcess.id));
        expect(name).toBe('process1');
    });
});
