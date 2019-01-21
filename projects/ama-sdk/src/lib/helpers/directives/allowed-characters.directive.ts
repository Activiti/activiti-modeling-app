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

import { Directive, HostListener, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[amasdk-allowed-characters]'
})
export class AllowedCharactersDirective {
    /*tslint:disable-next-line:no-input-rename*/
    @Input('amasdk-allowed-characters') allowedChars = 'a-zA-Z0-9_';

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        return new RegExp(`^[${this.allowedChars}]*$`).test(event.key);
    }

    @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
        setTimeout(() => {
            const pastedText = this.el.nativeElement.value,
                negativeRegex = new RegExp(`[^${this.allowedChars}]`, 'g'),
                sanitizedValue = pastedText.replace(negativeRegex, '').replace(/\s/g, '');

            this.renderer.setProperty(this.el.nativeElement, 'value', sanitizedValue);
            this.el.nativeElement.dispatchEvent(new Event('input'));
            event.preventDefault();
        });
    }
}
