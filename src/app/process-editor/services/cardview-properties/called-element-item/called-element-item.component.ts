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
import { Subject, of, zip } from 'rxjs';
import { filter, take, takeUntil, switchMap, map } from 'rxjs/operators';
import {
    AmaState,
    Process,
    selectProcessPropertiesArrayFor,
    selectProcessMappingsFor,
    UpdateServiceParametersAction,
    selectSelectedProcess,
    ServiceParameterMapping,
    ProcessExtensionsModel,
    EntityProperty
} from '@alfresco-dbp/modeling-shared/sdk';
import { MatSelectChange } from '@angular/material';

@Component({
    selector: 'ama-process-called-element',
    templateUrl: './called-element-item.component.html',
    providers: [CardItemTypeService]
})
export class CardViewCalledItemItemComponent implements OnInit, OnDestroy {
    @Input() property: CalledElementItemModel;

    onDestroy$: Subject<void> = new Subject<void>();
    processDefinitions: Process[];
    processes: string[];
    processDefinition: Process;
    processId: string;
    sendNoVariables: boolean;
    processVariables$;
    subProcessVariables: EntityProperty[] = [];
    mapping = {};

    constructor(
        private cardViewUpdateService: CardViewUpdateService,
        private store: Store<AmaState>) { }

    ngOnInit() {
        this.processId = this.property.value;

        this.store.select(selectProcessesArray).pipe(
            switchMap(processes => zip(of(processes), this.store.select(selectSelectedProcess))),
            map(([processes, selectedProcess]) => processes.filter(process => process.id !== selectedProcess.id)),
            takeUntil(this.onDestroy$)
        ).subscribe((processDefinitions) => {
            this.processDefinitions = processDefinitions;
            this.loadCallActivity();
        });

        this.store.select(selectProcessMappingsFor(this.property.data.processId, this.property.data.id))
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((mapping) => {
                this.mapping = mapping;
                this.sendNoVariables = !!mapping.inputs && !!mapping.outputs
                    && !Object.values(mapping.inputs).length
                    && !Object.values(mapping.outputs).length;
            });
    }

    changeMappingType(event: MatSelectChange): void {
        this.sendNoVariables = event.value;
        this.mapping = this.sendNoVariables ? { inputs: {}, outputs: {} } : {};
        this.updateMapping();
    }

    loadVariables() {
        this.processVariables$ = this.store.select(selectProcessPropertiesArrayFor(this.property.data.processId));

        if (this.processId) {
            this.subProcessVariables = Object.values(new ProcessExtensionsModel(this.processDefinition.extensions).getProperties(this.processId));
        }
    }

    loadCallActivity() {
        this.processDefinition = this.processDefinitions.find((processDefinition) => !!processDefinition.extensions[this.processId]);
        if (this.processDefinition) {
            this.onProcessDefinitionSelected();
            this.loadVariables();
        }
    }

    onProcessDefinitionSelected() {
        this.processes = Object.keys(this.processDefinition.extensions);
        if (!this.processes.includes(this.processId)) {
            this.processId = undefined;
        }
    }

    onProcessSelected() {
        this.cardViewUpdateService.update(this.property, this.processId);
        this.loadVariables();
    }

    changeMapping(mapping: ServiceParameterMapping, type: string): void {
        this.mapping = { ...this.mapping, [type]: mapping };
        this.updateMapping();
    }

    updateMapping(): void {
        this.store.select(selectSelectedProcess).pipe(
            filter(process => !!process),
            take(1)
        ).subscribe(process => this.store.dispatch(
            new UpdateServiceParametersAction(process.id, this.property.data.processId, this.property.data.id, this.mapping)
        ));
    }

    ngOnDestroy() {
        this.onDestroy$.complete();
    }
}
