/*!
 * @license
 * Alfresco Example Modeling Application
 *
 * Copyright (C) 2005 - 2018 Alfresco Software Limited
 *
 * This file is part of the Alfresco Example Modeling Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail.  Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Modeling Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Modeling Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { UploadProcessAttemptAction } from '../../store/actions/processes';
import { PROCESS_FILE_FORMAT } from '../../../common/helpers/create-entries-names';
import { PROCESS, AmaState} from 'ama-sdk';

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
                return PROCESS_FILE_FORMAT;

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
