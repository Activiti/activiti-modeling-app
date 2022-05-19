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

export const jsonModelType: ModelingType = {
    id: 'json',
    properties: [],
    methods: [
        {
            signature: 'equals',
            type: 'boolean',
            documentation: 'Indicates whether some other object is "equal to" this one.',
            parameters: [
                {
                    label: 'obj',
                    documentation: 'obj: object - the reference object with which to compare'
                }
            ]
        },
        {
            signature: 'hashCode',
            type: 'integer',
            documentation: 'Returns a hash code value for the object. This method is supported for the benefit of hash tables such as those provided by java.util.HashMap.'
        },
        {
            signature: 'toString',
            type: 'string',
            documentation: 'Returns a string representation of the object. In general, the toString method returns a string that "textually represents" this object.'
        }
    ]
};
