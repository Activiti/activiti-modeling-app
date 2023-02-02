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

import {
    ElementVariable,
    ExpressionSyntax,
    ProcessEditorElementVariablesService,
} from '@alfresco-dbp/modeling-shared/sdk';
import {
    CardItemTypeService,
    CardViewItemValidator,
    CardViewUpdateService,
} from '@alfresco/adf-core';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { DescriptionItemModel } from './description-item.model';

@Component({
    selector: 'ama-expression',
    templateUrl: './description-item.component.html',
    styleUrls: ['./description-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [CardItemTypeService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescriptionItemComponent implements OnChanges {
    @Input()
    property?: DescriptionItemModel;

    ExpressionSyntax = ExpressionSyntax;

    private errorsSubject$ = new BehaviorSubject<CardViewItemValidator[]>([]);

    errors$ = this.errorsSubject$.asObservable().pipe(distinctUntilChanged());
    processVariables$: Observable<ElementVariable[]> = of([]);

    constructor(
        private readonly variablesService: ProcessEditorElementVariablesService,
        private readonly cardViewUpdateService: CardViewUpdateService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.property && this.property?.data) {
            this.processVariables$ = this.variablesService
                .getAvailableVariablesForElement(this.property.data.element)
                .pipe(
                    map((availableVariables) =>
                        this.variablesService.getVariablesList(
                            availableVariables
                        )
                    )
                );
        }
    }

    onExpressionChange(expression: string) {
        if (this.property.isValid(expression)) {
            this.property.value = expression;
            this.cardViewUpdateService.update(this.property, expression);
            this.resetErrorMessages();
        } else {
            this.errorsSubject$.next(
                this.property.getValidationErrors(expression)
            );
        }
    }

    private resetErrorMessages() {
        this.errorsSubject$.next([]);
    }
}
