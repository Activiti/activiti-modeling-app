 /*!
 * @license
 * Copyright 2019 Alfresco, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable, Inject } from '@angular/core';
import { ElementHelper } from './bpmn-js/element.helper';
import { BpmnFactoryToken, BpmnFactory, ModelerInitOptions, ProcessModelerService } from 'ama-sdk';
import { Observable } from 'rxjs';

@Injectable()
export class ProcessModelerServiceImplementation implements ProcessModelerService {
    private modeler: Bpmn.Modeler;

    constructor(@Inject(BpmnFactoryToken) private bpmnFactoryService: BpmnFactory) {}

    init(modelerInitOptions: ModelerInitOptions): void {
        this.modeler = this.bpmnFactoryService.create(modelerInitOptions);
    }

    render(container): void {
        this.modeler.attachTo(container);
    }

    getFromModeler(token) {
        return this.modeler.get(token);
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
