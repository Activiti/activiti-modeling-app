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
import { CardItemTypeService, CardViewUpdateService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { CalledElementItemModel } from './called-element-item.model';
import { selectProcessesArray } from '../../../store/process-editor.selectors';
import { Observable, Subject, of, zip } from 'rxjs';
import { filter, take, takeUntil, switchMap, map, tap } from 'rxjs/operators';
import {
    AmaState,
    Process,
    selectProcessPropertiesArray,
    selectProcessPropertiesArrayFor,
    selectProcessMappingsFor,
    UpdateServiceParametersAction,
    selectSelectedProcess
} from 'ama-sdk';

@Component({
    selector: 'ama-process-called-element',
    templateUrl: './called-element-item.component.html',
    providers: [CardItemTypeService]
})
export class CardViewCalledItemItemComponent implements OnInit, OnDestroy {
    @Input() property: CalledElementItemModel;

    onDestroy$: Subject<void> = new Subject<void>();
    processes$: Observable<Process[]>;
    processId: string;
    processVariables$;
    subProcessVariables$;
    mapping = {};

    constructor(
        private cardViewUpdateService: CardViewUpdateService,
        private store: Store<AmaState>
    ) {}

    ngOnInit() {
        this.processes$ = this.store.select(selectProcessesArray).pipe(
            switchMap(processes => zip(of(processes), this.store.select(selectSelectedProcess))),
            map(([processes, selectedProcess]) => processes.filter(process => process.id !== selectedProcess.id))
        );
        this.processId = this.property.value;
        this.loadVariables();

        this.store.select(selectProcessMappingsFor(this.property.data.id))
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((mapping) => {
                this.mapping = mapping;
            });
    }

    loadVariables() {
        this.processVariables$ = this.store.select(selectProcessPropertiesArray);
        this.subProcessVariables$ = this.store.select(selectProcessPropertiesArrayFor(this.processId));
    }

    changeProcess() {
        this.cardViewUpdateService.update(this.property, this.processId);
        this.loadVariables();
    }

    updateMapping(mapping, type): void {
        this.mapping = { ...this.mapping, [type]: mapping };
        this.store.select(selectSelectedProcess).pipe(
            filter(process => !!process),
            take(1)
        ).subscribe(process => this.store.dispatch(new UpdateServiceParametersAction(process.id, this.property.data.id, this.mapping)));
    }

    ngOnDestroy() {
        this.onDestroy$.complete();
    }
}
