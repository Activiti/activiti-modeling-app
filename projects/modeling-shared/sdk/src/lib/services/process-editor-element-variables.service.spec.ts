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

import { TranslationMock, TranslationService } from '@alfresco/adf-core';
import { async, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ProcessEditorElementVariablesService } from './process-editor-element-variables.service';
import { provideProcessEditorElementVariablesProvider } from './process-editor-element-variables-provider.service';
import { calledActivitiElement, CalledElementVariablesProviderService, expectedVariables, ProcessElementVariablesProviderService, sequenceFlowElement3, sequenceFlowElement4 } from '../mocks/process-editor.mock';
import { Store } from '@ngrx/store';

describe('ProcessEditorElementVariablesService', () => {
    let service: ProcessEditorElementVariablesService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn()
                    }
                },
                { provide: TranslationService, useClass: TranslationMock },
                provideProcessEditorElementVariablesProvider(ProcessElementVariablesProviderService),
                provideProcessEditorElementVariablesProvider(CalledElementVariablesProviderService)
            ]
        });
    }));

    beforeEach(() => {
        service = TestBed.inject(ProcessEditorElementVariablesService);
    });

    describe('Implicit mapping', () => {
        beforeEach(() => {
            jest.spyOn<any, any>(service, 'isMappingOutputsImplicitly').mockImplementation((processId, elementId) => {
                if (processId) {
                    return of(true);
                } else {
                    return of(false);
                }
            });
        });

        it('should retrieve variables from elements in the process if mapping is implicit', async () => {
            const serviceSpy = jest.spyOn(service, 'getAvailableVariablesForElement');

            const variables = await service.getAvailableVariablesForElement(sequenceFlowElement3).toPromise();

            expect(variables).toEqual(expectedVariables);
            expect(serviceSpy).toHaveBeenCalledTimes(6);
        });

        it('should retrieve variables from elements in a process with a cycle if mapping is implicit', async () => {
            const serviceSpy = jest.spyOn(service, 'getAvailableVariablesForElement');
            calledActivitiElement.incoming.push(sequenceFlowElement4);

            const variables = await service.getAvailableVariablesForElement(sequenceFlowElement3).toPromise();

            expect(variables).toEqual(expectedVariables);
            expect(serviceSpy).toHaveBeenCalledTimes(8);

            calledActivitiElement.incoming.pop();
        });
    });

    describe('Explicit mapping', () => {
        beforeEach(() => {
            jest.spyOn<any, any>(service, 'isMappingOutputsImplicitly').mockImplementation((processId, elementId) => {
                return of(false);
            });
        });

        it('should retrieve only process variables mapping is explicit', async () => {
            const serviceSpy = jest.spyOn(service, 'getAvailableVariablesForElement');

            const variables = await service.getAvailableVariablesForElement(sequenceFlowElement3).toPromise();

            expect(variables).toEqual([expectedVariables[0]]);
            expect(serviceSpy).toHaveBeenCalledTimes(6);
        });

        it('should retrieve only process variables mapping is explicit in a process with a cycle', async () => {
            const serviceSpy = jest.spyOn(service, 'getAvailableVariablesForElement');
            calledActivitiElement.incoming.push(sequenceFlowElement4);

            const variables = await service.getAvailableVariablesForElement(sequenceFlowElement3).toPromise();

            expect(variables).toEqual([expectedVariables[0]]);
            expect(serviceSpy).toHaveBeenCalledTimes(8);

            calledActivitiElement.incoming.pop();
        });
    });

    it('should return the variable as element list if variables are set', () => {
        const expectedVariablesList = expectedVariables[0].variables.concat(expectedVariables[1].variables);

        expect(service.getVariablesList(expectedVariables)).toEqual(expectedVariablesList);
    });

    it('should return an empty array as variable list if variables are not set', () => {
        expect(service.getVariablesList(null)).toEqual([]);
        expect(service.getVariablesList(undefined)).toEqual([]);
        expect(service.getVariablesList([])).toEqual([]);
    });
});
