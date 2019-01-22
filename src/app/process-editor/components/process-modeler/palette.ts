 /*!
 * @license
 * Copyright 2018 Alfresco, Inc. and/or its affiliates.
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

export function PaletteProvider(
    palette: any,
    create: any,
    elementFactory: any,
    spaceTool: any,
    lassoTool: any,
    handTool: any,
    globalConnect: any
) {
    this._create = create;
    this._elementFactory = elementFactory;
    this._spaceTool = spaceTool;
    this._lassoTool = lassoTool;
    this._handTool = handTool;
    this._globalConnect = globalConnect;
    palette.registerProvider(this);
}

PaletteProvider['$inject'] = [
    'palette',
    'create',
    'elementFactory',
    'spaceTool',
    'lassoTool',
    'handTool',
    'globalConnect'
];

PaletteProvider.prototype.getPaletteEntries = function(element: any) {
    const actions = {},
        create = this._create,
        elementFactory = this._elementFactory,
        spaceTool = this._spaceTool,
        lassoTool = this._lassoTool,
        handTool = this._handTool,
        globalConnect = this._globalConnect;

    function createAction(
        type: string,
        group: string,
        className: string,
        title: string = null,
        options: any = {}
    ) {
        function createListener(event: any) {
            const shape = elementFactory.createShape(
                Object.assign({ type: type }, options)
            );
            if (options) {
                shape.businessObject.di.isExpanded = options.isExpanded;
            }
            create.start(event, shape);
        }

        return {
            group: group,
            className: className,
            title: title || 'Create ' + type.replace(/^bpmn\:/, ''),
            action: {
                dragstart: createListener,
                click: createListener
            }
        };
    }

    Object.assign(actions, {
        'hand-tool': {
            group: 'tools',
            className: 'bpmn-icon-hand-tool',
            title: 'Activate the hand tool',
            action: {
                click: function(event) {
                    handTool.activateHand(event);
                }
            }
        },
        'global-connect-tool': {
            group: 'tools',
            className: 'bpmn-icon-connection-multi',
            title: 'Activate the global connect tool',
            action: {
                click: function(event) {
                    globalConnect.toggle(event);
                }
            }
        },
        'space-tool': {
            group: 'advanced',
            className: 'bpmn-icon-space-tool',
            title: 'Activate the create/remove space tool',
            action: {
                click: function(event: any) {
                    spaceTool.activateSelection(event);
                }
            }
        },
        'lasso-tool': {
            group: 'advanced',
            className: 'bpmn-icon-lasso-tool',
            title: 'Activate the lasso tool',
            action: {
                click: function(event: any) {
                    lassoTool.activateSelection(event);
                }
            }
        },
        'tool-separator-advanced': {
            group: 'advanced',
            separator: true
        },
        'create.start-event': createAction(
            'bpmn:StartEvent',
            'event',
            'bpmn-icon-start-event-none'
        ),
        'create.end-event': createAction(
            'bpmn:EndEvent',
            'event',
            'bpmn-icon-end-event-none'
        ),
        'tool-separator-event': {
            group: 'event',
            separator: true
        },

        'create.gateway-none': createAction(
            'bpmn:Gateway',
            'gateway',
            'bpmn-icon-gateway-none'
        ),
        'tool-separator-gateway': {
            group: 'gateway',
            separator: true
        },

        'create.user-task': createAction(
            'bpmn:UserTask',
            'activity',
            'bpmn-icon-user-task',
            'UserTask'
        ),

        'create-service-task': createAction(
            'bpmn:ServiceTask',
            'activity',
            'bpmn-icon-service-task',
            'ServiceTask'
        ),

        'create.callActivity': createAction(
            'bpmn:CallActivity',
            'activity',
            'bpmn-icon-call-activity',
            'CallActivity'
        )
    });

    return actions;
};
