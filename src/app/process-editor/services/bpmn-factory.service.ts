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

import { Injectable } from '@angular/core';
import * as bpmnPropertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/bpmn';
import { ModelerInitOptions, BpmnFactory } from 'ama-sdk';
/*
    Angular 6 --prod mode doesn't seem to work with the normal way of importing the bmpnjs library.
    Modify this import with care, doublechecking the process editor works in --prod mode.
*/
import BpmnModeler from 'bpmn-js/dist/bpmn-modeler.production.min';

function DummyPaletteProvider(palette) {
    palette.registerProvider(this);
    this.getPaletteEntries = () => ({
        'hand-tool': {
            group: 'tools',
            className: 'bpmn-icon-hand-tool',
            title: 'Dummy tool, otherwise diagramjs\'s palette crashes',
            action: {}
        }
    });
}
export const emptyPaletteModule = {
    paletteProvider: ['type', DummyPaletteProvider]
};

const activitiModdleDescriptor = require('./activiti.json');

@Injectable()
export class BpmnFactoryService implements BpmnFactory {
    create({ clickHandler, changeHandler, removeHandler, selectHandler }: ModelerInitOptions): Bpmn.Modeler {
        const modeler = new BpmnModeler({
            keyboard: { bindTo: document },
            ...this.getBpmnPropertiesPanelConfig()
        });

        modeler.on('element.click', clickHandler);
        modeler.on('element.changed', changeHandler);
        modeler.on('shape.remove', removeHandler);
        modeler.on('selection.changed', selectHandler);

        return modeler;
    }

    protected getBpmnPropertiesPanelConfig() {
        return {
            additionalModules: [
                emptyPaletteModule,
                bpmnPropertiesProviderModule
            ],
            moddleExtensions: { activiti: activitiModdleDescriptor }
        };
    }
}
