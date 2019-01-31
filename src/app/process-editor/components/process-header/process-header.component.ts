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

import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Process } from 'ama-sdk';
import { BreadcrumbItem } from 'ama-sdk';
import { Observable } from 'rxjs';

@Component({
    selector: 'ama-process-header',
    templateUrl: './process-header.component.html'
})
export class ProcessHeaderComponent {
    @Input() process: Process;
    @Input() breadcrumbs$: Observable<BreadcrumbItem[]>;

    @Output() save: EventEmitter<string> = new EventEmitter<string>();
    @Output() delete: EventEmitter<string> = new EventEmitter<string>();
    @Output() download: EventEmitter<Process> = new EventEmitter<Process>();

    constructor() {}

    onSaveClick(): void {
        this.save.emit(this.process.id);
    }

    onDownload(process: Process): void {
        this.download.emit(process);
    }

    deleteProcess(): void {
        this.delete.emit(this.process.id);
    }
}
