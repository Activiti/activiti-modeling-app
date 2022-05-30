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
import { ExpressionSyntax } from '../../api/types';

@Pipe({
    name: 'mappingDialogSelectedTab'
})
export class MappingDialogSelectedTabPipe implements PipeTransform {

    transform(
        selectedTag: number,
        type: string,
        tabCheck: number,
        enableVariableSelection: boolean,
        enableValueSelection: boolean,
        expressionSyntax: ExpressionSyntax): boolean {
        if (selectedTag !== tabCheck) {
            return false;
        }
        let expectedTag = 0;

        switch (type) {
            case 'expression':
                if (expressionSyntax === ExpressionSyntax.NONE) {
                    return false;
                }
                expectedTag = 2;
                expectedTag = enableVariableSelection ? expectedTag : expectedTag - 1;
                expectedTag = enableValueSelection ? expectedTag : expectedTag - 1;
                break;
            case 'value':
                if (!enableValueSelection) {
                    return false;
                }
                expectedTag = 1;
                expectedTag = enableVariableSelection ? expectedTag : expectedTag - 1;
                break;
            case 'variable':
                if (!enableVariableSelection) {
                    return false;
                }
                break;
            default:
                break;
        }

        return selectedTag === expectedTag;
    }

}
