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

import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CardItemTypeService, CardViewUpdateService, LogService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { selectProcessMappingsFor, UpdateServiceParametersAction, ImplementationItemModel, selectOpenedModel, AmaState } from '@alfresco-dbp/modeling-shared/sdk';

@Component({
    selector: 'ama-process-implementation',
    templateUrl: './implementation-item.component.html',
    providers: [CardItemTypeService]
})
export class CardViewImplementationItemComponent implements OnInit, OnDestroy {
    @Input() property: ImplementationItemModel;

    implementation: string;
    inputs: string;
    outputs: string;
    onDestroy$: Subject<void> = new Subject();

    constructor(
        private cardViewUpdateService: CardViewUpdateService,
        private store: Store<AmaState>,
        private logService: LogService
    ) { }

    ngOnInit() {
        this.implementation = this.property.value;
        this.store.select(selectProcessMappingsFor(this.property.data.processId, this.elementId)).pipe(
            takeUntil(this.onDestroy$)
        ).subscribe(mappings => {
            this.inputs = JSON.stringify(mappings.inputs);
            this.outputs = JSON.stringify(mappings.outputs);
        });
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    changeImplementation(): void {
        this.cardViewUpdateService.update(this.property, this.implementation);
    }

    changeVariablesMapping(): void {
        try {
            let inputs, outputs;

            try {
                inputs = JSON.parse(this.inputs);
            } catch {
                inputs = {};
            }

            try {
                outputs = JSON.parse(this.outputs);
            } catch {
                outputs = {};
            }

            this.store.select(selectOpenedModel).pipe(takeUntil(this.onDestroy$)).subscribe(openedModel => {
                this.store.dispatch(
                    new UpdateServiceParametersAction(openedModel.id, this.property.data.processId, this.elementId, { inputs, outputs })
                );
            });
        } catch (error) {
            this.logService.error(error);
        }
    }

    private get elementId() {
        return this.property.data.id;
    }
}
