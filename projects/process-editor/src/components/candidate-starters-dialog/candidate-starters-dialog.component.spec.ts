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
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UuidService } from '@alfresco-dbp/modeling-shared/sdk';
import { CoreModule, TranslationService, TranslationMock, AlfrescoApiService } from '@alfresco/adf-core';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CandidateStartersDialogComponent } from './candidate-starters-dialog.component';
import { ProcessServicesCloudModule } from '@alfresco/adf-process-services-cloud';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { DialogService } from '@alfresco-dbp/adf-candidates/core/dialog';

describe('CandidateStartersDialogComponent', () => {
    let fixture: ComponentFixture<CandidateStartersDialogComponent>;
    let component: CandidateStartersDialogComponent;
    let alfrescoApiService: AlfrescoApiService;

    const mockDialogRef = {
        close: jasmine.createSpy('close'),
        open: jasmine.createSpy('open')
    };

    const mockDialogData = {
        assignee: ['mock assignee'],
        candidateStarterUsers: [],
        candidateStarterGroups: [],
        candidateStartersUpdate$: new Subject<any>(),
        shapeId: 'shapeId'
    };

    const mockOauthApi = {
        oauth2Auth: {
            callCustomApi: () => Promise.resolve([])
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forChild(),
                ProcessServicesCloudModule,
                MonacoEditorModule.forRoot(),
                MatIconModule,
                TranslateModule.forRoot(),
                NoopAnimationsModule,
                HttpClientTestingModule,
                MatTooltipModule,
                MatChipsModule,
                MatCardModule,
                MatDialogModule,
                MatSelectModule
            ],
            providers: [
                DialogService,
                { provide: TranslationService, useClass: TranslationMock },
                {
                    provide: UuidService,
                    useValue: {
                        generate: () => 'generated-uuid'
                    }
                },
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
            ],
            declarations: [CandidateStartersDialogComponent]
        });

        fixture = TestBed.createComponent(CandidateStartersDialogComponent);
        component = fixture.componentInstance;
        alfrescoApiService = TestBed.inject(AlfrescoApiService);
        component.settings = mockDialogData;
        spyOn(alfrescoApiService, 'getInstance').and.returnValue(mockOauthApi);
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('Should be disable assign button if the candidate user is invalid', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        const assignButton = fixture.debugElement.query(By.css(`#ama-assign-button`));
        const assigneeInput = fixture.debugElement.query(By.css('[data-automation-id="adf-people-cloud-search-input"]'));

        assigneeInput.nativeElement.value = 'assignee user';
        assigneeInput.nativeElement.dispatchEvent(new Event('input'));

        expect(assignButton.nativeElement['disabled']).toBeTruthy();
    });

    it('Should be disable assign button if one of the candidates user/group is invalid', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        const assignButton = fixture.debugElement.query(By.css(`#ama-assign-button`));
        const candidateUserInput = fixture.debugElement.query(By.css('[data-automation-id="adf-people-cloud-search-input"]'));
        const candidateGroupInput = fixture.debugElement.query(By.css('[data-automation-id="adf-cloud-group-search-input"]'));

        candidateUserInput.nativeElement.value = 'Candidate user';
        candidateUserInput.nativeElement.dispatchEvent(new Event('input'));

        candidateGroupInput.nativeElement.value = 'Candidate group';
        candidateGroupInput.nativeElement.dispatchEvent(new Event('input'));

        expect(assignButton.nativeElement['disabled']).toBeTruthy();
    });

    it('Should show warning message on candidate assignment if the value is not correct', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        const candidateUserInput = fixture.debugElement.query(By.css('[data-automation-id="adf-people-cloud-search-input"]'));
        candidateUserInput.nativeElement.value = ' ';
        candidateUserInput.nativeElement.dispatchEvent(new Event('input'));
        candidateUserInput.nativeElement.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        const warningMessage = fixture.debugElement.query(By.css(`[data-automation-id="invalid-users-typing-error"] .adf-error-text`));
        expect(warningMessage.nativeElement.textContent).toBe('ADF_CLOUD_USERS.ERROR.NOT_FOUND');
    });
});
