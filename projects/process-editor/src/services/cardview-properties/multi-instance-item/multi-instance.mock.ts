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

import { MultiInstanceItemModel } from './multi-instance.item.model';

export const elementMock = {
    '$type': 'bpmn:SubProcess',
    'id': 'SubProcess_17k',
    'loopCharacteristics': {
        '$type': 'bpmn:MultiInstanceLoopCharacteristics',
        'loopCardinality': {
            '$type': 'bpmn:Expression',
            'body': '${expression}'
        },
        'isSequential': false,
        set: () => null
    },
};

export const loopCharacteristicsMock: any = {
    'loopCharacteristics': {
        '$type': 'bpmn:Expression',
        'body': '${expression}'
    }
};

export const propertyMock = new MultiInstanceItemModel({
    label: '',
    value: '',
    key: '',
    data: {
        element: {
            businessObject: elementMock
        }
    }
});

export const appConfigMock = {
    'process-modeler.multi-instance-types': [
        {
            'key': 'none',
            'label': 'None'
        },
        {
            'key': 'parallel',
            'label': 'Parallel'
        },
        {
            'key': 'sequence',
            'label': 'Sequence'
        }
    ]
};
