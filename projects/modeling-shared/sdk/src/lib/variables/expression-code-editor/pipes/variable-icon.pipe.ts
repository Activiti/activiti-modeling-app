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
import { EntityProperty } from '../../../api/types';

@Pipe({
    name: 'variableIcon'
})
export class VariableIconPipe implements PipeTransform {

    transform(variable: EntityProperty): string {
        if (!variable) {
            return '';
        }

        if (!variable.aggregatedTypes || variable.aggregatedTypes.length === 1) {
            switch (variable.type) {
            case 'datetime':
                return 'dt';
            case 'folder':
                return 'fo';
            default:
                return variable.type && variable.type.length > 0 ? variable.type.trim().substring(0, 1).toLowerCase() : '?';
            }
        } else {
            return 'm';
        }
    }

}
