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

/* eslint-disable @typescript-eslint/no-unused-vars */
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { JSONSchemaInfoBasics } from '../../../api/types';
import { ModelingJSONSchemaService } from '../../../services/modeling-json-schema.service';
import { hierarchy } from '../mocks/json-schema-editor.mocks';
import { DefaultJsonNodeCustomization, JSONSchemaDefinition, JSONSchemaTypeDropdownDefinition, JSONTypePropertiesDefinition } from '../models/model';
import { DataModelCustomizer, DATA_MODEL_CUSTOMIZATION } from './data-model-customization';
import { DefaultDataModelCustomizationService } from './default-data-model.customization.service';
import { JsonSchemaEditorService } from './json-schema-editor.service';

class CustomDataModelCustomizer extends DataModelCustomizer {

    getDataModelType(): string {
        return 'custom';
    }

    getTypeDropdownForNode(schema: JSONSchemaInfoBasics, accessor: string[]): JSONSchemaTypeDropdownDefinition {
        return {
            multiple: false,
            groups: false,
            options: []
        };
    }

    getPropertiesDefinitionForType(schema: JSONSchemaInfoBasics, accessor: string[], type: string): JSONTypePropertiesDefinition {
        return {
            custom: {
                id: type,
                name: type,
                type: 'string'
            }
        };
    }

    getProtectedAttributesByType(schema: JSONSchemaInfoBasics, accessor: string[], type: string) {
        return ['number'];
    }
}

