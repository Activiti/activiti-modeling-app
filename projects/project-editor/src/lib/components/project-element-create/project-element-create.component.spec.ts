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
import { ProjectElementCreateComponent } from './project-element-create.component';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService, TranslationMock, AppConfigService, AppConfigModule } from '@alfresco/adf-core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { AmaState, MODEL_CREATORS, ModelCreator, ModelCreatorDialogParams, CONNECTOR, OpenEntityDialogAction, selectSelectedProjectId } from '@alfresco-dbp/modeling-shared/sdk';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { UploadFileButtonComponent } from '../upload-file-button/upload-file-button.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProjectNavigationComponent', () => {
    let fixture: ComponentFixture<ProjectElementCreateComponent>;
    let store: Store<AmaState>;
    let appConfigService: AppConfigService;

    const processCreator: ModelCreator = {
        icon: 'device_hub',
        name: 'Processes',
        type: 'process',
        order: 1,
        dialog: <ModelCreatorDialogParams>{}
    };

    const formCreator: ModelCreator = {
        icon: 'stop',
        name: 'Cheese',
        type: 'form',
        order: 1,
        dialog: <ModelCreatorDialogParams>{}
    };

    const connectorCreator: ModelCreator = {
        icon: 'link',
        name: 'Connector',
        type: CONNECTOR,
        order: 1,
        dialog: <ModelCreatorDialogParams>{}
    };

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                MatIconModule,
                MatListModule,
                MatSidenavModule,
                AppConfigModule
            ],
            providers: [
                { provide: TranslationService, useClass: TranslationMock },
                { provide: MODEL_CREATORS, useValue: [processCreator, formCreator, connectorCreator] },
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation(selector => {
                            if (selector === selectSelectedProjectId) {
                                return of('project-id-whatever');
                            }
                            return of({});
                        }),
                        dispatch: jest.fn()
                    }
                },
                AppConfigService
            ],
            declarations: [ProjectElementCreateComponent, UploadFileButtonComponent],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectElementCreateComponent);
        store = TestBed.inject(Store);
        appConfigService = TestBed.inject(AppConfigService);
        fixture.detectChanges();
    });

    describe('CREATE section', () => {

        it('should have the "CREATE" section by default', () => {
            const selectedElement: HTMLOptionElement = fixture.nativeElement.querySelector(
                '[data-automation-id="ama-project-creator-create-section"].mat-list-single-selected-option'
            );

            expect(selectedElement).not.toBeNull();
            expect(selectedElement).toBeDefined();

            const listCreatorsElement = fixture.nativeElement.querySelectorAll('.ama-project-creator-filter-list mat-list-option');
            expect(listCreatorsElement.length).toBe(3);
        });

        it('should now show the connector create button when enableCustomConnectors is false', () => {
            spyOn(appConfigService, 'get').and.returnValue(false);
            fixture.detectChanges();

            const listCreatorsElement = fixture.nativeElement.querySelectorAll('.ama-project-creator-filter-list mat-list-option');
            expect(listCreatorsElement.length).toBe(2);
        });

        it('should show the connector create button when enableCustomConnectors is null', () => {
            spyOn(appConfigService, 'get').and.returnValue(null);
            fixture.detectChanges();

            const listCreatorsElement = fixture.nativeElement.querySelectorAll('.ama-project-creator-filter-list mat-list-option');
            expect(listCreatorsElement.length).toBe(3);
        });

        it('should trigger the create dialog when create button is clicked', () => {
            const listCreatorsElement = fixture.nativeElement.querySelectorAll('.ama-project-creator-filter-list mat-list-option');
            listCreatorsElement[0].click();
            fixture.detectChanges();

            expect(store.dispatch).toHaveBeenCalledWith(new OpenEntityDialogAction(processCreator.dialog));
        });
    });

    describe('UPLOAD section', () => {

        beforeEach(() => {
            const uploadSectionButton = fixture.nativeElement.querySelector('[data-automation-id="ama-project-creator-upload-section"]');
            uploadSectionButton.click();
            fixture.detectChanges();
        });

        it('should show the upload options', () => {
            const listUploadElement = fixture.nativeElement.querySelectorAll('.ama-project-upload-button-list .mat-list-option');
            expect(listUploadElement.length).toBe(3);
        });

        it('should now show the connector upload button when enableCustomConnectors is false', () => {
            spyOn(appConfigService, 'get').and.returnValue(false);
            fixture.detectChanges();

            const listUploadElement = fixture.nativeElement.querySelectorAll('.ama-project-upload-button-list .mat-list-option');
            expect(listUploadElement.length).toBe(2);
        });

        it('should show the connector upload button when enableCustomConnectors is null', () => {
            spyOn(appConfigService, 'get').and.returnValue(null);
            fixture.detectChanges();

            const listUploadElement = fixture.nativeElement.querySelectorAll('.ama-project-upload-button-list .mat-list-option');
            expect(listUploadElement.length).toBe(3);
        });
    });

    describe('IMPORT section', () => {

        beforeEach(() => {
            const uploadSectionButton = fixture.nativeElement.querySelector('[data-automation-id="ama-project-creator-import-section"]');
            uploadSectionButton.click();
            fixture.detectChanges();
        });

        it('should load the import select list', () => {
            const selectList = fixture.nativeElement.querySelector('ama-project-import-select-list');
            expect(selectList).not.toBeNull();
        });
    });

});
