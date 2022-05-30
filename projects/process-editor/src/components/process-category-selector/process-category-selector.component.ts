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

import { AmaState } from '@alfresco-dbp/modeling-shared/sdk';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { selectProcessCategories } from '../../store/process-editor.selectors';

@Component({
    selector: 'ama-process-category-selector',
    templateUrl: './process-category-selector.component.html',
    styleUrls: ['./process-category-selector.component.scss']
})
export class ProcessCategorySelectorComponent implements OnInit {
    @Input()
    category = '';

    @Input()
    showLabel = true;

    @Output()
    categoryChange = new EventEmitter<string>();

    allCategories$: Observable<string[]>;
    filteredCategories$: Observable<string[]>;

    categorySearchInput = new FormControl();

    constructor(private store: Store<AmaState>) { }

    ngOnInit(): void {
        this.categorySearchInput.setValue(this.category);

        this.allCategories$ = this.store.select(selectProcessCategories);

        this.filteredCategories$ = this.allCategories$.pipe(
            map((allCategories) =>
                this.filterCategories(allCategories)
            )
        );

        this.categorySearchInput.valueChanges.pipe(
            tap((categoryInputValue) => this.categoryChange.emit(categoryInputValue)),
            switchMap(() => this.allCategories$.pipe(
                map((allCategories) => this.filterCategories(allCategories))
            )),
        ).subscribe(categories => {
            this.filteredCategories$ = of(categories);
        });
    }

    private filterCategories(categories: string[]): string[] {
        return categories.filter(
            category => category.toLowerCase().indexOf(this.categorySearchInput.value.toLowerCase()) > -1
        );
    }
}
