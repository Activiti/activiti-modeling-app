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
import { expectedEventExtendedSchemaTypes, expectedEventSchemaTypes, expectedPrimitiveTypes } from '../mocks/primitive-types.mock';
import { JSONSchemaInfoBasics, JSONSchemaToModelingTypesService } from './json-schema-to-modeling-types.service';
import * as primitiveTypesSchema from './expression-language/primitive-types-schema.json';
import * as eventsSchema from '../mocks/event-schema.json';
import * as eventsSchemaExtended from '../mocks/event-schema-extended.json';

describe('JSONSchemaToModelingTypesService', () => {
    let service: JSONSchemaToModelingTypesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [JSONSchemaToModelingTypesService]
        });

        service = TestBed.inject(JSONSchemaToModelingTypesService);
    });

    it('should return the primitive modeling types', () => {
        const actual = service.getPrimitiveModelingTypesFromJSONSchema(primitiveTypesSchema);

        expect(actual).toEqual(expectedPrimitiveTypes);
    });

    it('should return the modeling types from a JSON schema', () => {
        const actual = service.getModelingTypesFromJSONSchema(eventsSchema as JSONSchemaInfoBasics, 'eventSchema');

        expect(actual).toEqual(expectedEventSchemaTypes);
    });

    it('should not include existing modeling types in output when passed', () => {
        const primitiveTypes = service.getPrimitiveModelingTypesFromJSONSchema(primitiveTypesSchema);

        const actual = service.getModelingTypesFromJSONSchema(eventsSchema as JSONSchemaInfoBasics, 'eventSchema', primitiveTypes);

        expect(actual).toEqual(expectedEventSchemaTypes);
    });

    it('should allow extending an existing schema', () => {
        const eventSchema = service.getModelingTypesFromJSONSchema(eventsSchema as JSONSchemaInfoBasics, 'eventSchema');

        const actual = service.getModelingTypesFromJSONSchema(eventsSchemaExtended as JSONSchemaInfoBasics, 'eventExtendedSchema', eventSchema);

        expect(actual).toEqual(expectedEventExtendedSchemaTypes);
    });
});
