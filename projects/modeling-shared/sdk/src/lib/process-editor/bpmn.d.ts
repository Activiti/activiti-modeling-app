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
        source?: DiagramElement;
        target?: DiagramElement;
        incoming?: DiagramElement[];
        outgoing?: DiagramElement[];
        parent?: DiagramElement;
        labelTarget?: DiagramElement;
        name?: string;
    }

    export type NamedDiagramService =
        | 'elementRegistry'
        | 'bpmnFactory'
        | 'create'
        | 'elementFactory'
        | 'handTool'
        | 'globalConnect'
        | 'lassoTool'
        | 'spaceTool'
        | 'eventBus'
        | 'canvas'
        | 'modeling'
        | 'zoomScroll'
        | 'editorActions'
        | 'propertiesPanel'
        | 'moddle';

    interface Modeler {
        createDiagram(done: any);
        importXML(xml: string, done: any);
        saveXML(options: { format?: boolean; preamble?: boolean }, done: any);
        saveSVG(options: { [key: string]: any }, done: any);
        get(namedDiagramService: NamedDiagramService): any;
        destroy(): void;
        on(event: string, priority: number, callback: any, targetContext: any): void;
        on(event: string, callback: any): void;
        off(event: string | string[], callback?: any): void;
        attachTo(parentNode: any): void;
        detach(): void;
    }

    export interface Modeling {
        updateProperties(element: DiagramElement, properties: { [key: string]: any }): void;
    }

    export interface Moddle {
        create(tagName: string, property: { [key: string]: any }): void;
    }

}