describe('JsonSchemaEditorService', () => {
    let service: JsonSchemaEditorService;
    let defaultCustomizer: DefaultDataModelCustomizationService;
    let defaultCustomizerSpy: jasmine.Spy;
    const customCustomizer = new CustomDataModelCustomizer();
    let findCustomizerSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: ModelingJSONSchemaService,
                    useValue: {
                        getPropertyTypeItems: () => of(hierarchy)
                    }
                },
                DefaultDataModelCustomizationService,
                {
                    provide: DATA_MODEL_CUSTOMIZATION,
                    useValue: customCustomizer,
                    multi: true
                }
            ]
        });
        service = TestBed.inject(JsonSchemaEditorService);
        defaultCustomizer = TestBed.inject(DefaultDataModelCustomizationService);
        defaultCustomizerSpy = spyOn(defaultCustomizer, 'updateNodeCustomization').and.callThrough();
        findCustomizerSpy = spyOn<any>(service, 'findCustomizer').and.callThrough();
    });

    describe('getTypes', () => {
        it('should call the find customizer', () => {
            service.getTypes(null, {}, []);

            expect(findCustomizerSpy).toHaveBeenCalledWith(null);
        });

        it('should call the customizer to retrieve the new definition', () => {
            const spy = spyOn(defaultCustomizer, 'getTypes').and.returnValue('mock');

            const result = service.getTypes(null, {}, []);

            expect(spy).toHaveBeenCalledWith({}, []);
            expect(result).toEqual('mock');
        });
    });

    describe('setType', () => {
        it('should call the find customizer', () => {
            service.setType('string', null, {}, [], true);

            expect(findCustomizerSpy).toHaveBeenCalledWith(null);
        });

        it('should call the customizer to retrieve the new definition', () => {
            const spy = spyOn(defaultCustomizer, 'setType');

            service.setType('string', null, {}, [], true);

            expect(spy).toHaveBeenCalledWith('string', {}, [], true);
        });
    });

    it('getDefinitions', () => {
        const defs = {
            date: {
                type: 'string'
            },
            time: {
                hour: {
                    type: 'integer'
                },
                minute: {
                    type: 'number'
                }
            }
        };
        const expectedDefs = [
            { key: 'date', accessor: '#/$defs/date', definition: { type: 'string' } },
            { key: 'hour', accessor: '#/$defs/time/hour', definition: { type: 'integer' } },
            { key: 'minute', accessor: '#/$defs/time/minute', definition: { type: 'number' } },
        ];

        expect(service.getDefinitions('#/$defs', defs)).toEqual(expectedDefs);

    });

    describe('advancedAttr', () => {
        it('should call the find customizer', () => {
            service.advancedAttr(null, { type: 'string' }, []);

            expect(findCustomizerSpy).toHaveBeenCalledWith(null);
        });

        it('not basic type', () => {
            const value = {
                $ref: '#/$defs/primitive/date',
                allOf: [],
                anyOf: [],
                oneOf: []
            };
            expect(service.advancedAttr(null, value, [])).toEqual({
                description: { id: 'description', name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.DESCRIPTION', type: 'string' }
            });
        });

        it('enum type', () => {
            const value = {
                enum: ['a', 'b', 'c']
            };
            expect(service.advancedAttr(null, value, [])).toEqual({
                description: { id: 'description', name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.DESCRIPTION', type: 'string' },
                enum: { id: 'enum', name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.ENUMERATED_VALUES', type: 'array', model: { type: 'object' } }
            });
        });

        it('all types', () => {
            const value = {
                type: ['array', 'boolean', 'integer', 'number', 'object', 'string'],
                enum: ['a', 'b', 'c'],
                $ref: '#/$defs/primitive/date',
                allOf: [],
                anyOf: [],
                oneOf: []
            };

            const expectedAttributes = {
                description: { id: 'description', name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.DESCRIPTION', type: 'string' },
                enum: { id: 'enum', name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.ENUMERATED_VALUES', type: 'array', model: { type: 'object' } },
                maxItems: { id: 'maxItems', name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.MAX_ITEMS', type: 'integer' },
                minItems: { id: 'minItems', name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.MIN_ITEMS', type: 'integer' },
                uniqueItems: { id: 'uniqueItems', name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.UNIQUE_ITEMS', type: 'boolean' },
                maximum: { id: 'maximum', name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.MAXIMUM', type: 'integer' },
                minimum: { id: 'minimum', name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.MINIMUM', type: 'integer' },
                exclusiveMaximum: { id: 'exclusiveMaximum', name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.EXCLUSIVE_MAXIMUM', type: 'boolean' },
                exclusiveMinimum: { id: 'exclusiveMinimum', name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.EXCLUSIVE_MINIMUM', type: 'boolean' },
                maxProperties: { id: 'maxProperties', name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.MAX_PROPERTIES', type: 'integer' },
                minProperties: { id: 'minProperties', name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.MIN_PROPERTIES', type: 'integer' },
                additionalProperties: { id: 'additionalProperties', name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.ADDITIONAL_PROPERTIES', type: 'boolean' },
                maxLength: { id: 'maxLength', name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.MAX_LENGTH', type: 'integer' },
                minLength: { id: 'minLength', name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.MIN_LENGTH', type: 'integer' },
                pattern: { id: 'pattern', name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.PATTERN', type: 'string' },
                format: {
                    id: 'format',
                    name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.FORMAT',
                    type: 'enum',
                    model: { enum: ['date', 'date-time', 'email', 'hostname', 'ipv4', 'ipv6', 'uri'] }
                },
            };

            expect(service.advancedAttr(null, value, [])).toEqual(expectedAttributes);
        });

        it('should use the custom customizer for providing the attributes', () => {
            const value = {
                type: 'object'
            };

            const expectedAttributes = {
                custom: { id: 'object', name: 'object', type: 'string' },
                description: { id: 'description', name: 'SDK.JSON_SCHEMA_EDITOR.ATTRIBUTES.DESCRIPTION', type: 'string' }
            };

            expect(service.advancedAttr('custom', value, [])).toEqual(expectedAttributes);
        });

    });

    describe('hierarchy', () => {
        it('should filter the primitive types', async () => {
            const expectedHierarchy = hierarchy.slice();
            expectedHierarchy.splice(0, 1);

            const result = await service.initHierarchy([], []).pipe(take(1)).toPromise();

            expect(result).toEqual(expectedHierarchy);
        });

        it('should filter filtered references', async () => {
            const result = await service.initHierarchy([], ['#/$defs/a-provider/filter-me']).pipe(take(1)).toPromise();

            expect(result).toEqual([hierarchy[2]]);
        });

        it('should include definitions', async () => {
            const definitions: JSONSchemaDefinition[] = [{
                accessor: '#/$defs/provided-definition',
                key: 'provided-definition',
                definition: {
                    type: 'object'
                }
            }];
            const expectedHierarchy = hierarchy.slice();
            expectedHierarchy.splice(0, 1);
            expectedHierarchy.push({
                displayName: '#/$defs/provided-definition',
                iconName: 'assignment_returned',
                isCustomIcon: false,
                provider: 'inline',
                typeId: ['provided-definition'],
                value: {
                    $ref: '#/$defs/provided-definition'
                }
            });

            const result = await service.initHierarchy(definitions, []).pipe(take(1)).toPromise();

            expect(result).toEqual(expectedHierarchy);
        });
    });

    describe('getProtectedAttributesForDataModelType', () => {
        it('should call the find customizer', () => {
            service.getProtectedAttributesForDataModelType(null, { type: 'string' }, []);

            expect(findCustomizerSpy).toHaveBeenCalledWith(null);
        });

        it('should call the customizer to retrieve the protected attributes', () => {
            const spy = spyOn(defaultCustomizer, 'getProtectedAttributesByType').and.returnValue(['string']);

            service.getProtectedAttributesForDataModelType(null, { type: 'string' }, []);

            expect(spy).toHaveBeenCalledWith({ type: 'string' }, [], 'string');
        });

        it('should remove duplicates in the protected attributes', () => {
            spyOn(defaultCustomizer, 'getProtectedAttributesByType').and.returnValue(['string', 'string']);

            const result = service.getProtectedAttributesForDataModelType(null, { type: 'string' }, []);

            expect(result).toEqual(['string']);
        });
    });

    describe('getNodeCustomizationsForDataModelType', () => {
        const customization = new DefaultJsonNodeCustomization();

        it('should call the find customizer', () => {
            service.updateNodeCustomization(null, {}, [], customization);

            expect(findCustomizerSpy).toHaveBeenCalledWith(null);
        });

        it('should call the customizer to retrieve the customizations', () => {
            service.updateNodeCustomization(null, {}, [], customization);

            expect(defaultCustomizerSpy).toHaveBeenCalledWith({}, [], customization);
            expect(customization).toEqual(new DefaultJsonNodeCustomization());
        });
    });

    describe('addPropertyForDataModelType', () => {
        it('should call the find customizer', () => {
            service.addPropertyForDataModelType(null, {}, []);

            expect(findCustomizerSpy).toHaveBeenCalledWith(null);
        });

        it('should call the customizer to retrieve the new property', () => {
            const spy = spyOn(defaultCustomizer, 'addProperty').and.returnValue('mock');

            const result = service.addPropertyForDataModelType(null, {}, []);

            expect(spy).toHaveBeenCalledWith({}, []);
            expect(result).toEqual('mock');
        });
    });

    describe('addItemForDataModelType', () => {
        it('should call the find customizer', () => {
            service.addItemForDataModelType(null, {}, []);

            expect(findCustomizerSpy).toHaveBeenCalledWith(null);
        });

        it('should call the customizer to retrieve the new array', () => {
            const spy = spyOn(defaultCustomizer, 'addItem').and.returnValue('mock');

            const result = service.addItemForDataModelType(null, {}, []);

            expect(spy).toHaveBeenCalledWith({}, []);
            expect(result).toEqual('mock');
        });
    });

    describe('addDefinitionForDataModelType', () => {
        it('should call the find customizer', () => {
            service.addDefinitionForDataModelType(null, {}, []);

            expect(findCustomizerSpy).toHaveBeenCalledWith(null);
        });

        it('should call the customizer to retrieve the new definition', () => {
            const spy = spyOn(defaultCustomizer, 'addDefinition').and.returnValue('mock');

            const result = service.addDefinitionForDataModelType(null, {}, []);

            expect(spy).toHaveBeenCalledWith({}, []);
            expect(result).toEqual('mock');
        });
    });

    describe('addChildForDataModelType', () => {
        it('should call the find customizer', () => {
            service.addChildForDataModelType(null, {}, [], '');

            expect(findCustomizerSpy).toHaveBeenCalledWith(null);
        });

        it('should call the customizer to retrieve the new definition', () => {
            const spy = spyOn(defaultCustomizer, 'addChild').and.returnValue('mock');

            const result = service.addChildForDataModelType(null, {}, [], '');

            expect(spy).toHaveBeenCalledWith({}, [], '');
            expect(result).toEqual('mock');
        });
    });
});
