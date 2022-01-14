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

export const enumModelType: ModelingType = {
    id: 'json',
    properties: [],
    methods: [[
        {
            signature: 'compareTo',
            type: 'integer',
            documentation: 'Compares this enum with the specified object for order.',
            parameters: [
                {
                    label: 'anotherEnum',
                    documentation: 'anotherEnum: enum – the enum with which to compare'
                }
            ]
        },
        {
            signature: 'name',
            type: 'string',
            documentation: 'Returns the name of this enum constant, exactly as declared in its enum declaration.'
        },
        {
            signature: 'ordinal',
            type: 'integer',
            documentation: 'Returns the ordinal of this enumeration constant (its position in its enum declaration, where the initial constant is assigned an ordinal of zero).'
        }
    ], jsonModelType.methods].flat()
};
