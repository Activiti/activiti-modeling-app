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

import { Pipe, PipeTransform } from '@angular/core';
import { EntityProperty } from '../../api/types';
import { ModelingJSONSchemaService } from '../../services/modeling-json-schema.service';

@Pipe({ name: 'variablePrimitiveType' })
export class VariablePrimitiveTypePipe implements PipeTransform {

    constructor(private modelingJSONSchemaService: ModelingJSONSchemaService) { }

    transform(variable: string | EntityProperty): string[] {
        if (typeof variable === 'string') {
            return [this.modelingJSONSchemaService.getMappingPrimitiveTypeForString(variable)].filter(type => !!type);
        } else {
            return this.modelingJSONSchemaService.getMappingPrimitiveTypeForEntityProperty(variable);
        }
    }
}
