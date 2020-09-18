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

import { Injectable } from '@angular/core';
import { ServiceParameterMappings } from '../api/types';
import { VariableMappingBehavior } from '../interfaces/variable-mapping-type.interface';

@Injectable({
    providedIn: 'root'
})
export class VariableMappingTypeService {

    static mappingTypeList = [
        VariableMappingBehavior.MAP_ALL,
        VariableMappingBehavior.MAP_ALL_INPUTS,
        VariableMappingBehavior.MAP_ALL_OUTPUTS
    ];

    static getDefaultMappingBehavior(mapping: ServiceParameterMappings) {
        if (!mapping) {
            return VariableMappingBehavior.MAP_NO_VARIABLE;
        } else if (VariableMappingTypeService.isMappingEmpty(mapping) && mapping.mappingType) {
            return mapping.mappingType;
        }
        return VariableMappingBehavior.MAP_VARIABLE;
    }

    static getMappingValue(mappingBehavior: VariableMappingBehavior) {
        if ( VariableMappingTypeService.mappingTypeList.indexOf(mappingBehavior) >= 0) {
            return { mappingType: mappingBehavior };
        } else if ( mappingBehavior === VariableMappingBehavior.MAP_NO_VARIABLE) {
            return { inputs: {}, outputs: {}};
        }
        return {};

    }

    private static isMappingEmpty(mapping: ServiceParameterMappings): boolean {
        return !mapping.inputs && !mapping.outputs;
    }
}
