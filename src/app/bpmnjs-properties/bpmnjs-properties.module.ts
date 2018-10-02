import { NgModule } from '@angular/core';
import { BpmnFactoryToken } from '../process-editor/services/bpmn-factory.token';
import { BpmnFactoryWithPropertiesService } from './bpmn-factory-with-properties.service';

/** @deprecated: bpmnjs-properties */
@NgModule({
    providers: [
        { provide: BpmnFactoryToken, useClass: BpmnFactoryWithPropertiesService }
    ]
})
export class BpmnjsPropertiesModule {}
