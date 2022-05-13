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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslationService, TranslationMock } from '@alfresco/adf-core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { PropertiesViewerFileInputComponent } from './file-input.component';
import { of } from 'rxjs';
import { FileService } from '../../../services/file.service';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { activityFiles } from '../../../mocks/activity-files.mock';
import { FileVisibility } from '../../../api/types';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('PropertiesViewerArrayInputComponent', () => {
    let fixture: ComponentFixture<PropertiesViewerFileInputComponent>;
    let component: PropertiesViewerFileInputComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                MatSelectModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule,
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                {
                    provide: Store,
                    useValue: {
                        select() {
                            return of('project-id');
                        }
                    }
                },
                {
                    provide: FileService,
                    useValue: {
                        getFileList() {
                            return of(activityFiles);
                        }
                    }
                }
            ],
            declarations: [PropertiesViewerFileInputComponent],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertiesViewerFileInputComponent);
        component = fixture.componentInstance;
    });

    it('should contains list of all files', (done) => {
        component.ngOnInit();
        component.files.subscribe(files => {
            expect(files).toEqual(activityFiles);
            done();
        });
    });

    it('should allow only files with specific mime type', (done) => {
        component.extendedProperties = {
            allowedMimeTypes: ['image/png']
        };

        const pngFiles = activityFiles.filter(file => file.extensions?.content?.mimeType === 'image/png');

        component.ngOnInit();
        component.files.subscribe(files => {
            expect(files).toEqual(pngFiles);
            done();
        });
    });

    it('should allow only files with specific visibility flag', (done) => {
        component.extendedProperties = {
            showPublicFilesOnly: true,
        };

        const publicFiles = activityFiles.filter(file => file.extensions?.visibility === FileVisibility.Public);

        component.ngOnInit();
        component.files.subscribe(files => {
            expect(files).toEqual(publicFiles);
            done();
        });
    });

    it('should work if "extendedProperties" is set to "null"', (done) => {
        component.extendedProperties = null;

        component.ngOnInit();
        component.files.subscribe(files => {
            expect(files).toEqual(activityFiles);
            done();
        });
    });

    it('should show default option', async () => {
        spyOn(component.change, 'emit');
        component.value = activityFiles[0].extensions;
        fixture.detectChanges();

        const defaultSelectOption = {
            id: 'default-option',
            uri: 'default-option-uri'
        };

        component.extendedProperties = {
            defaultSelectOption,
        };

        const dropdownElement = fixture.debugElement.query(By.css('[data-automation-id="variable-value"]'));
        dropdownElement.nativeElement.click();
        fixture.detectChanges();

        const allOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));

        expect(allOptions.length).toBe(activityFiles.length + 1);
    });
});
