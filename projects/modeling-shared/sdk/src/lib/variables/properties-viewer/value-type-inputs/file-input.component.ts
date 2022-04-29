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
import { ActivitiFile, FileExtensions, FileVisibility } from '../../../api/types';
import { Store } from '@ngrx/store';
import { AmaState } from '../../../store/app.state';
import { selectSelectedProjectId } from '../../../store/app.selectors';
import { FileService } from '../../../services/file.service';
import { map } from 'rxjs/operators';

export interface FileInputExtendedProperties {
    showPublicFilesOnly?: boolean;
    allowedMimeTypes?: string[];
    defaultSelectOption?: FileExtensions;
}

@Component({
    template: `
    <mat-form-field>
        <mat-select
            (selectionChange)="onChange()"
            [(ngModel)]="value"
            [compareWith]="compareObjects"
            [placeholder]="(placeholder ? placeholder : 'SDK.VALUE') | translate"
            data-automation-id="variable-value"
            [disabled]="disabled"
        >

            <mat-option
                *ngIf="extendedProperties?.defaultSelectOption"
                [value]="extendedProperties?.defaultSelectOption"
            >
                {{extendedProperties.defaultSelectOption.name}}
            </mat-option>

            <mat-option *ngFor="let file of files | async" [value]="file.extensions">
                {{file.name}}
            </mat-option>
        </mat-select>
    </mat-form-field>
    `
})

export class PropertiesViewerFileInputComponent implements OnInit {

    // eslint-disable-next-line
    @Output() change = new EventEmitter();
    @Input() value: FileExtensions;
    @Input() disabled: boolean;
    @Input() placeholder;

    @Input() extendedProperties?: FileInputExtendedProperties;

    projectId: string;
    files: Observable<ActivitiFile[]>;

    constructor(private store: Store<AmaState>, private fileService: FileService) { }

    ngOnInit() {
        const {
            allowedMimeTypes,
            showPublicFilesOnly
        } = this.extendedProperties ?? {};

        this.store.select(selectSelectedProjectId)
            .subscribe(
                projectId => this.files = this.fileService.getFileList(projectId).pipe(
                    map(activitiFiles => {
                        if (allowedMimeTypes?.length > 0) {
                            activitiFiles = activitiFiles.filter(
                                file => allowedMimeTypes.includes(file.extensions.content?.mimeType)
                            );
                        }

                        if (showPublicFilesOnly) {
                            activitiFiles = activitiFiles.filter(
                                file => file.extensions.visibility === FileVisibility.Public
                            );
                        }

                        return activitiFiles;
                    })
                )
            );
    }

    onChange() {
        this.change.emit(this.value);
    }

    compareObjects(o1?: FileExtensions, o2?: FileExtensions): boolean {
        if (!o1 || !o2) {
            return false;
        } else {
            return o1.uri === o2.uri;
        }
    }
}
