import { handlers } from './property-handlers/property.handlers';
import { BpmnProperty } from '../bpmn/properties';

export const ElementHelper = {
    getType(element: Bpmn.DiagramElement): string {
        return element.businessObject.$type;
    },

    getProperty(element: Bpmn.DiagramElement, propertyName: BpmnProperty): any {
        try {
            const handler = getHandler(propertyName);
            const get = handler.get;
            return get(element);
        } catch (error) {
            /*tslint:disable-next-line*/
            console.error(`Handler::get is not defined for ${propertyName}`, error);
            return null;
        }
    },

    setProperty(modeling: Bpmn.Modeling, element: Bpmn.DiagramElement, propertyName: BpmnProperty, value: any): void {
        try {
            const handler = getHandler(propertyName);
            const set = handler.set;

            set(modeling, element, value);
        } catch (error) {
            /*tslint:disable-next-line*/
            console.error(`Handler::set is not defined for ${propertyName}`, error);
        }
    }
};

function getHandler(propertyName) {
    return handlers[propertyName];
}
