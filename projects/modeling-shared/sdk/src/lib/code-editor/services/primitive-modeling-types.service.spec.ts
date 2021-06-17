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
import { expectedPrimitiveTypes } from '../mocks/primitive-types.mock';
import { JSONSchemaToModelingTypesService } from './json-schema-to-modeling-types.service';
import { PrimitiveModelingTypesService } from './primitive-modeling-types.service';

describe('PrimitiveModelingTypesService', () => {
    let service: PrimitiveModelingTypesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PrimitiveModelingTypesService, JSONSchemaToModelingTypesService]
        });

        service = TestBed.inject(PrimitiveModelingTypesService);
    });

    it('should emit the primitive types on subscription', (done) => {
        service.modelingTypesUpdated$.subscribe(modelingTypes => {
            expect(modelingTypes).toEqual(expectedPrimitiveTypes);
            done();
        });
    });
});
