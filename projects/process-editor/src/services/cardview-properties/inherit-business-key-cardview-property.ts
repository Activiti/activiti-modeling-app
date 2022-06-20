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

import { ElementHelper } from '../bpmn-js/element.helper';
import { BpmnProperty } from '@alfresco-dbp/modeling-shared/sdk';
import { FactoryProps } from './interfaces/cardview-properties.interfaces';
import { CardViewBoolItemModel } from '@alfresco/adf-core';

const propertyName = BpmnProperty.inheritBusinessKey;

export function createInheritBusinessKeyProperty({ element }: FactoryProps) {
    return new CardViewBoolItemModel({
        label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.INHERIT_BUSINESS_KEY',
        value: ElementHelper.getProperty(element, propertyName),
        key: propertyName,
        default: false,
        editable: true,
        data: { id: element.id }
    });
}
