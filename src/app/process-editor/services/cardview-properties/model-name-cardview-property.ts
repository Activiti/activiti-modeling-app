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

import { CardViewTextItemModel } from '@alfresco/adf-core';
import { ElementHelper } from '../bpmn-js/element.helper';
import { BpmnProperty, sanitizeString, CardViewModelNameValidator } from '@alfresco-dbp/modeling-shared/sdk';
import { FactoryProps } from './cardview-properties.factory';

const propertyName = BpmnProperty.modelName;

export function createModelNameProperty({ element }: FactoryProps) {
    return new CardViewTextItemModel({
        label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.MODEL_NAME',
        value: sanitizeString(ElementHelper.getProperty(element, propertyName)),
        key: propertyName,
        default: '',
        multiline: false,
        editable: true,
        data: { id: element.id },
        validators: [new CardViewModelNameValidator('PROCESS_EDITOR.ELEMENT_PROPERTIES.INVALID_PROCESS_NAME')]
    });
}
