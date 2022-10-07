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

import { ProcessEditorElementWithVariables } from '../../../api/types';

export const mockProcessVariables = [
    {
        source: {
            name: 'Process',
            type: ProcessEditorElementWithVariables.Process
        },
        variables: [
            {
                id: '1',
                name: 'var1',
                type: 'string'
            },
            {
                id: '2',
                name: 'var2',
                type: 'date'
            },
            {
                id: 'stringVarId',
                name: 'stringVar',
                type: 'string'
            }
        ]
    }
];

export const mockOutputParameters = [{
    id: 'id1',
    name: 'name',
    description: 'desc',
    type: 'string'
}, {
    id: 'idToFilter',
    name: 'variables.filterMe',
    description: 'this is the parameter that needs to be filtered',
    type: 'string'
}];

export const mockSystemTaskAssigneeParameter =  {
    description: 'This is a mock system assignee task variable',
    id: 'sys_task_assignee',
    name: 'sys_task_assignee',
    type: 'string',
    system: true
};
