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

import { Directive, HostListener, ElementRef, Input, Renderer2 } from '@angular/core';
import { MODEL_NAME_CHARACTERS } from './../utils/create-entries-names';
import { Store } from '@ngrx/store';
import { AmaState } from '../../store/app.state';
import { SnackbarErrorAction } from '../../store/public_api';
import { TranslationService } from '@alfresco/adf-core';

@Directive({
    selector: '[amasdk-allowed-characters]'
})
export class AllowedCharactersDirective {

    defaultRegex: RegExp = new RegExp(`^[${MODEL_NAME_CHARACTERS}]*$`);

    /* tslint:disable-next-line:no-input-rename */
    @Input('amasdk-allowed-characters') regexInput: RegExp = this.defaultRegex;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private store: Store<AmaState>,
        private translationService: TranslationService
    ) {}

    get regex() {
        return this.regexInput || this.defaultRegex;
    }

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        return this.validate(event.target.value + event.key);
    }

    @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
        setTimeout(() => {
            const isValid = this.validate(this.el.nativeElement.value);

            if (!isValid) {
                this.renderer.setProperty(this.el.nativeElement, 'value', '');
                this.el.nativeElement.dispatchEvent(new Event('input'));
                event.preventDefault();

                const errorMessage = `${this.translationService.instant('SDK.SNACKBAR.PASTED_VALUE_NEEDS_TO_FOLLOW_PATTERN')}: /${this.regex}/`;
                this.store.dispatch(new SnackbarErrorAction(errorMessage));
            }
        });
    }

    private validate(value: string): boolean {
        return this.regex.test(value);
    }
}
