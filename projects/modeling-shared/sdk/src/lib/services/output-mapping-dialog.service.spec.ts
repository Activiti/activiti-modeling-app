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

import { OutputMappingDialogService } from './output-mapping-dialog.service';
import { MappingValueType } from './mapping-dialog.service';

describe('OutputMappingDialogService', () => {
    let outputMappingDialogService: OutputMappingDialogService;
    beforeEach(() => {
        outputMappingDialogService = new OutputMappingDialogService(null);
    });

    it('should return false when validating a mapping with empty keys', () => {
        expect(outputMappingDialogService.validateMapping([{ id: '', name: '', value: 'a string', type: 'string', mappingValueType: MappingValueType.variable }]))
            .toBeFalsy();
        expect(outputMappingDialogService.validateMapping([{ id: undefined, name: undefined, value: 'a string', type: 'string', mappingValueType: MappingValueType.variable }]))
            .toBeFalsy();
        expect(outputMappingDialogService.validateMapping([{ id: null, name: null, value: 'a string', type: 'string', mappingValueType: MappingValueType.variable }]))
            .toBeFalsy();
        expect(outputMappingDialogService.validateMapping([{ id: 'var', name: 'var', value: '', type: 'string', mappingValueType: MappingValueType.expression }]))
            .toBeFalsy();
        expect(outputMappingDialogService.validateMapping([{ id: 'var', name: 'var', value: undefined, type: 'string', mappingValueType: MappingValueType.expression }]))
            .toBeFalsy();
        expect(outputMappingDialogService.validateMapping([{ id: 'var', name: 'var', value: null, type: 'string', mappingValueType: MappingValueType.expression }]))
            .toBeFalsy();

    });

    it('should return true when validating a valid mapping', () => {
        expect(outputMappingDialogService.validateMapping([{ id: 'var', name: 'var', value: '', type: 'string', mappingValueType: MappingValueType.variable }]))
            .toBeTruthy();
        expect(outputMappingDialogService.validateMapping([{ id: 'var', name: 'var', value: undefined, type: 'string', mappingValueType: MappingValueType.variable }]))
            .toBeTruthy();
        expect(outputMappingDialogService.validateMapping([{ id: 'var', name: 'var', value: null, type: 'string', mappingValueType: MappingValueType.variable }]))
            .toBeTruthy();
        expect(outputMappingDialogService.validateMapping([{ id: 'var', name: 'var', value: 'a string', type: 'string', mappingValueType: MappingValueType.variable }]))
            .toBeTruthy();
        expect(outputMappingDialogService.validateMapping([{ id: 'var', name: 'var', value: '${"a string"}', type: 'string', mappingValueType: MappingValueType.expression }]))
            .toBeTruthy();
    });
});
