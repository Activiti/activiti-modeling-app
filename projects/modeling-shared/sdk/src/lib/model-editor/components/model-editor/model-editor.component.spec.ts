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

/* eslint-disable @angular-eslint/component-selector */

import { Component, Inject, Input, OnDestroy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { CONNECTOR, FORM, PROCESS } from '../../../api/types';
import { DynamicComponentDirective } from './dynamic-component.directive';
import { ModelEditorComponent } from './model-editor.component';
import { MODEL_EDITORS_TOKEN } from './model-editors.token';

@Component({
    selector: 'process-editor',
    template: '<div data-automation-id="process-editor">{{ modelId }}</div>'
})
export class TestProcessEditorComponent implements OnDestroy {
    @Input() modelId: string;
    constructor(@Inject('destroyService') private destroyService: Subject<void>) {}
    ngOnDestroy() {
        this.destroyService.next();
        this.destroyService.complete();
    }
}

@Component({
    selector: 'connector-editor',
    template: '<div data-automation-id="connector-editor">{{ modelId }}</div>'
})
export class TestConnectorEditorComponent implements OnDestroy {
    @Input() modelId: string;
    constructor(@Inject('destroyService') private destroyService: Subject<void>) {}
    ngOnDestroy() {
        this.destroyService.next();
        this.destroyService.complete();
    }
}

describe('ModelEditorComponent', () => {

    let fixture: ComponentFixture<ModelEditorComponent>;
    let component: ModelEditorComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ModelEditorComponent,
                DynamicComponentDirective,
                TestProcessEditorComponent,
                TestConnectorEditorComponent
            ],
            providers: [
                { provide: MODEL_EDITORS_TOKEN, useValue: { type: PROCESS, componentClass: TestProcessEditorComponent }, multi: true },
                { provide: MODEL_EDITORS_TOKEN, useValue: { type: CONNECTOR, componentClass: TestConnectorEditorComponent }, multi: true },
                { provide: 'destroyService', useValue: new Subject<void>() },
            ]
        });

        TestBed.compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ModelEditorComponent);
        component = fixture.componentInstance;
        component.modelId = '1';
        component.modelType = CONNECTOR;
        fixture.detectChanges();
        component.ngOnChanges();
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    describe('Sub-component creation', () => {

        it('should load the TestConnectorEditorComponent', () => {
            const innerElement = fixture.debugElement.query(By.css('[data-automation-id="connector-editor"]'));
            expect(innerElement).not.toBeNull();

            // (Only!!!) in testing environment, the dynamically rendered component's ngOnInit is not called.
            // In real life app, Angular behaves the right way, but here, to be able to test if the modelId was set correctly,
            // we can do it in only one way: checking the private component['componentReference'] inner state...
            // Not elegant, but what can I say if TestBed doesn't simulate the real world?
            expect(fixture.debugElement.query(By.directive(TestConnectorEditorComponent)).componentInstance.modelId).toBe('1');
        });

        it('should load the TestConnectorEditorComponent', () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementationOnce(() => {});
            const updateWithNotRegisteredComponent = () => {
                component.modelType = FORM;
                fixture.detectChanges();
                component.ngOnChanges();
            };

            expect(updateWithNotRegisteredComponent).not.toThrow();
            expect(consoleErrorSpy).toHaveBeenCalledWith(`There is no registered editor for model type: ${FORM}`);
            jest.spyOn(console, 'error').mockRestore();
        });

        it('should switch the content to TestProcessEditorComponent with different modelId', () => {
            component.modelId = '8';
            component.modelType = PROCESS;
            fixture.detectChanges();
            component.ngOnChanges();

            const innerElementForConnector = fixture.debugElement.query(By.css('[data-automation-id="connector-editor"]'));
            expect(innerElementForConnector).toBeNull();

            const innerElement = fixture.debugElement.query(By.css('[data-automation-id="process-editor"]'));
            expect(innerElement).not.toBeNull();

            // See above (in the first test), why it is asserted this way
            expect(fixture.debugElement.query(By.directive(TestProcessEditorComponent)).componentInstance.modelId).toBe('8');
        });

        it('should destroy the previously loaded component', (complete) => {
            const destroyService: Subject<void> = TestBed.inject('destroyService' as any);
            component.modelType = PROCESS;
            fixture.detectChanges();
            component.ngOnChanges();

            return destroyService.subscribe({
                next: () => {},
                complete
            });
        });
    });
});
