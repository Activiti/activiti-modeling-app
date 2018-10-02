import { Injectable } from '@angular/core';
import * as bpmnPropertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/bpmn';
import { PaletteProvider } from '../components/process-modeler/palette';
import { ModelerInitOptions, BpmnFactory } from './bpmn-factory.token';
/*
    Angular 6 --prod mode doesn't seem to work with the normal way of importing the bmpnjs library.
    Modify this import with care, doublechecking the process editor works in --prod mode.
*/
import BpmnModeler from 'bpmn-js/dist/bpmn-modeler.production.min';

const customPaletteModule = {
    paletteProvider: ['type', PaletteProvider]
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
                customPaletteModule,
                bpmnPropertiesProviderModule
            ],
            moddleExtensions: { activiti: activitiModdleDescriptor }
        };
    }
}
