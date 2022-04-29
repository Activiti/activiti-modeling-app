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
import { MODELER_NAME_REGEX } from './../utils/create-entries-names';
import { Store } from '@ngrx/store';
import { AmaState } from '../../store/app.state';
import { SnackbarErrorAction } from '../../store/public-api';
import { TranslationService } from '@alfresco/adf-core';

@Directive({
    selector: '[modelingsdk-allowed-characters]'
})
export class AllowedCharactersDirective {

    /* eslint-disable-next-line @angular-eslint/no-input-rename */
    @Input('modelingsdk-allowed-characters') regexInput: RegExp = MODELER_NAME_REGEX;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private store: Store<AmaState>,
        private translationService: TranslationService
    ) {}

    get regex() {
        return this.regexInput || MODELER_NAME_REGEX;
    }

    @HostListener('keypress', ['$event']) onKeyPress(event) {
        const previousValue = event.target.value;
        const characterLocation = event.target.selectionStart;
        const newValue = [previousValue.slice(0, characterLocation), event.key, previousValue.slice(characterLocation)].join('');
        return this.validate(newValue);
    }

    @HostListener('paste', ['$event']) onPaste(event: Event) {
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
