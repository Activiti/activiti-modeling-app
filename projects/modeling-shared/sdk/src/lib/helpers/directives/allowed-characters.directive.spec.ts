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

import { AllowedCharactersDirective } from './allowed-characters.directive';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AmaState } from '../../store/app.state';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { MODELER_NAME_REGEX } from '../utils/create-entries-names';

@Component({
    template: `<input #input type="text" [modelingsdk-allowed-characters]="regex" />`
})
class TestComponent {
    @ViewChild(AllowedCharactersDirective, { static: true })
    public directive: AllowedCharactersDirective;

    @ViewChild('input', { static: true })
    public input: ElementRef;

    regex = MODELER_NAME_REGEX;
}

describe('AllowedCharactersDirective', () => {
    let component: TestComponent,
        fixture: ComponentFixture<TestComponent>,
        store: Store<AmaState>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule],
            declarations: [
                AllowedCharactersDirective,
                TestComponent
            ],
            providers: [
                { provide: Store, useValue: { dispatch: jest.fn() } },
                { provide: TranslateService, useValue: { instant: jest.fn() } },
                { provide: TranslationService, useClass: TranslationMock }
            ]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        store = TestBed.inject(Store);
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should filter every not allowed letter by default value on key press', () => {
        /* cspell: disable-next-line */
        const text = 'abcdef-01';
        const notAllowedText = '`A_=+-$%^&*@';

        expect(component.directive.onKeyPress({ key: text[0], target: { value: text } })).toBe(true);
        expect(component.directive.onKeyPress({ key: notAllowedText[0], target: { value: notAllowedText } })).toBe(false);
    });

    it('should filter every not allowed letter by default value on paste', fakeAsync(() => {
        spyOn(store, 'dispatch');
        const text = 'T=h+e-_m$%ea^&ni*@ng{_}o/f:_.L;=+I[]F~E*_+i=s£@_4$&2^',
            expectedText = '';

        component.input.nativeElement.value = text;
        component.directive.onPaste(<ClipboardEvent>{ preventDefault: () => {} });
        fixture.detectChanges();
        tick(1);

        expect(component.input.nativeElement.value).toBe(expectedText);
        expect(store.dispatch).toHaveBeenCalled();
    }));

    it('should filter based on MODELER_NAME_REGEX', () => {
        component.regex = MODELER_NAME_REGEX;
        fixture.detectChanges();
        const text = 'test2344';
        expect(component.directive.onKeyPress({key: '-' , target: {value: text, selectionStart: 2 }})).toBe(true);
        expect(component.directive.onKeyPress({key: '-' , target: {value: text, selectionStart: text.length }})).toBe(false);
        expect(component.directive.onKeyPress({key: '*' , target: {value: text, selectionStart: 2 }})).toBe(false);
    });
});
