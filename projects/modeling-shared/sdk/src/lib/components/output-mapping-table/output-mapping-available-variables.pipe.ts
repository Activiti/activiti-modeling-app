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
import { ProcessEditorElementVariable, ServiceParameterMapping } from '../../api/types';

@Pipe({ name: 'outputMappingAvailableVariable' })
export class OutputMappingAvailableVariablePipe implements PipeTransform {

    transform(processProperties: ProcessEditorElementVariable[], mapping: ServiceParameterMapping, parameterName: string): ProcessEditorElementVariable[] {
        let availableVariables: ProcessEditorElementVariable[] = [...processProperties];

        if (mapping) {
            const variablesMapped = Object.keys(mapping).filter(variable => mapping[variable].value !== parameterName);
            availableVariables = [];
            processProperties.forEach(element => {
                const variables = element.variables.filter(variable => !variablesMapped.find(mapped => mapped === variable.name));
                if (variables && variables.length > 0) {
                    availableVariables.push({
                        source: element.source,
                        variables
                    });
                }
            });
        }

        return availableVariables;
    }
}
