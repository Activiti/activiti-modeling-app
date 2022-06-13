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
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Process } from '@alfresco-dbp/modeling-shared/sdk';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CardProcessVersionItemComponent } from './process-version-item.component';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { PROCESS_MODEL_ENTITY_SELECTORS } from '../../../store/process-editor.selectors';
import { mockProcessModel } from '../../../store/process.mock';
import { ActivatedRoute } from '@angular/router';

describe('CardProcessVersionItemComponent', () => {
    let fixture: ComponentFixture<CardProcessVersionItemComponent>;
    let component: CardProcessVersionItemComponent;
    const mockSelector = {};
    let process: Process;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation(selector => {
                            if (selector === mockSelector) {
                                return of(process);
                            }

                            return of({});
                        }),
                        dispatch: jest.fn()
                    }
                },
                {
                    provide: PROCESS_MODEL_ENTITY_SELECTORS,
                    useValue: {
                        selectModelMetadataById: jest.fn().mockReturnValue(mockSelector)
                    }
                },
                {
                    provide: ActivatedRoute,
                    useValue: { params: of({modelId: 'id1'}), snapshot: {url: ''} }
                },
            ],
            declarations: [CardProcessVersionItemComponent],
            imports: [
                MatFormFieldModule,
                MatInputModule,
                TranslateModule.forRoot(),
                ReactiveFormsModule,
                NoopAnimationsModule
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CardProcessVersionItemComponent);
        component = fixture.componentInstance;
        process = <Process>mockProcessModel;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should show version', () => {
        fixture.detectChanges();
        const versionField = fixture.debugElement.nativeElement.querySelector('.ama-process-properties-version-value');

        expect(component.version).toEqual('0.0.1');
        expect(versionField.textContent).toEqual('0.0.1');
    });
});
