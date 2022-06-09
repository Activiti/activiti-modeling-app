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

import { MappingType } from '../api/types';
import { InputMappingDialogService } from './input-mapping-dialog.service';
import { MappingRowModel } from './mapping-dialog.service';

describe('InputMappingDialogService', () => {
    let inputMappingDialogService: InputMappingDialogService;
    beforeEach(() => {
        inputMappingDialogService = new InputMappingDialogService(null);
    });

    it('should create mapping from data', () => {
        const source = [
            { name: 'name1', value: 'value-1', type: 'string' },
            { name: 'name2', value: 'value-2', type: 'string' },
            { name: 'name3', value: null, type: 'string' }
        ] as MappingRowModel[];

        const output = {
            'name1' : { type: MappingType.value, value: 'value-1' },
            'name2': { type: MappingType.value, value: 'value-2' },
            'name3': { type: MappingType.value, value: null }
        } as any;

        const mapping = inputMappingDialogService.createMappingFromDataSource(source);

        expect(mapping).toEqual(output);
    });

    it('should return true when validating the input mapping', () => {
        expect(inputMappingDialogService.validateMapping()).toBeTruthy();
    });
});
