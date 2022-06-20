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

export function CustomContextPadProvider(config, contextPad, create, elementFactory, injector, translate) {
    const contextPadProvider = new CustomContextPad(config, contextPad, create, elementFactory, injector, translate);

    contextPad.registerProvider(contextPadProvider);
}

export default class CustomContextPad {

    private create;
    private elementFactory;
    private translate;
    private autoPlace;

    constructor(config, contextPad, create, elementFactory, injector, translate) {
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;

        if (config.autoPlace !== false) {
            this.autoPlace = injector.get('autoPlace', false);
        }
    }

    getContextPadEntries(element) {
        const {
            autoPlace,
            create,
            elementFactory,
            translate
        } = this;

        function appendGateway(event, gatewayElement) {
            if (autoPlace) {
                const shape = elementFactory.createShape({ type: 'bpmn:Gateway' });

                autoPlace.append(gatewayElement, shape);
            } else {
                appendGatewayStart(event);
            }
        }

        function appendGatewayStart(event) {
            const shape = elementFactory.createShape({ type: 'bpmn:Gateway' });

            create.start(event, shape, element);
        }

        return {
            'append.gateway': {
                group: 'model',
                className: 'bpmn-icon-gateway-none',
                title: translate('Append Gateway'),
                action: {
                    click: appendGateway,
                    dragstart: appendGatewayStart
                }
            }
        };
    }
}

CustomContextPadProvider.$inject = [
    'config',
    'contextPad',
    'create',
    'elementFactory',
    'injector',
    'translate'
];

export const CustomContextPadProviderBpmnJsModule = {
    __init__: ['customContextPad'],
    customContextPad: ['type', CustomContextPadProvider]
};
