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

import { UploadFileButtonComponent } from './upload-file-button.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { AmaState, MODEL_UPLOADERS, PROCESS, ValidateProjectAttemptAction, VALIDATE_PROJECT_ATTEMPT } from '@alfresco-dbp/modeling-shared/sdk';
import { HttpClientModule } from '@angular/common/http';

describe('UploadFileButtonComponent', () => {
    let component: UploadFileButtonComponent;
    let fixture: ComponentFixture<UploadFileButtonComponent>;
    let store: Store<AmaState>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                MatTooltipModule,
                HttpClientModule,
                MatIconModule
            ],
            declarations: [
                UploadFileButtonComponent
            ],
            providers: [
                {
                    provide: Store,
                    useValue: {dispatch: jest.fn()}
                },
                {
                    provide: MODEL_UPLOADERS,
                    useValue: {
                        type: PROCESS,
                        acceptedFileType: '.xml',
                        action: ValidateProjectAttemptAction
                    },
                    multi: true
                }
            ]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UploadFileButtonComponent);
        store = TestBed.inject(Store);
        component = fixture.componentInstance;
        component.projectId = 'projectId';
    });

    it('should test acceptedFileTypes getter if type is process', () => {
        component.type = 'process';
        const result = component.acceptedFileTypes;
        expect(result).toBe('.xml');
    });

    it('should test acceptedFileTypes getter if type is not process', () => {
        component.type = 'test';
        const result = component.acceptedFileTypes;
        expect(result).toBe(null);
    });

    it('clicking on the upload button should fire a click event on input field', () => {
        spyOn(component.fileInput.nativeElement, 'click');
        const button = fixture.nativeElement.querySelector('[data-automation-id="upload-button-ref"]');
        button.click();

        expect(component.fileInput.nativeElement.click).toHaveBeenCalled();
    });

    it('onUpload method should dispatch the provided action if type is defined', () => {
        const dispatchSpy = spyOn(store, 'dispatch');

        component.type = 'process';
        const inputField = fixture.nativeElement.querySelector('input');
        inputField.dispatchEvent(new Event('change'));

        const uploadAction: ValidateProjectAttemptAction = dispatchSpy.calls.argsFor(0)[0];
        expect(uploadAction.type).toBe(VALIDATE_PROJECT_ATTEMPT);
        expect(store.dispatch).toHaveBeenCalledWith(uploadAction);
        expect(inputField.value).toBe('');
    });

    it ('onUpload method should not dispatch any action if type is different than defined', () => {
        component.type = 'test';
        spyOn(store, 'dispatch');

        const inputField = fixture.nativeElement.querySelector('input');
        inputField.dispatchEvent(new Event('change'));
        expect(store.dispatch).not.toHaveBeenCalled();
    });
});
