import { Injectable, Inject } from '@angular/core';
import { ElementHelper } from './bpmn-js/element.helper';
import { BpmnFactoryToken, BpmnFactory, ModelerInitOptions } from './bpmn-factory.token';
import { Observable } from 'rxjs';

@Injectable()
export class ProcessModelerService {
    private modeler: Bpmn.Modeler;

    constructor(@Inject(BpmnFactoryToken) private bpmnFactoryService: BpmnFactory) {}

    init(modelerInitOptions: ModelerInitOptions): void {
        this.modeler = this.bpmnFactoryService.create(modelerInitOptions);
    }

    render(container): void {
        this.modeler.attachTo(container);
    }

    getElement(shapeId): Bpmn.DiagramElement {
        return this.modeler.get('elementRegistry').get(shapeId);
    }

    getRootProcessElement(): Bpmn.DiagramElement {
        return this.modeler.get('canvas').getRootElement();
    }

    updateElementProperty(shapeId, propertyName, value): void {
        const modeling: Bpmn.Modeling = this.modeler.get('modeling'),
            element = this.getElement(shapeId);

        ElementHelper.setProperty(modeling, element, propertyName, value);
    }

    loadXml(xml: string): Observable<any> {
        return new Observable(subscriber => {
            this.modeler.importXML(xml, err => {
                if (err) {
                    subscriber.error(err);
                }

                subscriber.next(xml);
            });
        });
    }

    export(): Promise<any> {
        return new Promise((resolve, reject) =>
            this.modeler.saveXML({ format: true }, (err, diagramData) => {
                if (err) {
                    return reject(err);
                }
                resolve(diagramData);
            })
        );
    }

    zoomIn(): void {
        this.modeler.get('editorActions').trigger('stepZoom', { value: 1 });
    }

    zoomOut(): void {
        this.modeler.get('editorActions').trigger('stepZoom', { value: -1 });
    }

    fitViewPort(): void {
        this.modeler.get('canvas').zoom('fit-viewport', true);
    }

    undo(): void {
        this.modeler.get('editorActions').trigger('undo');
    }

    redo(): void {
        this.modeler.get('editorActions').trigger('redo');
    }

    destroy() {
        this.modeler.destroy();
    }
}
