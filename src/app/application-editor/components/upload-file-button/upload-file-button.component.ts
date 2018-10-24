 /*!
 * @license
 * Copyright 2018 Alfresco, Inc. and/or its affiliates.
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

import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { UploadProcessAttemptAction } from '../../store/actions/processes';
import { PROCESS, AmaState } from 'ama-sdk';

@Component({
    selector: 'ama-upload-file-button',
    templateUrl: './upload-file-button.component.html'
})
export class UploadFileButtonComponent {
    @Input() type: string;
    @Input() applicationId: string;
    @ViewChild('fileInput') fileInput: ElementRef;

    get acceptedFileTypes(): string {
        switch (this.type) {
            case PROCESS:
                return '.xml';

            default:
                return null;
        }
    }

    constructor(private store: Store<AmaState>) {}

    onClick(event): void {
        event.stopPropagation();
        this.fileInput.nativeElement.click();
    }

    onUpload(files: File[]): void {
        const payload = { file: files[0], applicationId: this.applicationId };
        const actionMapping = {
            [PROCESS]: new UploadProcessAttemptAction(payload)
        };

        if (actionMapping[this.type]) {
            this.store.dispatch(actionMapping[this.type]);
        }

        this.fileInput.nativeElement.value = null;
    }
}
