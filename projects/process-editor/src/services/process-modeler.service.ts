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
import { PROCESS_SVG_IMAGE } from './process-editor.constants';
import {
    BpmnFactoryToken,
    BpmnFactory,
    ModelerInitOptions,
    ProcessModelerService,
    BpmnProperty,
    MESSAGE
} from '@alfresco-dbp/modeling-shared/sdk';
import { Observable } from 'rxjs';

@Injectable()
export class ProcessModelerServiceImplementation implements ProcessModelerService {
    public modeler: Bpmn.Modeler;
    private modelerInitOptions: ModelerInitOptions;

    constructor(@Inject(BpmnFactoryToken) private bpmnFactoryService: BpmnFactory) {}

    init(modelerInitOptions: ModelerInitOptions): void {
        this.modeler = this.bpmnFactoryService.create();
        this.modelerInitOptions = modelerInitOptions;
        this.listenToEventHandlers();

        document.addEventListener('keypress', this.limitModelerEditableElementLength, false);
    }

    limitModelerEditableElementLength(event: Event): void {
        const { classList, innerHTML } = <Element>event.target;
        const isModelerEditableElement = Array.from(classList).includes('djs-direct-editing-content');
        const isElementNameValid = innerHTML.length <= 40;

        if (isModelerEditableElement && !isElementNameValid) {
            event.preventDefault();
        }
    }

    render(container): void {
        this.modeler.attachTo(container);
    }

    getFromModeler(token: Bpmn.NamedDiagramService) {
        return this.modeler.get(token);
    }

    getElement(shapeId: string): Bpmn.DiagramElement {
        return this.modeler.get('elementRegistry').get(shapeId);
    }

    getRootProcessElement(): Bpmn.DiagramElement {
        return this.modeler.get('canvas').getRootElement();
    }

    updateElementProperty(shapeId: string, propertyName: BpmnProperty, value: any): void {
        const modeling: Bpmn.Modeling = this.modeler.get('modeling'),
            element = this.getElement(shapeId),
            moddle: Bpmn.Moddle = this.modeler.get('moddle');

        ElementHelper.setProperty(modeling, element, propertyName, value, moddle);
    }

    loadXml(xml: string): Observable<void> {
        return new Observable(subscriber => {
            this.muteEventHandlers();

            this.modeler.importXML(xml, (error, warnings) => {
                this.listenToEventHandlers();

                if (error) {
                    subscriber.error({
                        type: MESSAGE.ERROR,
                        messages: [`Error: ${error.message}`]
                    });
                } else if (warnings.length) {
                    subscriber.error({
                        type: MESSAGE.WARN,
                        messages: warnings.map(entry => entry.message)
                    });
                } else {
                    subscriber.next();
                    subscriber.complete();
                }
            });
        });
    }

    export(type = null): Promise<string> {
        return new Promise((resolve, reject) => {
            const options = { format: true };
            const exportCallBack = (err, diagramData) => {
                if (err) {
                    return reject(err);
                }
                resolve(diagramData);
            };
            if (type === PROCESS_SVG_IMAGE) {
                this.modeler.saveSVG(options, exportCallBack);
            } else {
                this.modeler.saveXML(options, exportCallBack);
            }
        });
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
        document.removeEventListener('keypress', this.limitModelerEditableElementLength, false);
    }

    private listenToEventHandlers() {
        this.modeler.on('element.click', this.modelerInitOptions.clickHandler);
        this.modeler.on('element.changed', this.modelerInitOptions.changeHandler);
        this.modeler.on('shape.remove', this.modelerInitOptions.removeHandler);
        this.modeler.on('create.end', this.modelerInitOptions.createHandler);
        this.modeler.on('selection.changed', this.modelerInitOptions.selectHandler);
        this.modeler.on('copyPaste.copyElement', this.modelerInitOptions.copyActionHandler);
        this.modeler.on('copyPaste.pasteElement', this.modelerInitOptions.pasteActionHandler);
    }

    private muteEventHandlers() {
        this.modeler.off('element.click', this.modelerInitOptions.clickHandler);
        this.modeler.off('element.changed', this.modelerInitOptions.changeHandler);
        this.modeler.off('shape.remove', this.modelerInitOptions.removeHandler);
        this.modeler.off('create.end', this.modelerInitOptions.createHandler);
        this.modeler.off('selection.changed', this.modelerInitOptions.selectHandler);
        this.modeler.off('copyPaste.copyElement', this.modelerInitOptions.copyActionHandler);
        this.modeler.off('copyPaste.pasteElement', this.modelerInitOptions.pasteActionHandler);
    }

    public createEventHandlerForAction(actionName: string, handler: (event) => any | void) {
        this.modeler.on(actionName, handler);
    }
}
