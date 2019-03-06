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

import { Component, Input } from '@angular/core';

@Component({
    templateUrl: './palette.component.html',
    selector: 'ama-palette'
})
export class PaletteComponent {

    opened = 'isOpen';

    paletteIcons = [
        {
            icon: 'bpmn-icon-hand-tool',
            title: 'Activate the hand tool',
            children: null
        },
        {
            icon: 'bpmn-icon-connection-multi',
            title: 'Activate the global connect tool',
            children: null
        },
        {
            icon: 'bpmn-icon-space-tool',
            title: 'Activate the create/remove space tool',
            children: null
        },
        {
            icon: 'bpmn-icon-lasso-tool',
            title: 'Activate the lasso tool',
            children: null
        },
        {
            icon: 'bpmn-icon-start-event-none',
            title: 'Create Start Event',
            children: null
        },
        {
            icon: 'bpmn-icon-end-event-none',
            title: 'Create End Event',
            children: null
        },
        {
            icon: 'bpmn-icon-gateway-none',
            title: 'Create Gateway',
            children: null
        },
        {
            icon: 'bpmn-icon-user-task',
            title: 'User Task',
            children: null
        },
        {
            icon: 'bpmn-icon-service-task',
            title: 'Service Task',
            children: null
        },
        {
            icon: 'bpmn-icon-send-task',
            title: 'Dedicated services',
            children: [
                {
                    icon: 'bpmn-icon-receive-task',
                    title: 'Dedicated service1',
                },
                {
                    icon: 'bpmn-icon-receive-task',
                    title: 'Dedicated service2',
                },
                {
                    icon: 'bpmn-icon-receive-task',
                    title: 'Dedicated service3',
                }
            ]
        },
        {
            icon: 'bpmn-icon-call-activity',
            title: 'Call Activity',
            children: null
        }
    ];

    @Input()
    connectedDropLists: string[] = [];
    draggingItemType: string;

    constructor(
    ) {}

    createShape(event) {

    }
}
