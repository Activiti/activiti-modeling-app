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

import { PaletteElement } from '@alfresco-dbp/modeling-shared/sdk';

export const paletteElements: PaletteElement[] = [
    {
        group: 'tool',
        type: 'hand-tool',
        icon: 'bpmn-icon-hand-tool',
        title: 'PROCESS_EDITOR.PALETTE.HAND_TOOL',
        clickable: true,
        draggable: false
    },
    {
        group: 'tool',
        type: 'connect-tool',
        icon: 'bpmn-icon-connection-multi',
        title: 'PROCESS_EDITOR.PALETTE.CONNECT_TOOL',
        clickable: true,
        draggable: false
    },
    {
        group: 'tool',
        type: 'space-tool',
        icon: 'bpmn-icon-space-tool',
        title: 'PROCESS_EDITOR.PALETTE.SPACE_TOOL',
        clickable: true,
        draggable: false
    },
    {
        group: 'tool',
        type: 'lasso-tool',
        icon: 'bpmn-icon-lasso-tool',
        title: 'PROCESS_EDITOR.PALETTE.LASSO_TOOL',
        clickable: true,
        draggable: false
    },
    { group: 'separator' },
    {
        group: 'element',
        type: 'bpmn:StartEvent',
        icon: 'bpmn-icon-start-event-none',
        title: 'PROCESS_EDITOR.PALETTE.START_EVENT',
        clickable: true,
        draggable: true
    },
    {
        group: 'element',
        type: 'bpmn:EndEvent',
        icon: 'bpmn-icon-end-event-none',
        title: 'PROCESS_EDITOR.PALETTE.END_EVENT',
        clickable: true,
        draggable: true
    },
    {
        group: 'element',
        type: 'bpmn:IntermediateThrowEvent',
        icon: 'bpmn-icon-intermediate-event-none',
        title: 'PROCESS_EDITOR.PALETTE.INTERMEDIATE_THROW_EVENT',
        clickable: true,
        draggable: true
    },
    { group: 'separator' },
    {
        group: 'element',
        type: 'bpmn:Gateway',
        icon: 'bpmn-icon-gateway-none',
        title: 'PROCESS_EDITOR.PALETTE.GATEWAY',
        clickable: true,
        draggable: true
    },
    { group: 'separator' },
    {
        group: 'element',
        type: 'bpmn:UserTask',
        icon: 'bpmn-icon-user-task',
        title: 'PROCESS_EDITOR.PALETTE.USER_TASK',
        clickable: true,
        draggable: true
    },
    {
        group: 'element',
        type: 'bpmn:ServiceTask',
        icon: 'bpmn-icon-service-task',
        title: 'PROCESS_EDITOR.PALETTE.SERVICE_TASK',
        clickable: true,
        draggable: true
    },
    {
        group: 'element',
        type: 'bpmn:CallActivity',
        icon: 'bpmn-icon-call-activity',
        title: 'PROCESS_EDITOR.PALETTE.CALL_ACTIVITY',
        clickable: true,
        draggable: true
    },
    {
        group: 'element',
        type: 'bpmn:SubProcess',
        icon: 'bpmn-icon-subprocess-expanded',
        title: 'PROCESS_EDITOR.PALETTE.SUB_PROCESS',
        clickable: true,
        draggable: true,
        options: {
            isExpanded: true
        }
    },
    { group: 'separator' },
    {
        group: 'element',
        type: 'bpmn:Participant',
        icon: 'bpmn-icon-participant',
        title: 'PROCESS_EDITOR.PALETTE.PARTICIPANT',
        clickable: true,
        draggable: true
    }
];
