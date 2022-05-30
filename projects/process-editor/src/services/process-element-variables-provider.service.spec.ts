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

import { BpmnElement, ElementVariable } from '@alfresco-dbp/modeling-shared/sdk';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ProcessElementVariablesProviderService } from './process-element-variables-provider.service';

const element: Bpmn.DiagramElement = {
    id: 'ProcessDefinitionId',
    type: BpmnElement.Process,
    businessObject: {
        $type: BpmnElement.Process,
        id: 'ProcessDefinitionId'
    }
};

let result: ElementVariable[];

const variables: ElementVariable[] = [
    {
        'id': 'c2f8729e-5056-44d2-8cd7-fb1bada7f4ba',
        'name': 'one',
        'type': 'string'
    },
    {
        'id': 'b1b04bf1-19cb-4930-b750-eecb6f39770f',
        'name': 'two',
        'type': 'integer'
    },
    {
        'id': '695b2110-1060-4819-a513-400b114c9324',
        'name': 'three',
        'type': 'boolean'
    }
];

describe('ProcessElementVariablesProviderService', () => {
    let service: ProcessElementVariablesProviderService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProcessElementVariablesProviderService,
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation(() => of(variables))
                    }
                }
            ]
        });
    });

    beforeEach(async () => {
        service = TestBed.inject(ProcessElementVariablesProviderService);
        result = await service.getVariablesFromElement(element).toPromise();
    });

    it('should get the variables for the element containing the execution object', () => {
        expect(result).toEqual([ProcessElementVariablesProviderService.EXECUTION_OBJECT, ...variables]);
    });
});
