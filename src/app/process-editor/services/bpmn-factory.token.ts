import { InjectionToken } from '@angular/core';
export const BpmnFactoryToken = new InjectionToken('BpmnFactoryToken');

export interface ModelerInitOptions {
    clickHandler: (event) => any | void;
    changeHandler: (event) => any | void;
    removeHandler: (event) => any | void;
    selectHandler: (event) => any | void;
}

export interface BpmnFactory {
    create(modelerInitOptions: ModelerInitOptions): Bpmn.Modeler;
}
