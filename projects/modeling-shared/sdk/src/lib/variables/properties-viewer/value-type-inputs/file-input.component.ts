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
import { FileService } from '../file.service';
import { Observable } from 'rxjs';
import { ActivitiFile } from '../../../api/types';
import { Store } from '@ngrx/store';
import { AmaState } from '../../../store/app.state';
import { selectSelectedProjectId } from '../../../store/app.selectors';

@Component({
    template: `
    <mat-form-field>
        <mat-select (selectionChange)="onChange()" [compareWith]="compareObjects"
        [(ngModel)]="value" data-automation-id="variable-value" [disabled]="disabled">
            <mat-option *ngFor="let file of files | async" [value]="file.extensions">
                {{file.name}}
            </mat-option>
        </mat-select>
    </mat-form-field>
    `
})

export class PropertiesViewerFileInputComponent implements OnInit {

    // tslint:disable-next-line
    @Output() change = new EventEmitter();
    @Input() value: ActivitiFile;
    @Input() disabled: boolean;

    projectId: string;
    files: Observable<ActivitiFile[]>;

    constructor(private store: Store<AmaState>, private fileService: FileService) { }

    ngOnInit() {
        this.store.select(selectSelectedProjectId)
            .subscribe(projectId => this.files = this.fileService.getList(projectId));
    }
    onChange() {
        this.change.emit(this.value);
    }

    compareObjects(o1: any, o2: any): boolean {
        if (!o1 || !o2) {
            return false;
        } else {
            return o1.uri === o2.uri;
        }
    }
}
