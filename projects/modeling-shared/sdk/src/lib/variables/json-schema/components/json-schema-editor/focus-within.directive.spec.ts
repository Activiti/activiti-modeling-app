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

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { assert } from 'console';
import { FocusInsideElementDirective } from './focus-within.directive';

@Component({
    template: `<div modelingsdk-focus-element (focused)="onSelected($event)">
        <input type="text" id="test"/>
    </div>`
})
class TestComponent {
    onSelected($event: boolean) { assert($event === true); }
}

describe('FocusInsideElementDirective', () => {

    let fixture: ComponentFixture<TestComponent>;
    let spyOnSelected: jasmine.Spy;
    let input: DebugElement;
    let div: DebugElement;

    beforeEach(async () => {
        fixture = TestBed.configureTestingModule({
            declarations: [FocusInsideElementDirective, TestComponent]
        }).createComponent(TestComponent);

        fixture.detectChanges();
        await fixture.whenStable();

        div = fixture.debugElement.query(By.directive(FocusInsideElementDirective));
        input = fixture.debugElement.query(By.css('#test'));
        spyOnSelected = spyOn(fixture.componentInstance, 'onSelected');
    });

    it('should have added an event listener for focusin event', () => {
        div.nativeElement.dispatchEvent(new Event('focusin'));

        expect(spyOnSelected).toHaveBeenCalledWith(true);
    });

    it('should have added an event listener for focusout event', () => {
        div.nativeElement.dispatchEvent(new Event('focusout'));

        expect(spyOnSelected).toHaveBeenCalledWith(false);
    });

    it('should call selected when inner element get the focus', () => {
        input.nativeElement.dispatchEvent(new Event('focusin', { bubbles: true }));

        expect(spyOnSelected).toHaveBeenCalledWith(true);
    });

    it('should call selected when inner element lost the focus', () => {
        input.nativeElement.dispatchEvent(new Event('focusout', { bubbles: true }));

        expect(spyOnSelected).toHaveBeenCalledWith(false);
    });
});
