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
import { ElementVariable, ProcessEditorElementVariable } from '../../api/types';

@Pipe({ name: 'variableIdFromVariableName' })
export class VariableIdFromVariableNamePipe implements PipeTransform {

    transform(variableName: string, editorVariables: ProcessEditorElementVariable[]): string {
        return this.getVariablesList(editorVariables).find(variable => variable.name === variableName)?.id;
    }

    private getVariablesList(variables: ProcessEditorElementVariable[]): ElementVariable[] {
        let vars: ElementVariable[] = [];
        if (variables) {
            variables.filter((variable) => variable.variables && variable.variables.length > 0).forEach((element) => vars = vars.concat(element.variables));
        }
        return vars;
    }
}
