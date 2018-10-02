declare namespace Bpmn {
    export interface BusinessObject {
        $type: string;
        id: string;
        name?: string;
        [key: string]: any;
    }

    export interface DiagramElement {
        id: string;
        type: string;
        businessObject: BusinessObject;
    }

    export type NamedDiagramService =
        | 'elementRegistry'
        | 'eventBus'
        | 'canvas'
        | 'modeling'
        | 'zoomScroll'
        | 'editorActions'
        | 'propertiesPanel';

    interface Modeler {
        createDiagram(done: any);
        importXML(xml: string, done: any);
        saveXML(options: { format?: boolean; preamble?: boolean }, done: any);
        saveSVG(options: { [key: string]: any }, done: any);
        get(namedDiagramService: NamedDiagramService): any;
        destroy(): void;
        on(event: string, priority: number, callback: any, targetContext: any): void;
        on(event: string, callback: any): void;
        off(event: string, callback?: any): void;
        attachTo(parentNode: any): void;
        detach(): void;
    }

    export interface Modeling {
        updateProperties(element: DiagramElement, properties: { [key: string]: any }): void;
    }
}
