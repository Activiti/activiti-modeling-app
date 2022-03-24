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

import { Component, Input, ElementRef, ViewChild, Inject, Optional, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { LogService } from '@alfresco/adf-core';
import { ModelUploader, AmaState, MODEL_UPLOADERS } from '@alfresco-dbp/modeling-shared/sdk';
@Component({
    selector: 'ama-upload-file-button',
    templateUrl: './upload-file-button.component.html',
    styleUrls: ['./upload-file-button.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UploadFileButtonComponent {
    @Input() type: string;
    @Input() projectId: string;
    @Output() fileUploaded = new EventEmitter();
    @ViewChild('fileInput', { static: true }) fileInput: ElementRef;

    get acceptedFileTypes(): string {
        if (this.uploader) {
            return this.uploader.acceptedFileType;
        } else {
            return null;
        }
    }

    private get uploader(): ModelUploader | null {
        if (this.uploaders && this.uploaders.length > 0) {
            return this.uploaders.filter(uploader => uploader.key ? uploader.key === this.type : uploader.type === this.type)[0];
        }
        return null;
    }

    constructor(
        private store: Store<AmaState>,
        private logger: LogService,
        @Optional()
        @Inject(MODEL_UPLOADERS)
        private uploaders: ModelUploader[]) {}

    onClick(event: Event): void {
        event.stopPropagation();
        this.fileInput.nativeElement.click();
    }

    onUpload(files: File[]): void {
        try {
            const uploader = this.uploader;

            if (uploader) {
                const ActionClass = this.uploader.action;

                this.store.dispatch(new ActionClass({ file: files[0], projectId: this.projectId }));
                this.fileInput.nativeElement.value = null;
                this.fileUploaded.emit('success');
            }
        } catch (error) {
            this.logger.error('Problem occurred while trying to upload model.');
            this.logger.error(error);
            this.fileUploaded.emit('error');
        }
    }
}
