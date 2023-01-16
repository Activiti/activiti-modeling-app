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
import { CandidateStartersDialogComponent, PermissionLevelTypes } from './candidate-starters-dialog.component';
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
        component.selectedPermissionLevel = PermissionLevelTypes.SPECIFIC;
        spyOn(alfrescoApiService, 'getInstance').and.returnValue(mockOauthApi);
        fixture.detectChanges();
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should be disable save button if the candidate user is invalid', () => {
        const saveButton = fixture.debugElement.query(By.css('[data-automation-id="ama-save-button"]'));
        const candidateUserInput = fixture.debugElement.query(By.css('[data-automation-id="adf-people-cloud-search-input"]'));

        candidateUserInput.nativeElement.value = 'assignee user';
        candidateUserInput.nativeElement.dispatchEvent(new Event('input'));

        expect(saveButton.nativeElement['disabled']).toBeTruthy();
    });

    it('should be disable save button if one of the candidates user/group is invalid', () => {
        const saveButton = fixture.debugElement.query(By.css('[data-automation-id="ama-save-button"]'));
        const candidateUserInput = fixture.debugElement.query(By.css('[data-automation-id="adf-people-cloud-search-input"]'));
        const candidateGroupInput = fixture.debugElement.query(By.css('[data-automation-id="adf-cloud-group-search-input"]'));

        candidateUserInput.nativeElement.value = 'Candidate user';
        candidateUserInput.nativeElement.dispatchEvent(new Event('input'));

        candidateGroupInput.nativeElement.value = 'Candidate group';
        candidateGroupInput.nativeElement.dispatchEvent(new Event('input'));

        expect(saveButton.nativeElement['disabled']).toBeTruthy();
    });

    it('should show warning message on candidate assignment if the value is not correct', () => {
        const candidateUserInput = fixture.debugElement.query(By.css('[data-automation-id="adf-people-cloud-search-input"]'));
        candidateUserInput.nativeElement.value = ' ';
        candidateUserInput.nativeElement.dispatchEvent(new Event('input'));
        candidateUserInput.nativeElement.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        const warningMessage = fixture.debugElement.query(By.css(`[data-automation-id="invalid-users-typing-error"] .adf-error-text`));
        expect(warningMessage.nativeElement.textContent).toBe('ADF_CLOUD_USERS.ERROR.NOT_FOUND');
    });

    it('should update payload when nobody can start the process', () => {
        const candidateStarterStrategySelectEl = fixture.debugElement.query(By.css('[data-automation-id="ama-candidate-starter-strategy-select"]'));
        candidateStarterStrategySelectEl.nativeElement.click();
        fixture.detectChanges();

        const selectCandidateStarterStrategyOptionEl = fixture.debugElement.query(By.css(`[data-automation-id="ama-permission-level-option-nobody"]`));
        selectCandidateStarterStrategyOptionEl.nativeElement.click();
        fixture.detectChanges();

        expect(component.candidateStartersPayload).toEqual({
            assignments: [
                {
                    key: 'candidateStarterUsers',
                    value: ''
                },
                {
                    key: 'candidateStarterGroups',
                    value: ''
                }
            ]});
    });

    it('should update payload when specific users/groups can start the process', () => {
        const expectedPayload = {
            assignments: [
                { key: 'candidateStarterUsers', value: 'mock candidateUser' },
                { key: 'candidateStarterGroups', value: 'mock candidateGroup' }
            ]
        };

        component.onCandidateStarterGroupsChange([{ name: 'mock candidateGroup' }]);
        component.onCandidateStarterUsersChange([{ username: 'mock candidateUser' }]);

        fixture.detectChanges();

        expect(component.candidateStartersPayload).toEqual(expectedPayload);
    });

    it('should update payload when everyone can start the process', () => {
        const candidateStarterStrategySelectEl = fixture.debugElement.query(By.css('[data-automation-id="ama-candidate-starter-strategy-select"]'));
        candidateStarterStrategySelectEl.nativeElement.click();
        fixture.detectChanges();

        const selectCandidateStarterStrategyOptionEl = fixture.debugElement.query(By.css(`[data-automation-id="ama-permission-level-option-everyone"]`));
        selectCandidateStarterStrategyOptionEl.nativeElement.click();
        fixture.detectChanges();

        expect(component.candidateStartersPayload).toBeUndefined();
    });

    it('should display the previous selected option as identity users/groups when opening the dialog', () => {
        component.settings.candidateStarterUsers = ['hruser', 'salesuser'];
        component.settings.candidateStarterGroups = ['hr'];

        component.ngOnInit();

        expect(component.selectedPermissionLevel).toBe(PermissionLevelTypes.SPECIFIC);
        expect(component.candidateStarterUsers).toEqual([
            {
                username: 'hruser'
            },
            {
                username: 'salesuser'
            }
        ]);
        expect(component.candidateStarterGroups).toEqual([
            {
                name: 'hr'
            }
        ]);
    });

    it('should display the previous selected option as nobody when opening the dialog', () => {
        component.settings.candidateStarterUsers = '';
        component.settings.candidateStarterGroups = '';

        component.ngOnInit();

        expect(component.selectedPermissionLevel).toBe(PermissionLevelTypes.NOBODY);
    });

    it('should update payload when opening the dialog [settings.candidateStarterUsers=emptyString, settings.candidateStarterGroups=emptyString]', () => {
        component.settings.candidateStarterUsers = '';
        component.settings.candidateStarterGroups = '';
        const expectedPayload = {
            assignments: [
                { key: 'candidateStarterUsers', value: '' },
                { key: 'candidateStarterGroups', value: '' }
            ]
        };

        component.ngOnInit();

        expect(component.candidateStartersPayload).toEqual(expectedPayload);
    });

    it('should display the previous selected option as nobody when opening the dialog [settings.candidateStarterUsers=emptyString]', () => {
        component.settings.candidateStarterUsers = '';
        component.settings.candidateStarterGroups = undefined;

        component.ngOnInit();

        expect(component.selectedPermissionLevel).toBe(PermissionLevelTypes.NOBODY);
    });

    it('should display the previous selected option as nobody when opening the dialog [settings.candidateStarterGroups=emptyString]', () => {
        component.settings.candidateStarterUsers = undefined;
        component.settings.candidateStarterGroups = '';

        component.ngOnInit();

        expect(component.selectedPermissionLevel).toBe(PermissionLevelTypes.NOBODY);
    });

    it('should update payload when opening the dialog [settings.candidateStarterGroups=emptyString]', () => {
        component.settings.candidateStarterUsers = undefined;
        component.settings.candidateStarterGroups = '';
        const expectedPayload = {
            assignments: [
                { key: 'candidateStarterUsers', value: '' },
                { key: 'candidateStarterGroups', value: '' }
            ]
        };

        component.ngOnInit();

        expect(component.candidateStartersPayload).toEqual(expectedPayload);
    });

    it('should update payload when opening the dialog [settings.candidateStarterUsers=emptyString]', () => {
        component.settings.candidateStarterUsers = '';
        component.settings.candidateStarterGroups = undefined;
        const expectedPayload = {
            assignments: [
                { key: 'candidateStarterUsers', value: '' },
                { key: 'candidateStarterGroups', value: '' }
            ]
        };

        component.ngOnInit();

        expect(component.candidateStartersPayload).toEqual(expectedPayload);
    });
});
