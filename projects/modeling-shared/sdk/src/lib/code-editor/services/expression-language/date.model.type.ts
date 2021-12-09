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

import { ModelingType } from '../modeling-type.model';
import { jsonModelType } from './json.model.type';

export const dateModelType: ModelingType = {
    id: 'date',
    properties: jsonModelType.properties,
    methods: [[
        {
            signature: 'after',
            type: 'boolean',
            documentation: 'Tests if this date is after the specified date.',
            parameters: [
                {
                    label: 'date',
                    documentation: 'date: date – the reference object with which to compare'
                }
            ]
        },
        {
            signature: 'before',
            type: 'boolean',
            documentation: 'Tests if this date is before the specified date.',
            parameters: [
                {
                    label: 'date',
                    documentation: 'date: date – the reference object with which to compare'
                }
            ]
        },
        {
            signature: 'compareTo',
            type: 'integer',
            documentation: 'Compares two Dates for ordering.',
            parameters: [
                {
                    label: 'anotherDate',
                    documentation: 'anotherDate: date – the date to be compared'
                }
            ]
        },
        {
            signature: 'getTime',
            type: 'integer',
            documentation: 'Returns the number of milliseconds since January 1, 1970, 00:00:00 GMT represented by this Date object.'
        },
        {
            signature: 'setTime',
            type: 'null',
            documentation: 'Sets this Date object to represent a point in time that is time milliseconds after January 1, 1970 00:00:00 GMT.',
            parameters: [
                {
                    label: 'time',
                    documentation: 'time: integer – the number of milliseconds'
                }
            ]
        }

    ], jsonModelType.methods].flat()
};
