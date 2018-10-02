import { Injectable } from '@angular/core';

import * as propertiesPanelModule from 'bpmn-js-properties-panel';
import * as bpmnPropertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/bpmn';
import * as camundaPropertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import { BpmnFactoryService } from '../process-editor/services/bpmn-factory.service';
import { PaletteProvider } from '../process-editor/components/process-modeler/palette';

const activitiModdleDescriptor = require('./../process-editor/services/activiti.json');

const customPaletteModule = {
    paletteProvider: ['type', PaletteProvider]
};

/** @deprecated: bpmnjs-properties */
@Injectable()
export class BpmnFactoryWithPropertiesService extends BpmnFactoryService {
    protected getBpmnPropertiesPanelConfig() {
        const camundaDescriptors = false;

        return {
            additionalModules: [
                propertiesPanelModule,
                customPaletteModule,
                ...(camundaDescriptors ? camundaPropertiesProviderModule : bpmnPropertiesProviderModule)
            ],
            moddleExtensions: { activiti: activitiModdleDescriptor }
        };
    }
}
