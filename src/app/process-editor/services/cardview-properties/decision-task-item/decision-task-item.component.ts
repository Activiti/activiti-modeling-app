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
import { CardItemTypeService, LogService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
    selectProcessMappingsFor,
    UpdateServiceParametersAction,
    ImplementationItemModel,
    selectOpenedModel,
    AmaState,
    DECISION_TABLE_INPUT_PARAM_NAME,
    ServiceParameterMapping,
    MappingType
} from '@alfresco-dbp/modeling-shared/sdk';

@Component({
    selector: 'ama-process-decision-task',
    templateUrl: './decision-task-item.component.html',
    providers: [CardItemTypeService]
})
export class CardViewDecisionTaskItemComponent implements OnInit, OnDestroy {
    @Input() property: ImplementationItemModel;

    decisionTable: string;
    onDestroy$: Subject<void> = new Subject();

    constructor(private store: Store<AmaState>, private logService: LogService) {}

    ngOnInit() {
        this.store
            .select(selectProcessMappingsFor(this.property.data.processId, this.elementId))
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(mappings => {
                try {
                    this.decisionTable = mappings.inputs[DECISION_TABLE_INPUT_PARAM_NAME].value;
                } catch {
                    this.decisionTable = '';
                }
            });
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    changeDecisionTable(): void {
        try {
            const inputs: ServiceParameterMapping = {
                [DECISION_TABLE_INPUT_PARAM_NAME]: {
                    type: MappingType.static,
                    value: this.decisionTable
                }
            };

            this.store
                .select(selectOpenedModel)
                .pipe(takeUntil(this.onDestroy$))
                .subscribe(openedModel => {
                    this.store.dispatch(
                        new UpdateServiceParametersAction(openedModel.id, this.property.data.processId, this.elementId, { inputs })
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
