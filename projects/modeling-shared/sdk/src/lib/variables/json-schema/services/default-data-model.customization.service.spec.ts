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
import { DefaultJsonNodeCustomization, TYPE, TYPES } from '../models/model';
import { DataModelCustomizer } from './data-model-customization';

import { DefaultDataModelCustomizationService } from './default-data-model.customization.service';

describe('DefaultDataModelCustomizationService', () => {
    let service: DefaultDataModelCustomizationService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DefaultDataModelCustomizationService);
    });

    it('should return undefined as data model type', () => {
        expect(service.getDataModelType()).toBeUndefined();
    });

    it('should return the default node customization', () => {
        const customization = new DefaultJsonNodeCustomization();
        service.updateNodeCustomization(null, null, customization);
        expect(customization).toEqual(new DefaultJsonNodeCustomization());
    });

    it('should return the default properties definition for type', () => {
        Object.keys(TYPE).forEach(type => {
            expect(service.getPropertiesDefinitionForType(jasmine.anything(), [], type)).toEqual(TYPE[type]);
        });

    });

    it('should return the default protected attributes for type', () => {
        Object.keys(TYPE).forEach(type => {
            expect(service.getProtectedAttributesByType(jasmine.anything(), [], type)).toEqual(DataModelCustomizer.PROTECTED_ATTRIBUTES);
        });
    });

    it('should return the default schema for a new property', () => {
        expect(service.addProperty(jasmine.anything(), [])).toEqual({});
    });

    it('should return the default schema for a new array', () => {
        expect(service.addItem(jasmine.anything(), [])).toEqual({ type: 'string' });
    });

    it('should return the default schema for a new definition', () => {
        expect(service.addDefinition(jasmine.anything(), [])).toEqual({ type: 'object', title: '' });
    });

    it('should return the default schema for a new child', () => {
        expect(service.addChild(jasmine.anything(), [], '')).toEqual({ type: 'object' });
    });

    describe('getTypes', () => {

        describe('single type', () => {
            it('JSONSchemaTypes', () => {
                TYPES.groupOptions.find(type => type.name === 'SDK.JSON_SCHEMA_EDITOR.TYPES_GROUPS.JSON_SCHEMA_TYPES')?.value.forEach(type => {
                    expect(service.getTypes({ type: type.id }, ['root'])).toEqual([type.id]);
                });
            });

            it('date', () => {
                expect(service.getTypes({ $ref: '#/$defs/primitive/date' }, ['root'])).toEqual(['date']);
            });

            it('datetime', () => {
                expect(service.getTypes({ $ref: '#/$defs/primitive/datetime' }, ['root'])).toEqual(['datetime']);
            });

            it('file', () => {
                expect(service.getTypes({ $ref: '#/$defs/primitive/file' }, ['root'])).toEqual(['file']);
            });

            it('folder', () => {
                expect(service.getTypes({ $ref: '#/$defs/primitive/folder' }, ['root'])).toEqual(['folder']);
            });

            it('enum', () => {
                expect(service.getTypes({ enum: ['a', 'b', 'c'] }, ['root'])).toEqual(['enum']);
            });

            it('ref', () => {
                expect(service.getTypes({ $ref: '#/$defs/date' }, ['root'])).toEqual(['ref']);
            });

            it('allOf', () => {
                expect(service.getTypes({ allOf: [] }, ['root'])).toEqual(['allOf']);
            });

            it('anyOf', () => {
                expect(service.getTypes({ anyOf: [] }, ['root'])).toEqual(['anyOf']);
            });

            it('oneOf', () => {
                expect(service.getTypes({ oneOf: [] }, ['root'])).toEqual(['oneOf']);
            });
        });

        it('multiple types', () => {
            const value = {
                type: ['object', 'string', 'integer'],
                enum: ['a', 'b', 'c'],
                $ref: '#/$defs/primitive/date',
                allOf: [],
                anyOf: [],
                oneOf: []
            };

            expect(service.getTypes(value, ['root'])).toEqual(['object', 'string', 'integer', 'date', 'enum', 'anyOf', 'allOf', 'oneOf']);
        });

    });

    describe('setType', () => {

        it('date', () => {
            const value = {};
            const expectedValue = { $ref: '#/$defs/primitive/date' };

            service.setType('date', value, [], true);

            expect(value).toEqual(expectedValue);

            service.setType('date', value, [], false);

            expect(value).toEqual({});
        });

        it('datetime', () => {
            const value = {};
            const expectedValue = { $ref: '#/$defs/primitive/datetime' };

            service.setType('datetime', value, [], true);

            expect(value).toEqual(expectedValue);

            service.setType('datetime', value, [], false);

            expect(value).toEqual({});
        });

        it('file', () => {
            const value = {};
            const expectedValue = { $ref: '#/$defs/primitive/file' };

            service.setType('file', value, [], true);

            expect(value).toEqual(expectedValue);

            service.setType('file', value, [], false);

            expect(value).toEqual({});
        });

        it('folder', () => {
            const value = {};
            const expectedValue = { $ref: '#/$defs/primitive/folder' };

            service.setType('folder', value, [], true);

            expect(value).toEqual(expectedValue);

            service.setType('folder', value, [], false);

            expect(value).toEqual({});
        });

        it('enum', () => {
            const value = {};
            const expectedValue = { enum: [] };

            service.setType('enum', value, [], true);

            expect(value).toEqual(expectedValue);

            service.setType('enum', value, [], false);

            expect(value).toEqual({});
        });

        it('ref', () => {
            const value = {};
            const expectedValue = { $ref: '#/$defs' };

            service.setType('ref', value, [], true);

            expect(value).toEqual(expectedValue);

            service.setType('ref', value, [], false);

            expect(value).toEqual({});
        });

        it('allOf', () => {
            const value = {};
            const expectedValue = { allOf: [] };

            service.setType('allOf', value, [], true);

            expect(value).toEqual(expectedValue);

            service.setType('allOf', value, [], false);

            expect(value).toEqual({});
        });

        it('anyOf', () => {
            const value = {};
            const expectedValue = { anyOf: [] };

            service.setType('anyOf', value, [], true);

            expect(value).toEqual(expectedValue);

            service.setType('anyOf', value, [], false);

            expect(value).toEqual({});
        });

        it('oneOf', () => {
            const value = {};
            const expectedValue = { oneOf: [] };

            service.setType('oneOf', value, [], true);

            expect(value).toEqual(expectedValue);

            service.setType('oneOf', value, [], false);

            expect(value).toEqual({});
        });

        it('array', () => {
            const value = {};
            const expectedValue = { type: 'array', items: { type: 'string' } };

            service.setType('array', value, [], true);

            expect(value).toEqual(expectedValue);

            service.setType('array', value, [], false);

            expect(value).toEqual({});
        });

        it('object', () => {
            const value = {};
            const expectedValue = { type: 'object', properties: {} };

            service.setType('object', value, [], true);

            expect(value).toEqual(expectedValue);

            service.setType('object', value, [], false);

            expect(value).toEqual({});
        });

        it('others', () => {
            const value = {};
            const expectedValue = { type: 'string' };

            service.setType('string', value, [], true);

            expect(value).toEqual(expectedValue);

            service.setType('string', value, [], false);

            expect(value).toEqual({});
        });
    });
});
