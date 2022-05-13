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

import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ParticipantElementVariablesProviderService } from './participant-element-variables-provider.service';
import { participantVariablesProviderElement, participantVariablesProviderVariables } from './participant-element-variables-provider.service.mock';

describe('ParticipantElementVariablesProviderService', () => {
    let service: ParticipantElementVariablesProviderService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ParticipantElementVariablesProviderService,
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation(() => of({
                            'c2f8729e-5056-44d2-8cd7-fb1bada7f4ba': {
                                'id': 'c2f8729e-5056-44d2-8cd7-fb1bada7f4ba',
                                'name': 'one',
                                'type': 'string',
                                'value': 'one',
                                'required': false
                            },
                            'b1b04bf1-19cb-4930-b750-eecb6f39770f': {
                                'id': 'b1b04bf1-19cb-4930-b750-eecb6f39770f',
                                'name': 'two',
                                'type': 'integer',
                                'required': false,
                                'value': 2
                            },
                            '695b2110-1060-4819-a513-400b114c9324': {
                                'id': '695b2110-1060-4819-a513-400b114c9324',
                                'name': 'three',
                                'type': 'boolean',
                                'required': false,
                                'value': true
                            }
                        }))
                    }
                }
            ]
        });
    });

    beforeEach(() => {
        service = TestBed.inject(ParticipantElementVariablesProviderService);
    });

    it('should get variables from element', async () => {
        service.getVariablesFromElement(participantVariablesProviderElement).subscribe(vars => {
            expect(vars).toEqual(participantVariablesProviderVariables);
        });
    });
});
