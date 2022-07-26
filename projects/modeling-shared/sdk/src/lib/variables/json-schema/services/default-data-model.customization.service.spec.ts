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
import { DefaultJsonNodeCustomization, TYPE } from '../models/model';
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
        expect(service.getNodeCustomization(null, null)).toEqual(new DefaultJsonNodeCustomization());
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
});
