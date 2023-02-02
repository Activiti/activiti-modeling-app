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
import { DescriptionItemModel } from './description-item/description-item.model';
import { MaxLengthPropertyValidator } from './validators/max-length-property.validator';

const propertyName = BpmnProperty.description;

export function createDescriptionProperty({ element }: FactoryProps) {
    return new DescriptionItemModel({
        label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.DESCRIPTION',
        value: ElementHelper.getProperty(element, propertyName),
        key: propertyName,
        editable: true,
        default: '',
        data: { id: element.id, element },
        validators: [new MaxLengthPropertyValidator(4000, 'PROCESS_EDITOR.ELEMENT_PROPERTIES.INVALID_DESCRIPTION_LENGTH')]
    });
}
