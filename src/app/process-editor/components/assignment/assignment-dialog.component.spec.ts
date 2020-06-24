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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MatIconModule, MatDialogRef, MAT_DIALOG_DATA, MatCardModule, MatTooltipModule, MatChipsModule, MatDialogModule, MatSelectModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AmaTitleService, CodeEditorModule, AssignmentMode, AssignmentType } from '@alfresco-dbp/modeling-shared/sdk';
import { CoreModule, TranslationService, TranslationMock, IdentityGroupService, IdentityUserService, AlfrescoApiService } from '@alfresco/adf-core';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subject, BehaviorSubject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AssignmentDialogComponent, AssignmentModel, AssignmentTabs } from './assignment-dialog.component';
import { ProcessServicesCloudModule } from '@alfresco/adf-process-services-cloud';
import { MonacoEditorModule } from 'ngx-monaco-editor';

describe('AssignmentDialogComponent', () => {
    let fixture: ComponentFixture<AssignmentDialogComponent>;
    let component: AssignmentDialogComponent;
    let alfrescoApiService: AlfrescoApiService;

    const mockDialogRef = {
        close: jasmine.createSpy('close'),
        open: jasmine.createSpy('open')
    };

    const mockProcessVariable = [
        {
            'id': 'bad8507d-e433-4c01-87b1-89bce557c07e',
            'name': 'processName',
            'type': 'string',
            'required': false
        },
        {
            'id': 'ee401d8a-e9a9-410b-8a15-c12f3e3a9999',
            'name': 'processId',
            'type': 'string',
            'required': false
        }
    ];

    const mockCandidates =  { candidateUsers: '${var1}', candidateGroups: '${var2}' };
    const mockEmptyCandidates =  AssignmentDialogComponent.CANDIDATES_CONTENT;
    const mockOneValidCandidate = JSON.stringify({ candidateUsers: '${var1}', candidateGroups: '${}' });

    const mockStreams = {
        processVariables: new BehaviorSubject(mockProcessVariable),
        assignments: new BehaviorSubject<any>({
            type: AssignmentType.static,
            assignment: AssignmentMode.assignee,
            id: 'mock-shape-id'
        })
    };

    const mockDialogData = {
        assignee: ['mock assignee'],
        candidateUsers: [],
        candidateGroups: [],
        assignmentUpdate$: new Subject<AssignmentModel>(),
        shapeId: 'shapeId'
      };

      const mockOauthApi = {
        oauth2Auth: {
            callCustomApi: () => Promise.resolve([])
        }
    };

      function openSelect() {
        const dropdown = fixture.debugElement.query(By.css('[class="mat-select-trigger"]'));
        dropdown.triggerEventHandler('click', null);
        fixture.detectChanges();
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
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
                CodeEditorModule,
                MatIconModule,
                MatSelectModule
            ],
            providers: [
                AmaTitleService,
                IdentityGroupService,
                IdentityUserService,
                { provide: TranslationService, useClass: TranslationMock },
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation((selector) => {
                            return mockStreams.assignments;
                        }),
                        dispatch: jest.fn()
                    }
                }
            ],
            declarations: [AssignmentDialogComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AssignmentDialogComponent);
        component = fixture.componentInstance;
        alfrescoApiService = TestBed.get(AlfrescoApiService);
        component.settings = mockDialogData;
        spyOn(alfrescoApiService, 'getInstance').and.returnValue(mockOauthApi);
    });

    afterAll(() => {
        mockStreams.assignments.complete();
        mockStreams.processVariables.complete();
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    describe('Form Disable', () => {

        it('Should disable assign button if mode type changed single to candidates)', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const assignButton = fixture.debugElement.query(By.css(`#ama-assign-button`));
                const nameInput = fixture.debugElement.query(By.css(`[data-automation-id="ama-assignment-static-single-user-input"]`));
                nameInput.nativeElement.value = 'add mock static assignee';
                nameInput.nativeElement.dispatchEvent(new Event('input'));
                nameInput.nativeElement.dispatchEvent(new Event('blur'));
                fixture.detectChanges();
                expect(component.assigneeStaticControl.value).toBe('add mock static assignee');
                expect(assignButton.nativeElement['disabled']).toBeFalsy();
                openSelect();
                const candidateOption = fixture.debugElement.query(By.css('[data-automation-id="ama-assignment-option-candidates"]'));
                candidateOption.nativeElement.click();
                fixture.detectChanges();
                expect(assignButton.nativeElement['disabled']).toBeTruthy();
            });
        }));

        it('Should show warning message on static candidate assignment if the values are not set', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {

                openSelect();
                const candidateOption = fixture.debugElement.query(By.css('[data-automation-id="ama-assignment-option-candidates"]'));
                candidateOption.nativeElement.click();
                fixture.detectChanges();

                const nameInput = fixture.debugElement.query(By.css(`[data-automation-id="ama-assignment-static-candidate-groups-input"]`));
                nameInput.nativeElement.value = '';
                nameInput.nativeElement.dispatchEvent(new Event('input'));
                nameInput.nativeElement.dispatchEvent(new Event('blur'));
                fixture.detectChanges();
                expect(component.candidateGroupsStaticControl.value).toBe('');

                const warningMessage = fixture.debugElement.query(By.css(`[data-automation-id="candidate-warning"]`));
                expect(warningMessage.nativeElement).toBeDefined();
            });
        }));

        it('Should not show warning message on static candidate assignment if one value are set', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {

                openSelect();
                const candidateOption = fixture.debugElement.query(By.css('[data-automation-id="ama-assignment-option-candidates"]'));
                candidateOption.nativeElement.click();
                fixture.detectChanges();

                const nameInput = fixture.debugElement.query(By.css(`[data-automation-id="ama-assignment-static-candidate-groups-input"]`));
                nameInput.nativeElement.value = 'add mock static group assignee';
                nameInput.nativeElement.dispatchEvent(new Event('input'));
                nameInput.nativeElement.dispatchEvent(new Event('blur'));
                fixture.detectChanges();
                expect(component.candidateGroupsStaticControl.value).toBe('add mock static group assignee');
                const warningMessage = fixture.debugElement.query(By.css(`[data-automation-id="candidate-warning"]`));
                expect(warningMessage).toBeNull();
            });
        }));

        it('Should disable assign button if mode type changed candidates to single', async(() => {
            mockStreams.assignments.next({
                type: AssignmentType.identity,
                assignment: AssignmentMode.candidates,
                id: 'mock-shape-id'
            });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const assignButton = fixture.debugElement.query(By.css(`#ama-assign-button`));
                const candidateUserInput = fixture.debugElement.query(By.css('[data-automation-id="adf-people-cloud-search-input"]'));
                const candidateGroupInput = fixture.debugElement.query(By.css('[data-automation-id="adf-cloud-group-search-input"]'));

                candidateUserInput.nativeElement.value = 'Candidate user';
                candidateUserInput.nativeElement.dispatchEvent(new Event('input'));

                candidateGroupInput.nativeElement.value = 'Candidate group';
                candidateGroupInput.nativeElement.dispatchEvent(new Event('input'));

                expect(component.candidateUsersIdentityControl.value).toBe('Candidate user');
                expect(component.candidateGroupsIdentityControl.value).toBe('Candidate group');

                fixture.detectChanges();
                openSelect();
                const assigneeOption = fixture.debugElement.query(By.css('[data-automation-id="ama-assignment-option-assignee"]'));
                assigneeOption.nativeElement.click();
                fixture.detectChanges();
                expect(assignButton.nativeElement['disabled']).toBeTruthy();
            });
        }));

        it('Should be disable assign button if the identity assignee is invalid', async(() => {
            mockStreams.assignments.next({
                type: AssignmentType.identity,
                assignment: AssignmentMode.assignee,
                id: 'mock-shape-id'
            });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const assignButton = fixture.debugElement.query(By.css(`#ama-assign-button`));
                const assigneeInput = fixture.debugElement.query(By.css('[data-automation-id="adf-people-cloud-search-input"]'));

                assigneeInput.nativeElement.value = 'assignee user';
                assigneeInput.nativeElement.dispatchEvent(new Event('input'));

                expect(assignButton.nativeElement['disabled']).toBeTruthy();
            });
        }));

        it('Should be disable assign button if one of the identity candidates is invalid', async(() => {
            mockStreams.assignments.next({
                type: AssignmentType.identity,
                assignment: AssignmentMode.candidates,
                id: 'mock-shape-id'
            });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const assignButton = fixture.debugElement.query(By.css(`#ama-assign-button`));
                const candidateUserInput = fixture.debugElement.query(By.css('[data-automation-id="adf-people-cloud-search-input"]'));
                const candidateGroupInput = fixture.debugElement.query(By.css('[data-automation-id="adf-cloud-group-search-input"]'));

                candidateUserInput.nativeElement.value = 'Candidate user';
                candidateUserInput.nativeElement.dispatchEvent(new Event('input'));

                candidateGroupInput.nativeElement.value = 'Candidate group';
                candidateGroupInput.nativeElement.dispatchEvent(new Event('input'));

                expect(assignButton.nativeElement['disabled']).toBeTruthy();
            });
        }));

        it('Should disable assign button if both candidate expressions are empty', async(() => {
            mockStreams.assignments.next({
                type: AssignmentType.expression,
                assignment: AssignmentMode.candidates,
                id: 'mock-shape-id'
            });
            mockStreams.processVariables.next(mockProcessVariable);
            component.settings = {
                assignee: [],
                candidateUsers: [mockCandidates.candidateUsers],
                candidateGroups: [],
                assignmentUpdate$: new Subject<AssignmentModel>(),
                shapeId: 'shapeId',
                processId: 'Process_12345678'
              };
            fixture.detectChanges();
            component.processVariables$ = mockStreams.processVariables;
            mockStreams.processVariables.next(mockProcessVariable);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const editor = fixture.debugElement.query(By.css('.monaco-editor'));
                const assignButton = fixture.debugElement.query(By.css(`#ama-assign-button`));
                expect(editor).not.toBeNull();
                expect(assignButton.nativeElement['disabled']).toBeTruthy();
                component.onExpressionChange(mockEmptyCandidates);
                fixture.detectChanges();
                expect(assignButton.nativeElement['disabled']).toBeTruthy();
            });
        }));

        it('Should enable assign button if one of the two candidates expression is valid', async(() => {
            mockStreams.assignments.next({
                type: AssignmentType.expression,
                assignment: AssignmentMode.candidates,
                id: 'mock-shape-id'
            });
            mockStreams.processVariables.next(mockProcessVariable);
            component.settings = {
                assignee: [],
                candidateUsers: [mockCandidates.candidateUsers],
                candidateGroups: [],
                assignmentUpdate$: new Subject<AssignmentModel>(),
                shapeId: 'shapeId',
                processId: 'Process_12345678'
              };
            fixture.detectChanges();
            component.processVariables$ = mockStreams.processVariables;
            mockStreams.processVariables.next(mockProcessVariable);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const editor = fixture.debugElement.query(By.css('.monaco-editor'));
                const assignButton = fixture.debugElement.query(By.css(`#ama-assign-button`));
                expect(editor).not.toBeNull();
                expect(assignButton.nativeElement['disabled']).toBeTruthy();
                component.onExpressionChange(mockOneValidCandidate);
                fixture.detectChanges();
                expect(assignButton.nativeElement['disabled']).toBeFalsy();
            });
        }));

        it('Should disable assign button if assignee expression is invalid', async(() => {
            mockStreams.assignments.next({
                type: AssignmentType.expression,
                assignment: AssignmentMode.assignee,
                id: 'mock-shape-id'
            });
            component.settings = {
                assignee: ['${var1}'],
                candidateUsers: [],
                candidateGroups: [],
                assignmentUpdate$: new Subject<AssignmentModel>(),
                shapeId: 'shapeId',
                processId: 'Process_12345678'
              };
            fixture.detectChanges();
            component.processVariables$ = mockStreams.processVariables;
            mockStreams.processVariables.next(mockProcessVariable);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const editor = fixture.debugElement.query(By.css('.monaco-editor'));
                const assignButton = fixture.debugElement.query(By.css(`#ama-assign-button`));
                expect(editor).not.toBeNull();
                expect(assignButton.nativeElement['disabled']).toBeTruthy();
                component.onExpressionChange(AssignmentDialogComponent.ASSIGNEE_CONTENT);
                fixture.detectChanges();
                expect(assignButton.nativeElement['disabled']).toBeTruthy();
            });
        }));
    });

    describe('Expression with process variables', () => {

        it('Should show code-editor if process variables exists', async(() => {
            mockStreams.assignments.next({
                type: AssignmentType.expression,
                assignment: AssignmentMode.assignee,
                id: 'mock-shape-id'
            });
            component.settings = {
                assignee: ['${var1}'],
                candidateUsers: [],
                candidateGroups: [],
                assignmentUpdate$: new Subject<AssignmentModel>(),
                shapeId: 'shapeId',
                processId: 'Process_12345678'
              };
            fixture.detectChanges();
            component.processVariables$ = mockStreams.processVariables;
            mockStreams.processVariables.next(mockProcessVariable);
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const editor = fixture.debugElement.query(By.css('.monaco-editor'));
                expect(editor).not.toBeNull();
            });
        }));

        it('Should not show code-editor and show hint if process variables are not exists', async(() => {
            mockStreams.assignments.next({
                type: AssignmentType.expression,
                assignment: AssignmentMode.assignee,
                id: 'mock-shape-id'
            });
            mockStreams.processVariables.next([]);
            component.settings = {
                assignee: ['${var1}'],
                candidateUsers: [],
                candidateGroups: [],
                assignmentUpdate$: new Subject<AssignmentModel>(),
                shapeId: 'shapeId'
              };
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const editor = fixture.debugElement.query(By.css('.monaco-editor'));
                const errorMessage = fixture.debugElement.query(By.css('[data-automation-id="no-process-variables-error"]'));
                expect(editor).toBeNull();
                expect(errorMessage.nativeElement.textContent).toBe(' PROCESS_EDITOR.ELEMENT_PROPERTIES.TASK_ASSIGNMENT.EXPRESSION.NO_PROCESS_VARIABLES ');
            });
        }));
    });

    describe('Reset assignments', () => {

        it('Should reset the static values if the user change tab (identity/expression)', async(() => {
            mockStreams.assignments.next({
                type: AssignmentType.static,
                assignment: AssignmentMode.assignee,
                id: 'mock-shape-id'
            });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const nameInput = fixture.debugElement.query(By.css(`[data-automation-id="ama-assignment-static-single-user-input"]`));
                nameInput.nativeElement.value = 'mock assignee';

                nameInput.nativeElement.dispatchEvent(new Event('input'));
                expect(component.assigneeStaticControl.value).toBe('mock assignee');

                component.onTabChange({index: 1, tab: null});
                fixture.detectChanges();
                expect(component.assigneeStaticControl).toBeNull();
            });
        }));

        it('Should reset the identity values if the user change tab (static/expression)', async(() => {
            mockStreams.assignments.next({
                    type: AssignmentType.identity,
                    assignment: AssignmentMode.candidates,
                    id: 'mock-shape-id'
                });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const candidateUserInput = fixture.debugElement.query(By.css('[data-automation-id="adf-people-cloud-search-input"]'));
                const candidateGroupInput = fixture.debugElement.query(By.css('[data-automation-id="adf-cloud-group-search-input"]'));

                candidateUserInput.nativeElement.value = 'Candidate user';
                candidateUserInput.nativeElement.dispatchEvent(new Event('input'));

                candidateGroupInput.nativeElement.value = 'Candidate group';
                candidateGroupInput.nativeElement.dispatchEvent(new Event('input'));

                expect(component.candidateUsersIdentityControl.value).toBe('Candidate user');
                expect(component.candidateGroupsIdentityControl.value).toBe('Candidate group');

                component.onTabChange({index: AssignmentTabs.STATIC, tab: null});
                fixture.detectChanges();
                expect(component.candidatesIdentityFormGroup).toBeNull();
            });
        }));

        it('Should reset the expression values if the user change tab (static/identity)', async(() => {
            mockStreams.assignments.next({
                    type: AssignmentType.expression,
                    assignment: AssignmentMode.candidates,
                    id: 'mock-shape-id'
                });
            component.settings = {
                assignee: [],
                candidateUsers: [mockCandidates.candidateUsers],
                candidateGroups: [mockCandidates.candidateGroups],
                assignmentUpdate$: new Subject<AssignmentModel>(),
                shapeId: 'shapeId'
                };
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(JSON.parse(component.expressionContent)).toEqual(mockCandidates, 'Before tab change');
                component.onTabChange({index: AssignmentTabs.STATIC, tab: null});
                expect(JSON.parse(component.expressionContent)).toEqual(JSON.parse(mockEmptyCandidates), 'After tab change');
            });
        }));
    });

    describe('Reload assignments', () => {

        describe('Reload on tab change', () => {

            it('Should reload the static assignee value if the user change to original tab', async(() => {
                mockStreams.assignments.next({
                    type: AssignmentType.static,
                    assignment: AssignmentMode.assignee,
                    id: 'mock-shape-id'
                });
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    const assigneeBeforeTabChange = fixture.debugElement.query(By.css('.ama-assignment-widget .mat-chip'));
                    expect(component.staticAssignee).toBe('mock assignee');
                    expect(assigneeBeforeTabChange.nativeElement.textContent).toContain('mock assignee cancel');
                    component.onTabChange({index: 1, tab: null});
                    fixture.detectChanges();
                    const assigneeAfterTabChange = fixture.debugElement.query(By.css('.ama-assignment-widget .mat-chip'));
                    expect(assigneeAfterTabChange).toBeNull();
                    component.onTabChange({index: AssignmentTabs.STATIC, tab: null});
                    fixture.detectChanges();
                    expect(assigneeBeforeTabChange.nativeElement.textContent.trim()).toContain('mock assignee cancel');
                });
            }));

            it('Should reload the identity candidate values if the user change to original tab', async(() => {
                mockStreams.assignments.next({
                        type: AssignmentType.identity,
                        assignment: AssignmentMode.candidates,
                        id: 'mock-shape-id'
                    });
                component.settings = {
                    assignee: [],
                    candidateUsers: ['mock candidateUser'],
                    candidateGroups: ['mock candidateGroup'],
                    assignmentUpdate$: new Subject<AssignmentModel>(),
                    shapeId: 'shapeId'
                  };
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    const candidateUserChipBeforeTabChange = fixture.debugElement.query(By.css('[data-automation-id="adf-people-cloud-chip-mock candidateUser"]'));
                    expect(component.identityCandidateUsers[0].username).toContain('mock candidateUser');
                    expect(component.identityCandidateGroups[0].name).toContain('mock candidateGroup');
                    expect(candidateUserChipBeforeTabChange.nativeElement.textContent).toContain(' mock candidateUser  cancel');

                    component.onTabChange({index: AssignmentTabs.STATIC, tab: null});
                    fixture.detectChanges();
                    const candidateUserChipAfterTabChange = fixture.debugElement.query(By.css('[data-automation-id="adf-people-cloud-chip-mock candidateUser"]'));
                    const candidateGroupChipAfterTabChange = fixture.debugElement.query(By.css('[data-automation-id="adf-people-cloud-chip-mock candidateGroup"]'));
                    expect(candidateGroupChipAfterTabChange).toBeNull();
                    expect(candidateUserChipAfterTabChange).toBeNull();

                    component.onTabChange({index: 1, tab: null});
                    fixture.detectChanges();
                    expect(candidateUserChipBeforeTabChange.nativeElement.textContent).toContain(' mock candidateUser  cancel');
                });
            }));

            it('Should reload the expression values if the user change to original tab', async(() => {
                mockStreams.assignments.next({
                    type: AssignmentType.expression,
                    assignment: AssignmentMode.candidates,
                    id: 'mock-shape-id'
                });
                component.settings = {
                    assignee: [],
                    candidateUsers: [mockCandidates.candidateUsers],
                    candidateGroups: [mockCandidates.candidateGroups],
                    assignmentUpdate$: new Subject<AssignmentModel>(),
                    shapeId: 'shapeId'
                    };
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(JSON.parse(component.expressionContent)).toEqual(mockCandidates, 'Before tab change');

                    component.onTabChange({index: AssignmentTabs.STATIC, tab: null});
                    fixture.detectChanges();
                    expect(JSON.parse(component.expressionContent)).toEqual(JSON.parse(mockEmptyCandidates), 'After tab change');

                    component.onTabChange({index: AssignmentTabs.EXPRESSION, tab: null});
                    fixture.detectChanges();
                    expect(JSON.parse(component.expressionContent)).toEqual(mockCandidates, 'Before tab change');
                });
            }));
        });

        describe('Reload on assignment mode change', () => {

            it('Should reload identity candidate values if the user change to original mode', async(() => {
                mockStreams.assignments.next({
                    type: AssignmentType.identity,
                    assignment: AssignmentMode.candidates,
                    id: 'mock-shape-id'
                });
                component.settings = {
                    assignee: [],
                    candidateUsers: ['mock candidateUser'],
                    candidateGroups: ['mock candidateGroup'],
                    assignmentUpdate$: new Subject<AssignmentModel>(),
                    shapeId: 'shapeId'
                };
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    const candidateUserChipBeforeModeChange = fixture.debugElement.query(By.css('[data-automation-id="adf-people-cloud-chip-mock candidateUser"]'));
                    expect(component.identityCandidateUsers[0].username).toContain('mock candidateUser');
                    expect(component.identityCandidateGroups[0].name).toContain('mock candidateGroup');
                    expect(candidateUserChipBeforeModeChange.nativeElement.textContent).toContain(' mock candidateUser  cancel');

                    openSelect();
                    fixture.detectChanges();
                    const assigneeOption = fixture.debugElement.query(By.css('[data-automation-id="ama-assignment-option-assignee"]'));
                    assigneeOption.nativeElement.click();
                    fixture.detectChanges();
                    const candidateUserChipAfterModeChange = fixture.debugElement.query(By.css('[data-automation-id="adf-people-cloud-chip-mock candidateUser"]'));
                    const candidateGroupChipAfterModeChange = fixture.debugElement.query(By.css('[data-automation-id="adf-people-cloud-chip-mock candidateGroup"]'));
                    expect(candidateGroupChipAfterModeChange).toBeNull();
                    expect(candidateUserChipAfterModeChange).toBeNull();

                    openSelect();
                    fixture.detectChanges();
                    const candidateOption = fixture.debugElement.query(By.css('[data-automation-id="ama-assignment-option-candidates"]'));
                    candidateOption.nativeElement.click();
                    fixture.detectChanges();
                    expect(candidateUserChipBeforeModeChange).not.toBeNull();
                });
            }));

            it('Should reload the expression values if the user change to original mode', async(() => {
                mockStreams.assignments.next({
                    type: AssignmentType.expression,
                    assignment: AssignmentMode.candidates,
                    id: 'mock-shape-id'
                });
                component.settings = {
                    assignee: [],
                    candidateUsers: [mockCandidates.candidateUsers],
                    candidateGroups: [mockCandidates.candidateGroups],
                    assignmentUpdate$: new Subject<AssignmentModel>(),
                    shapeId: 'shapeId'
                    };
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(JSON.parse(component.expressionContent)).toEqual(mockCandidates, 'Before tab change');

                    openSelect();
                    fixture.detectChanges();
                    const assigneeOption = fixture.debugElement.query(By.css('[data-automation-id="ama-assignment-option-assignee"]'));
                    assigneeOption.nativeElement.click();

                    fixture.detectChanges();
                    expect(JSON.parse(component.expressionContent)).toEqual(JSON.parse(AssignmentDialogComponent.ASSIGNEE_CONTENT), 'After tab change');

                    openSelect();
                    fixture.detectChanges();
                    const candidateOption = fixture.debugElement.query(By.css('[data-automation-id="ama-assignment-option-candidates"]'));
                    candidateOption.nativeElement.click();
                    fixture.detectChanges();
                    expect(JSON.parse(component.expressionContent)).toEqual(mockCandidates, 'Before tab change');
                });
            }));

            it('Should reload static candidate values if the user change to original mode', async(() => {
                mockStreams.assignments.next({
                    type: AssignmentType.static,
                    assignment: AssignmentMode.candidates,
                    id: 'mock-shape-id'
                });
                component.settings = {
                    assignee: [],
                    candidateUsers: ['mock candidateUser'],
                    candidateGroups: ['mock candidateGroup'],
                    assignmentUpdate$: new Subject<AssignmentModel>(),
                    shapeId: 'shapeId'
                };
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    const candidateUserChipBeforeModeChange = fixture.debugElement.query(By.css('[data-automation-id="ama-candidate-user-chip-mock candidateUser"]'));
                    const candidateGroupChipBeforeModeChange = fixture.debugElement.query(By.css('[data-automation-id="ama-candidate-group-chip-mock candidateGroup"]'));
                    expect(component.staticCandidateUsers[0]).toContain('mock candidateUser');
                    expect(component.staticCandidateGroups[0]).toContain('mock candidateGroup');
                    expect(candidateUserChipBeforeModeChange.nativeElement.textContent).toContain(' mock candidateUser cancel');
                    expect(candidateGroupChipBeforeModeChange.nativeElement.textContent).toContain(' mock candidateGroup cancel');

                    openSelect();
                    fixture.detectChanges();
                    const assigneeOption = fixture.debugElement.query(By.css('[data-automation-id="ama-assignment-option-assignee"]'));
                    assigneeOption.nativeElement.click();
                    fixture.detectChanges();
                    const candidateUserChipAfterModeChange = fixture.debugElement.query(By.css('[data-automation-id="ama-candidate-user-chip-mock candidateUser"]'));
                    const candidateGroupChipAfterModeChange = fixture.debugElement.query(By.css('[data-automation-id="ama-candidate-group-chip-mock candidateGroup"]'));
                    expect(candidateGroupChipAfterModeChange).toBeNull();
                    expect(candidateUserChipAfterModeChange).toBeNull();

                    openSelect();
                    fixture.detectChanges();
                    const candidateOption = fixture.debugElement.query(By.css('[data-automation-id="ama-assignment-option-candidates"]'));
                    candidateOption.nativeElement.click();
                    fixture.detectChanges();
                    expect(candidateUserChipBeforeModeChange).not.toBeNull();
                    expect(candidateGroupChipBeforeModeChange).not.toBeNull();
                    expect(candidateUserChipBeforeModeChange.nativeElement.textContent).toContain(' mock candidateUser cancel');
                    expect(candidateGroupChipBeforeModeChange.nativeElement.textContent).toContain(' mock candidateGroup cancel');
                });
            }));
        });
    });
});
