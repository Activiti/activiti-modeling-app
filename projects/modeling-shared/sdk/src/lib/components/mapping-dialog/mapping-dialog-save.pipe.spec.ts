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

import { InputMappingDialogService } from '../../services/input-mapping-dialog.service';
import { VariableMappingType } from '../../services/mapping-dialog.service';
import { OutputMappingDialogService } from '../../services/output-mapping-dialog.service';
import { MappingDialogSavePipe } from './mapping-dialog-save.pipe';

describe('MappingDialogSavePipe', () => {

    let pipe: MappingDialogSavePipe;
    let inputService: InputMappingDialogService;
    let outputService: OutputMappingDialogService;

    beforeEach(() => {
        inputService = new InputMappingDialogService([]);
        outputService = new OutputMappingDialogService([]);

        pipe = new MappingDialogSavePipe(inputService, outputService);

        spyOn(inputService, 'validateMapping');
        spyOn(outputService, 'validateMapping');
    });

    it('call input mapping validation when mapping type is input', () => {
        pipe.transform([], VariableMappingType.input, 0);

        expect(inputService.validateMapping).toHaveBeenCalledWith([]);
    });

    it('call output mapping validation when mapping type is input', () => {
        pipe.transform([], VariableMappingType.output, 0);

        expect(outputService.validateMapping).toHaveBeenCalledWith([]);
    });
});
