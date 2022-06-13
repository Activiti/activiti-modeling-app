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

import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { PROCESS_MODEL_ENTITY_SELECTORS } from '../../../store/process-editor.selectors';
import { filter, switchMap, take, takeUntil } from 'rxjs/operators';
import { AmaState, ModelEntitySelectors } from '@alfresco-dbp/modeling-shared/sdk';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { CardItemTypeService } from '@alfresco/adf-core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'ama-card-process-version',
    templateUrl: './process-version-item.component.html',
    styleUrls: ['./process-version-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [CardItemTypeService]
})
export class CardProcessVersionItemComponent implements OnInit, OnDestroy {
    onDestroy$: Subject<void> = new Subject<void>();
    version: string;

    constructor(
        private store: Store<AmaState>,
        @Inject(PROCESS_MODEL_ENTITY_SELECTORS)
        private entitySelector: ModelEntitySelectors,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.route.params
            .pipe(
                take(1),
                switchMap((params) => this.store.select(this.entitySelector.selectModelMetadataById(params.modelId))),
                filter(metadata => !!metadata),
                takeUntil(this.onDestroy$)
            ).subscribe(metadata => {
                this.version = metadata.version;
            });
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
