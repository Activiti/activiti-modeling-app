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

import { TranslationService } from '@alfresco/adf-core';
import { AfterViewInit, Directive, ElementRef, Injector, OnDestroy, Renderer2 } from '@angular/core';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
    selector: '[modelingsdk-input-error]'
})
export class InputErrorDirective implements AfterViewInit, OnDestroy {
    errors: string[] = [];
    inputRef: MatFormFieldControl<MatInput>;
    onDestroy$ = new Subject<boolean>();

    constructor(
        private _inj: Injector,
        private elementRef: ElementRef,
        private translationService: TranslationService,
        private renderer: Renderer2
    ) { }

    ngAfterViewInit() {
        const container = this._inj.get(MatFormField);
        this.inputRef = container._control;

        this.inputRef.ngControl.statusChanges.pipe(takeUntil(this.onDestroy$)).subscribe(state => this.updateErrors(state));
    }

    private updateErrors = (state: 'VALID' | 'INVALID') => {
        this.initializeErrors();
        if (state === 'INVALID') {
            const controlErrors = this.inputRef.ngControl.errors;

            Object.keys(controlErrors).forEach(error => {
                switch (error) {
                case 'required':
                    this.errors.push(this.translationService.instant('SDK.VARIABLE_TYPE_INPUT.VALIDATION.REQUIRED'));
                    break;
                case 'pattern':
                    this.errors.push(this.translationService.instant('SDK.VARIABLE_TYPE_INPUT.VALIDATION.INVALID_FORMAT', {
                        error: this.inputRef.ngControl.getError(error)['requiredPattern']
                    }));
                    break;
                case 'minlength':
                    this.errors.push(this.translationService.instant('SDK.VARIABLE_TYPE_INPUT.VALIDATION.INVALID_MIN_LENGTH', {
                        error: this.inputRef.ngControl.getError(error)['requiredLength']
                    }));
                    break;
                case 'maxlength':
                    this.errors.push(this.translationService.instant('SDK.VARIABLE_TYPE_INPUT.VALIDATION.INVALID_MAX_LENGTH', {
                        error: this.inputRef.ngControl.getError(error)['requiredLength']
                    }));
                    break;
                case 'min':
                    this.errors.push(this.translationService.instant('SDK.VARIABLE_TYPE_INPUT.VALIDATION.INVALID_MIN_VALUE', {
                        error: this.inputRef.ngControl.getError(error)[error]
                    }));
                    break;
                case 'max':
                    this.errors.push(this.translationService.instant('SDK.VARIABLE_TYPE_INPUT.VALIDATION.INVALID_MAX_VALUE', {
                        error: this.inputRef.ngControl.getError(error)[error]
                    }));
                    break;
                case 'multipleOf':
                    this.errors.push(this.translationService.instant('SDK.VARIABLE_TYPE_INPUT.VALIDATION.INVALID_MULTIPLE_OF_VALUE', {
                        error: this.inputRef.ngControl.getError(error)[error]
                    }));
                    break;
                default:
                    this.errors.push(this.translationService.instant('SDK.VARIABLE_TYPE_INPUT.VALIDATION.GENERIC_ERROR', {
                        error_1: error,
                        error_2: JSON.stringify(this.inputRef.ngControl.getError(error))
                    }));
                    break;
                }
            });

        }

        this.errors.forEach(error => {
            const errorMsg = this.renderer.createElement('div');
            this.renderer.appendChild(errorMsg, this.renderer.createText(error));
            this.renderer.appendChild(this.elementRef.nativeElement, errorMsg);
        });
    };

    initializeErrors() {
        this.errors = [];
        const childElements = this.elementRef.nativeElement.children;
        for (const child of childElements) {
            this.renderer.removeChild(this.elementRef.nativeElement, child);
        }
    }

    ngOnDestroy(): void {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
