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
import { BpmnProperty, CardViewProcessNameValidator, createProcessModelName } from '@alfresco-dbp/modeling-shared/sdk';
import { FactoryProps } from './cardview-properties.factory';
import { CardViewProcessNameItemModel } from './process-name-item/process-name-item.model';

const propertyName = BpmnProperty.processName;

export function createProcessNameProperty({ element }: FactoryProps) {
    return new CardViewProcessNameItemModel({
        label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.PROCESS_NAME',
        value: createProcessModelName(ElementHelper.getProperty(element, propertyName)),
        key: propertyName,
        data: { id: element.id, element },
        validators: [new CardViewProcessNameValidator('PROCESS_EDITOR.ELEMENT_PROPERTIES.INVALID_PROCESS_NAME')]
    });
}
