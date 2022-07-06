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
import { TYPE, TYPES } from '../models/model';
import { DataModelCustomizer } from './data-model-customization';

import { DefaultDataModelCustomizationService } from './default-data-model.customization.service';

describe('DefaultDataModelCustomizationService', () => {
    let service: DefaultDataModelCustomizationService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DefaultDataModelCustomizationService);
    });

    it('should return the default modeling dropdown types', () => {
        expect(service.getTypeDropdownForNode(jasmine.anything(), [])).toEqual(TYPES);
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

    it('should return the default labels', () => {
        expect(service.getLabels(jasmine.anything(), [])).toEqual({
            anyOf: 'anyOf',
            anyOfAddButton: 'SDK.JSON_SCHEMA_EDITOR.ADD_CHILD_ANY_OF',
            allOf: 'allOf',
            allOfAddButton: 'SDK.JSON_SCHEMA_EDITOR.ADD_CHILD_ALL_OF',
            oneOf: 'oneOf',
            oneOfAddButton: 'SDK.JSON_SCHEMA_EDITOR.ADD_CHILD_ONE_OF',
            items: 'items',
            propertyAddButton: 'SDK.JSON_SCHEMA_EDITOR.ADD_PROPERTY',
            definitionAddButton: 'SDK.JSON_SCHEMA_EDITOR.ADD_DEFINITION',
            root: 'root'
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

    it('should return the default filter references', () => {
        expect(service.filterDataModelReferencesStartingWith(jasmine.anything(), [])).toEqual([]);
    });
});
