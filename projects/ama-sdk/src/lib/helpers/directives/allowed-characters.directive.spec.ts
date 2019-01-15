 /*!
 * @license
 * Copyright 2018 Alfresco, Inc. and/or its affiliates.
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
import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';

@Component({
    template: `<input #input type="text" [amasdk-allowed-characters] />`
})
class TestComponent {
    @ViewChild(AllowedCharactersDirective)
    public directive: AllowedCharactersDirective;

    @ViewChild('input')
    public input: ElementRef;
}

describe('AllowedCharactersDirective', () => {
    let component: TestComponent,
        fixture: ComponentFixture<TestComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule],
            declarations: [
                AllowedCharactersDirective,
                TestComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should filter every not allowed letter by default value on key press', () => {
        const text = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'.split('');
        const notAllowedText = '`=+-$%^&*@'.split('');

        for (const char of text) {
            expect(component.directive.onKeyPress({ key: char })).toBe(true);
        }

        for (const char of notAllowedText) {
            expect(component.directive.onKeyPress({ key: char })).toBe(false);
        }
    });

    it('should filter every not allowed letter by default value on paste', fakeAsync(() => {
        const text = 'T=h+e-_m$%ea^&ni*@ng{_}o/f:_.L;=+I[]F~E*_+i=s£@_4$&2^',
            expectedText = 'The_meaning_of_LIFE_is_42';

        component.input.nativeElement.value = text;
        component.directive.onPaste(<ClipboardEvent>{ preventDefault: () => {} });
        fixture.detectChanges();
        tick(1);

        expect(component.input.nativeElement.value).toBe(expectedText);
    }));
});
