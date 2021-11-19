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

import { ServiceParameterMapping, MappingType, ProcessEditorElementWithVariables, ProcessEditorElementVariable } from '../../api/types';

/* cSpell:disable */
export const mockValueMapping: ServiceParameterMapping = {
    'dName': {
        type: MappingType.value,
        value: '${Dropdown009gay.name}'
    },
    'rName': {
        type: MappingType.value,
        value: '${Radiobuttons0wuhxs.name}'
    }
};

export const mockDropDownFields = [
    {
        'id': 'Dropdown009gay',
        'name': '${Dropdown009gay.id}',
        'type': 'string',
        'mappingValueType': 'expression',
        'description': 'Dropdown'
    },
    {
        'id': 'Dropdown009gay',
        'name': '${Dropdown009gay.name}',
        'type': 'string',
        'mappingValueType': 'expression',
        'description': 'Dropdown'
    },
    {
        'id': 'Radiobuttons0wuhxs',
        'name': '${Radiobuttons0wuhxs.id}',
        'type': 'string',
        'mappingValueType': 'expression',
        'description': 'Radio buttons'
    },
    {
        'id': 'Radiobuttons0wuhxs',
        'name': '${Radiobuttons0wuhxs.name}',
        'type': 'string',
        'mappingValueType': 'expression',
        'description': 'Radio buttons'
    },
    {
        'id': 'Text0yru6p',
        'label': 'Text',
        'name': 'Text0yru6p',
        'type': 'string',
        'description': 'Text'
    }
];

export const mockDropDownProcessVariable = [
    {
        'id': '9c23dcf0-6cab-480e-b6f0-a11f37b28ef5',
        'name': 'dId',
        'type': 'string',
        'value': '',
        'required': false
    },
    {
        'id': '2beb4fd9-dd04-4413-993b-1c102b88e60d',
        'name': 'dName',
        'type': 'string',
        'value': '',
        'required': false
    },
    {
        'id': 'bafd3af0-e73e-490f-a85f-8798b31f7242',
        'name': 'rId',
        'type': 'string',
        'value': '',
        'required': false
    },
    {
        'id': '87a99fda-ff12-4ec4-a516-27415e7bd2d0',
        'name': 'rName',
        'type': 'string',
        'value': '',
        'required': false
    },
    {
        'id': '00dfb893-f44b-49f2-aefb-4269b293d3d3',
        'name': 'text',
        'type': 'string',
        'value': '',
        'required': false
    }
];

export const pipeProcessProperties: ProcessEditorElementVariable[] = [
    {
        'source': {
            'name': 'process',
            'type': ProcessEditorElementWithVariables.Process,
            'subtype': 'bpmn:Process'
        },
        'variables': [
            {
                'id': 'var-string-1-id',
                'name': 'var-string-1',
                'type': 'string',
                'icon': 's',
                'tooltip': ''
            }
        ]
    },
    {
        'source': {
            'name': 'service task',
            'type': ProcessEditorElementWithVariables.ServiceTask,
            'subtype': 'bpmn:ServiceTask'
        },
        'variables': [
            {
                'id': 'var-string-2-id',
                'name': 'var-string-2',
                'type': 'string',
                'icon': 's',
                'tooltip': ''
            }
        ]
    },
    {
        'source': {
            'name': 'call activity',
            'type': ProcessEditorElementWithVariables.CalledElement,
            'subtype': 'bpmn:CallActivity'
        },
        'variables': [
            {
                'id': 'var-string-3-id',
                'name': 'var-string-3',
                'type': 'string',
                'icon': 's',
                'tooltip': ''
            }
        ]
    },
    {
        'source': {
            'name': 'start event',
            'type': ProcessEditorElementWithVariables.StartEvent,
            'subtype': 'bpmn:StartEvent'
        },
        'variables': [
            {
                'id': 'var-string-4-id',
                'name': 'var-string-4',
                'type': 'string',
                'icon': 's',
                'tooltip': ''
            }
        ]
    }
];

export const pipeMapping: ServiceParameterMapping = {
    'var-string-1': {
        'type': MappingType.variable,
        'value': 'task-output-1'
    },
    'var-string-2': {
        'type': MappingType.variable,
        'value': 'task-output-2'
    }
};

/* cSpell:enable */
