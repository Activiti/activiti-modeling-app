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
