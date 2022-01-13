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

@Pipe({
    name: 'displayAddMenu'
})
export class DisplayAddMenuPipe implements PipeTransform {

    private static readonly ADD_BUTTON_TYPES = ['object', 'allOf', 'anyOf', 'oneOf'];

    transform(types: string[]): boolean {
        let count = 0;

        DisplayAddMenuPipe.ADD_BUTTON_TYPES.forEach(type => {
            if (types.indexOf(type) !== -1) {
                count++;
            }
        });

        return count > 1;
    }

}
