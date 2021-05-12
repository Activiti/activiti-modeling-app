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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    ImplementationItemModel, AmaState
} from '@alfresco-dbp/modeling-shared/sdk';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CardViewImplementationItemComponent } from './implementation-item.component';
import { of } from 'rxjs';

describe('CardViewImplementationItemComponent', () => {
    let fixture: ComponentFixture<CardViewImplementationItemComponent>;
    let component: CardViewImplementationItemComponent;
    let store: Store<AmaState>;

    beforeAll((() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: Store, useValue: { select: jest.fn() } }
            ],
            declarations: [CardViewImplementationItemComponent],
            imports: [TranslateModule.forRoot(), RouterTestingModule],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
        fixture = TestBed.createComponent(CardViewImplementationItemComponent);
        component = fixture.componentInstance;
        component.property = <ImplementationItemModel>{ value: 'mock-id', data: { id: 'mock-id', processId: 'Process_12345678' } };
        store = TestBed.inject(Store);
    }));

    it('should return empty strings for inputs and outputs if there is no mapping', async () => {
        spyOn(store, 'select').and.returnValue(of(null));

        component.ngOnInit();

        await fixture.whenStable();

        expect(component.inputs).toEqual('');
        expect(component.outputs).toEqual('');
    });

    it('should return the mapping as strings for inputs and outputs if there is mapping', async () => {
        const mockMapping = {
            'inputs': {
                'a': {
                    'type': 'variable',
                    'value': 'b'
                }
            },
            'outputs': {
                'myFile': {
                    'type': 'variable',
                    'value': 'file'
                }
            }
        };
        spyOn(store, 'select').and.returnValue(of(mockMapping));

        component.ngOnInit();

        await fixture.whenStable();

        expect(component.inputs).toEqual(JSON.stringify(mockMapping.inputs));
        expect(component.outputs).toEqual(JSON.stringify(mockMapping.outputs));
    });

});
