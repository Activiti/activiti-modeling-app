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

import { FactoryProps } from './cardview-properties.factory';
import { BpmnCompositeProperty } from '@alfresco-dbp/modeling-shared/sdk';
import { CardViewTaskAssignmentItemModel } from './task-assignment-item/task-assignment-item.model';

const propertyName = BpmnCompositeProperty.assignment;

export function createAssignmentProperty({ element }: FactoryProps) {
    return new CardViewTaskAssignmentItemModel({
        label: '',
        value: '',
        key: propertyName,
        default: '',
        editable: false
    });
}
