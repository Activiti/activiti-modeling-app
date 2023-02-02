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

import { DialogService } from '@alfresco-dbp/adf-candidates/core/dialog';
import {
    ExpressionsEditorService,
    ProcessEditorElementVariablesService,
    PROCESS_EDITOR_ELEMENT_VARIABLES_PROVIDERS,
    UuidService,
    VariablesModule,
} from '@alfresco-dbp/modeling-shared/sdk';
import {
    CardViewUpdateService,
    CoreTestingModule,
    TranslationMock,
    TranslationService,
} from '@alfresco/adf-core';
import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MaxLengthPropertyValidator } from '../validators/max-length-property.validator';
import { DescriptionItemComponent } from './description-item.component';
import { DescriptionItemModel } from './description-item.model';

describe('DescriptionItemComponent', () => {
    let fixture: ComponentFixture<DescriptionItemComponent>;
    let component: DescriptionItemComponent;
    let cardViewUpdateService: CardViewUpdateService;
    let processEditorElementVariablesService: ProcessEditorElementVariablesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProcessEditorElementVariablesService,
                UuidService,
                DialogService,
                {
                    provide: PROCESS_EDITOR_ELEMENT_VARIABLES_PROVIDERS,
                    useValue: [],
                },
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn(),
                    },
                },
                {
                    provide: TranslationService,
                    useClass: TranslationMock,
                },
                {
                    provide: ExpressionsEditorService,
                    useValue: {
                        initExpressionEditor: jest.fn(),
                        colorizeElement: jest.fn(),
                    },
                },
            ],
            declarations: [DescriptionItemComponent],
            imports: [
                CoreTestingModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                VariablesModule,
            ],
        });

        processEditorElementVariablesService = TestBed.inject(
            ProcessEditorElementVariablesService
        );
        fixture = TestBed.createComponent(DescriptionItemComponent);
        component = fixture.componentInstance;
        cardViewUpdateService = TestBed.inject(CardViewUpdateService);
    });

    it('should be truthy', () => {
        expect(fixture).toBeTruthy();
        expect(component).toBeTruthy();
        expect(cardViewUpdateService).toBeTruthy();
        expect(processEditorElementVariablesService).toBeTruthy();
    });

    describe('rendering', () => {
        beforeEach(() => {
            const mockProperty = new DescriptionItemModel({
                label: 'testLabel',
                value: 'Some description is ${variable1}',
                key: 'testKey',
                editable: true,
            });

            component.property = mockProperty;
            component.ngOnChanges({
                property: new SimpleChange(null, null, true),
            });
            fixture.detectChanges();
        });

        it('should render correct label', () => {
            const label = fixture.debugElement.query(
                By.css('[data-automation-id="card-description-label-testKey"]')
            );

            expect(label).not.toBeNull();
            expect(label.nativeElement.textContent.trim()).toEqual('testLabel');
        });

        it('should render code editor with value', () => {
            const codeEditorPreview = fixture.debugElement.query(
                By.css('.ama-expression-code-editor-preview')
            );

            expect(codeEditorPreview).not.toBeNull();
            expect(codeEditorPreview.nativeElement.textContent.trim()).toEqual(
                'Some description is ${variable1}'
            );
        });

        it('should detect variables', () => {
            const codeEditorPreview = fixture.debugElement.query(
                By.css('.ama-expression-code-editor-preview')
            );

            expect(codeEditorPreview).not.toBeNull();
            expect(codeEditorPreview.nativeElement.textContent.trim()).toEqual(
                'Some description is ${variable1}'
            );
        });

        it('should render edit button', () => {
            const editButton = fixture.debugElement.query(
                By.css('.ama-expression-code-editor-edit-button')
            );

            expect(editButton).not.toBeNull();
        });
    });

    describe('rendering with default value', () => {
        beforeEach(() => {
            const mockProperty = new DescriptionItemModel({
                label: 'testLabel',
                value: '',
                default: 'default value',
                key: 'testKey',
                editable: true,
            });

            component.property = mockProperty;
            component.ngOnChanges({
                property: new SimpleChange(null, null, true),
            });
            fixture.detectChanges();
        });

        it('should render code editor with default value', () => {
            const codeEditorPreview = fixture.debugElement.query(
                By.css('.ama-expression-code-editor-preview')
            );

            expect(codeEditorPreview).not.toBeNull();
            expect(codeEditorPreview.nativeElement.textContent.trim()).toEqual(
                'default value'
            );
        });
    });

    describe('rendering as non editable', () => {
        beforeEach(() => {
            const mockProperty = new DescriptionItemModel({
                label: 'testLabel',
                value: '',
                key: 'testKey',
                editable: false,
            });

            component.property = mockProperty;
            component.ngOnChanges({
                property: new SimpleChange(null, null, true),
            });
            fixture.detectChanges();
        });

        it('should not render edit button', () => {
            const editButton = fixture.debugElement.query(
                By.css('.ama-expression-code-editor-edit-button')
            );

            expect(editButton).toBeNull();
        });
    });

    describe('edition', () => {
        beforeEach(() => {
            const mockProperty = new DescriptionItemModel({
                label: 'testLabel',
                value: '',
                key: 'testKey',
                validators: [
                    new MaxLengthPropertyValidator(4000, 'too long error'),
                ],
            });

            component.property = mockProperty;
            component.ngOnChanges({
                property: new SimpleChange(null, null, true),
            });
            fixture.detectChanges();
        });

        it('should trigger update on expression change', () => {
            const updateSpy = spyOn(cardViewUpdateService, 'update');
            component.onExpressionChange('new value');

            expect(updateSpy).toHaveBeenCalledWith(
                jasmine.any(DescriptionItemModel),
                'new value'
            );
        });

        it('should trigger validation error on too long expression', () => {
            const updateSpy = spyOn(cardViewUpdateService, 'update');
            const veryLongExpression = 'x'.repeat(5000);

            component.onExpressionChange(veryLongExpression);

            fixture.detectChanges();

            const errorContainer = fixture.debugElement.query(
                By.css('[data-automation-id="card-description-error-testKey"]')
            );

            expect(errorContainer).not.toBeNull();
            expect(errorContainer.nativeElement.textContent.trim()).toEqual(
                'too long error'
            );
            expect(updateSpy).not.toHaveBeenCalled();
        });
    });
});
