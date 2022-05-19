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

export const arrayModelType: ModelingType = {
    id: 'array',
    collectionOf: 'json',
    properties: jsonModelType.properties,
    methods: [[
        {
            signature: 'add',
            type: 'boolean',
            documentation: 'Appends the specified element to the end of this list (optional operation).',
            parameters: [
                {
                    label: 'element',
                    documentation: 'element - element to be appended to this list'
                }
            ]
        },
        {
            signature: 'add',
            type: 'null',
            documentation: 'Inserts the specified element at the specified position in this list (optional operation).',
            parameters: [
                {
                    label: 'index',
                    documentation: 'index - index at which the specified element is to be inserted'
                },
                {
                    label: 'element',
                    documentation: 'element - element to be inserted'
                }
            ]
        },
        {
            signature: 'addAll',
            type: 'boolean',
            // eslint-disable-next-line max-len
            documentation: 'Appends all of the elements in the specified collection to the end of this list, in the order that they are returned by the specified collection\'s iterator (optional operation).',
            parameters: [
                {
                    label: 'c',
                    documentation: 'c - collection containing elements to be added to this list'
                }
            ]
        },
        {
            signature: 'addAll',
            type: 'boolean',
            documentation: 'Inserts all of the elements in the specified collection into this list at the specified position (optional operation).',
            parameters: [
                {
                    label: 'index',
                    documentation: 'index - index at which to insert the first element from the specified collection'
                },
                {
                    label: 'c',
                    documentation: 'c - collection containing elements to be added to this list'
                }
            ]
        },
        {
            signature: 'clear',
            type: 'null',
            documentation: 'Removes all of the elements from this list (optional operation).'
        },
        {
            signature: 'contains',
            type: 'boolean',
            documentation: 'Returns true if this list contains the specified element.',
            parameters: [
                {
                    label: 'o',
                    documentation: 'o - element whose presence in this list is to be tested'
                }
            ]
        },
        {
            signature: 'containsAll',
            type: 'boolean',
            documentation: 'Returns true if this list contains all of the elements of the specified collection.',
            parameters: [
                {
                    label: 'c',
                    documentation: 'c - collection to be checked for containment in this list'
                }
            ]
        },
        {
            signature: 'get',
            type: 'json',
            documentation: 'Returns the element at the specified position in this list.',
            parameters: [
                {
                    label: 'index',
                    documentation: 'index - index of the element to return'
                }
            ],
            isArrayAccessor: true
        },
        {
            signature: 'indexOf',
            type: 'integer',
            documentation: 'Returns the index of the first occurrence of the specified element in this list, or -1 if this list does not contain the element.',
            parameters: [
                {
                    label: 'o',
                    documentation: 'o - element to search for'
                }
            ]
        },
        {
            signature: 'isEmpty',
            type: 'boolean',
            documentation: 'Returns true if this list contains no elements.'
        },
        {
            signature: 'lastIndexOf',
            type: 'integer',
            documentation: 'Returns the index of the last occurrence of the specified element in this list, or -1 if this list does not contain the element.',
            parameters: [
                {
                    label: 'o',
                    documentation: 'o - element to search for'
                }
            ]
        },
        {
            signature: 'remove',
            type: 'json',
            documentation: 'Removes the element at the specified position in this list (optional operation).',
            parameters: [
                {
                    label: 'index',
                    documentation: 'index - the index of the element to be removed'
                }
            ],
            isArrayAccessor: true
        },
        {
            signature: 'remove',
            type: 'boolean',
            documentation: 'Removes the first occurrence of the specified element from this list, if it is present (optional operation).',
            parameters: [
                {
                    label: 'o',
                    documentation: 'o - element to be removed from this list, if present'
                }
            ]
        },
        {
            signature: 'removeAll',
            type: 'boolean',
            documentation: 'Removes from this list all of its elements that are contained in the specified collection (optional operation).',
            parameters: [
                {
                    label: 'c',
                    documentation: 'c - collection containing elements to be removed from this list'
                }
            ]
        },
        {
            signature: 'retainAll',
            type: 'boolean',
            documentation: 'Retains only the elements in this list that are contained in the specified collection (optional operation).',
            parameters: [
                {
                    label: 'c',
                    documentation: 'c - collection containing elements to be retained in this list'
                }
            ]
        },
        {
            signature: 'set',
            type: 'json',
            documentation: 'Replaces the element at the specified position in this list with the specified element (optional operation).',
            parameters: [
                {
                    label: 'index',
                    documentation: 'index - index of the element to replace'
                },
                {
                    label: 'element',
                    documentation: 'element - element to be stored at the specified position'
                }
            ],
            isArrayAccessor: true
        },
        {
            signature: 'size',
            type: 'integer',
            documentation: 'Returns the number of elements in this list.'
        },
        {
            signature: 'subList',
            type: 'array',
            documentation: 'Returns a view of the portion of this list between the specified fromIndex, inclusive, and toIndex, exclusive.',
            parameters: [
                {
                    label: 'fromIndex',
                    documentation: 'fromIndex - low endpoint (inclusive) of the subList'
                },
                {
                    label: 'toIndex',
                    documentation: 'toIndex - high endpoint (exclusive) of the subList'
                }
            ],
            isSameTypeAsObject: true
        },
        {
            signature: 'toArray',
            type: 'array',
            documentation: 'Returns an array containing all of the elements in this list in proper sequence (from first to last element).'
        },

    ], jsonModelType.methods].flat(),
};
