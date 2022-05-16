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

import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { ProcessService } from '../../services/process.service';
import { selectSelectedProjectId } from '../../store/app.selectors';
import { ProcessDropdownStructure, ProcessInfo } from '../../api/types';
import { AmaState } from '../../store/app.state';
const cloneDeep = require('lodash/cloneDeep');

/* cSpell:disable */
@Component({
    templateUrl: './process-name-selector.component.html'
})
/* cSpell:enable */

export class ProcessNameSelectorComponent implements OnInit {

    // eslint-disable-next-line
    @Output() change = new EventEmitter();
    @Input() value: string;
    @Input() disabled: boolean;
    @Input() required:  boolean;
    @Input() placeholder: string;
    @Input() extendedProperties: {
        plain: boolean;
        excludedProcesses: string[];
    };

    processes: Observable<ProcessDropdownStructure>;

    constructor(private store: Store<AmaState>, private processService: ProcessService) { }

    ngOnInit() {
        this.store.select(selectSelectedProjectId)
            .subscribe(projectId => {
                this.processes = this.processService.getProcesses(projectId).pipe(
                    map((processes) => this.filterProcesses(processes))
                );
            });
    }

    filterProcesses(processes): ProcessDropdownStructure {
        const filteredProcesses = cloneDeep(processes);
        if (this.extendedProperties && this.extendedProperties.excludedProcesses) {
            this.extendedProperties.excludedProcesses.map(
                (excludedProcess) => delete filteredProcesses[excludedProcess]
            );
        }
        return filteredProcesses;
    }

    onChange() {
        this.change.emit(this.value);
    }

    compareObjects(o1: ProcessInfo, o2: ProcessInfo | string): boolean {
        if (!o1 || !o2) {
            return false;
        } else {
            return o1 === o2;
        }
    }
}
