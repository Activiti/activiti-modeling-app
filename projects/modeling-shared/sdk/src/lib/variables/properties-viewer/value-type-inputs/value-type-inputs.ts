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

import { Type, InjectionToken } from '@angular/core';
import { JSONSchemaInfoBasics } from '../../../api/types';
import { primitiveTypesSchema } from '../../expression-code-editor/services/expression-language/primitive-types-schema';

export const INPUT_TYPE_ITEM_HANDLER = new InjectionToken<InputTypeItem[]>('input-type-item-handlers');

export interface InputTypeItem {
    type: string;
    primitiveType: string;
    model?: JSONSchemaInfoBasics;
    implementationClass: Type<any>;
}

export function provideInputTypeItemHandler(type: string, implementationClass: Type<any>, primitiveType?: string, model?: JSONSchemaInfoBasics) {
    return {
        provide: INPUT_TYPE_ITEM_HANDLER,
        useValue: {
            type,
            primitiveType: primitiveType || type,
            model: model || primitiveTypesSchema.$defs.primitive[type],
            implementationClass: implementationClass
        },
        multi: true
    };
}
