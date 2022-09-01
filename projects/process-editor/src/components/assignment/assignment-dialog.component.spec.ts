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
import { VariablesModule, AssignmentMode, AssignmentType, ExpressionsEditorService, UuidService, AssignmentStrategyMode, AmaState } from '@alfresco-dbp/modeling-shared/sdk';
import { DialogService } from '@alfresco-dbp/adf-candidates/core/dialog';
import { CoreModule, TranslationService, TranslationMock, AlfrescoApiService } from '@alfresco/adf-core';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subject, BehaviorSubject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AssignmentDialogComponent, AssignmentModel, AssignmentTabs } from './assignment-dialog.component';
import { ProcessServicesCloudModule } from '@alfresco/adf-process-services-cloud';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { AssignmentStrategySelectorComponent } from './assignment-strategy-selector/assignment-strategy-selector.component';
import { DebugElement } from '@angular/core';

describe('AssignmentDialogComponent', () => {
    let fixture: ComponentFixture<AssignmentDialogComponent>;
    let component: AssignmentDialogComponent;
    let alfrescoApiService: AlfrescoApiService;
    let debugEl: DebugElement;
    let store: Store<AmaState>;

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

    const cssSelector = {
        assignmentStrategySelector: '.ama-assignment-strategy-selector',
        assignmentStrategySelectSpan: '.ama-assignment-strategy-selector-container .mat-select-value-text span',
        assignmentStrategySelect: '[data-automation-id="ama-assignment-strategy-select"]',
        assignmentStrategySequentialOption: '[data-automation-id="ama-assignment-strategy-option-sequential"]'
    };

    function openSelect() {
        const dropdown = fixture.debugElement.query(By.css('.mat-select-trigger'));
        dropdown.triggerEventHandler('click', null);
        fixture.detectChanges();
    }

    function openAssignmentStrategySelect() {
        const assignmentStrategySelectEl = debugEl.query(By.css(cssSelector.assignmentStrategySelect));
        assignmentStrategySelectEl.nativeElement.click();
        fixture.detectChanges();
    }

    function selectAssignmentSequentialOption() {
        const assignmentStrategySequentialOption = debugEl.query(By.css(cssSelector.assignmentStrategySequentialOption));
        assignmentStrategySequentialOption.nativeElement.click();
        fixture.detectChanges();
    }

    function clickOnAssignmentButton() {
        const assignButton = debugEl.query(By.css(`#ama-assign-button`));
        assignButton.nativeElement.click();
        fixture.detectChanges();
    }

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
                VariablesModule,
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
                {
                    provide: ExpressionsEditorService,
                    useValue: {
                        initExpressionEditor: jest.fn(),
                        colorizeElement: jest.fn(),
                    }
                },
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation(() => mockStreams.assignments),
                        dispatch: jest.fn()
                    }
                }
            ],
            declarations: [AssignmentDialogComponent, AssignmentStrategySelectorComponent]
        });

        fixture = TestBed.createComponent(AssignmentDialogComponent);
        component = fixture.componentInstance;
        debugEl = fixture.debugElement;
        alfrescoApiService = TestBed.inject(AlfrescoApiService);
        store = TestBed.inject(Store);
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

        it('Should disable assign button if mode type changed single to candidates)', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

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

        it('Should show warning message on static candidate assignment if the values are not set', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

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

        it('Should not show warning message on static candidate assignment if one value are set', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

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

        it('Should disable assign button if mode type changed candidates to single', async () => {
            mockStreams.assignments.next({
                type: AssignmentType.identity,
                assignment: AssignmentMode.candidates,
                mode: AssignmentStrategyMode.manual,
                id: 'mock-shape-id'
            });
            fixture.detectChanges();
            await fixture.whenStable();

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

        it('Should be disable assign button if the identity assignee is invalid', async () => {
            mockStreams.assignments.next({
                type: AssignmentType.identity,
                assignment: AssignmentMode.assignee,
                id: 'mock-shape-id'
            });
            fixture.detectChanges();
            await fixture.whenStable();

            const assignButton = fixture.debugElement.query(By.css(`#ama-assign-button`));
            const assigneeInput = fixture.debugElement.query(By.css('[data-automation-id="adf-people-cloud-search-input"]'));

            assigneeInput.nativeElement.value = 'assignee user';
            assigneeInput.nativeElement.dispatchEvent(new Event('input'));

            expect(assignButton.nativeElement['disabled']).toBeTruthy();
        });

        it('Should be disable assign button if one of the identity candidates is invalid', async () => {
            mockStreams.assignments.next({
                type: AssignmentType.identity,
                assignment: AssignmentMode.candidates,
                mode: AssignmentStrategyMode.manual,
                id: 'mock-shape-id'
            });
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

        it('Should disable assign button if both candidate expressions are empty', async () => {
            mockStreams.assignments.next({
                type: AssignmentType.expression,
                assignment: AssignmentMode.candidates,
                mode: AssignmentStrategyMode.manual,
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
            await fixture.whenStable();

            const editor = fixture.debugElement.query(By.css('.monaco-editor'));
            const assignButton = fixture.debugElement.query(By.css(`#ama-assign-button`));
            expect(editor).not.toBeNull();
            expect(assignButton.nativeElement['disabled']).toBeTruthy();
            component.onExpressionChange(mockEmptyCandidates);
            fixture.detectChanges();
            expect(assignButton.nativeElement['disabled']).toBeTruthy();
        });

        it('Should enable assign button if one of the two candidates expression is valid', async () => {
            mockStreams.assignments.next({
                type: AssignmentType.expression,
                assignment: AssignmentMode.candidates,
                mode: AssignmentStrategyMode.manual,
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
            await fixture.whenStable();

            const editor = fixture.debugElement.query(By.css('.monaco-editor'));
            const assignButton = fixture.debugElement.query(By.css(`#ama-assign-button`));
            expect(editor).not.toBeNull();
            expect(assignButton.nativeElement['disabled']).toBeTruthy();
            component.onExpressionChange(mockOneValidCandidate);
            fixture.detectChanges();
            expect(assignButton.nativeElement['disabled']).toBeFalsy();
        });

        it('Should disable assign button if assignee expression is invalid', async () => {
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
            await fixture.whenStable();

            const editor = fixture.debugElement.query(By.css('.monaco-editor'));
            const assignButton = fixture.debugElement.query(By.css(`#ama-assign-button`));
            expect(editor).not.toBeNull();
            expect(assignButton.nativeElement['disabled']).toBeTruthy();
            component.onExpressionChange('${}');
            fixture.detectChanges();
            expect(assignButton.nativeElement['disabled']).toBeTruthy();
        });
    });

    describe('Expression with process variables', () => {

        it('Should show code-editor if process variables exists', async () => {
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
            await fixture.whenStable();

            const editor = fixture.debugElement.query(By.css('.monaco-editor'));
            expect(editor).not.toBeNull();
        });

        it('Should show code-editor if process variables are not exists', async () => {
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
            await fixture.whenStable();

            const editor = fixture.debugElement.query(By.css('.monaco-editor'));
            expect(editor).not.toBeNull();
        });
    });

    describe('Reset assignments', () => {

        it('Should reset the static values if the user change tab (identity/expression)', async () => {
            mockStreams.assignments.next({
                type: AssignmentType.static,
                assignment: AssignmentMode.assignee,
                id: 'mock-shape-id'
            });
            fixture.detectChanges();
            await fixture.whenStable();

            const nameInput = fixture.debugElement.query(By.css(`[data-automation-id="ama-assignment-static-single-user-input"]`));
            nameInput.nativeElement.value = 'mock assignee';

            nameInput.nativeElement.dispatchEvent(new Event('input'));
            expect(component.assigneeStaticControl.value).toBe('mock assignee');

            component.onTabChange({index: 1, tab: null});
            fixture.detectChanges();
            expect(component.assigneeStaticControl).toBeNull();
        });

        it('Should reset the identity values if the user change tab (static/expression)', async () => {
            mockStreams.assignments.next({
                type: AssignmentType.identity,
                assignment: AssignmentMode.candidates,
                mode: AssignmentStrategyMode.manual,
                id: 'mock-shape-id'
            });
            fixture.detectChanges();
            await fixture.whenStable();

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

        it('Should reset the expression values if the user change tab (static/identity)', async () => {
            mockStreams.assignments.next({
                type: AssignmentType.expression,
                assignment: AssignmentMode.candidates,
                mode: AssignmentStrategyMode.manual,
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
            await fixture.whenStable();

            expect(JSON.parse(component.expressionContent)).toEqual(mockCandidates);
            component.onTabChange({index: AssignmentTabs.STATIC, tab: null});
            expect(JSON.parse(component.expressionContent)).toEqual(JSON.parse(mockEmptyCandidates));
        });
    });

    describe('Reload assignments', () => {

        describe('Reload on tab change', () => {

            it('Should reload the static assignee value if the user change to original tab', async () => {
                mockStreams.assignments.next({
                    type: AssignmentType.static,
                    assignment: AssignmentMode.assignee,
                    id: 'mock-shape-id'
                });
                fixture.detectChanges();
                await fixture.whenStable();

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

            it('Should reload the identity candidate values if the user change to original tab', async () => {
                mockStreams.assignments.next({
                    type: AssignmentType.identity,
                    assignment: AssignmentMode.candidates,
                    mode: AssignmentStrategyMode.manual,
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
                await fixture.whenStable();

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

            it('Should reload the expression values if the user change to original tab', async () => {
                mockStreams.assignments.next({
                    type: AssignmentType.expression,
                    assignment: AssignmentMode.candidates,
                    mode: AssignmentStrategyMode.manual,
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
                await fixture.whenStable();

                expect(JSON.parse(component.expressionContent)).toEqual(mockCandidates);

                component.onTabChange({index: AssignmentTabs.STATIC, tab: null});
                fixture.detectChanges();
                expect(JSON.parse(component.expressionContent)).toEqual(JSON.parse(mockEmptyCandidates));

                component.onTabChange({index: AssignmentTabs.EXPRESSION, tab: null});
                fixture.detectChanges();
                expect(JSON.parse(component.expressionContent)).toEqual(mockCandidates);
            });
        });

        describe('Reload on assignment mode change', () => {

            it('Should reload identity candidate values if the user change to original mode', async () => {
                mockStreams.assignments.next({
                    type: AssignmentType.identity,
                    mode: AssignmentStrategyMode.manual,
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
                await fixture.whenStable();

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

            it('Should reload the expression values if the user change to original mode', async () => {
                mockStreams.assignments.next({
                    type: AssignmentType.expression,
                    assignment: AssignmentMode.candidates,
                    mode: AssignmentStrategyMode.manual,
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
                await fixture.whenStable();

                expect(JSON.parse(component.expressionContent)).toEqual(mockCandidates);

                openSelect();
                fixture.detectChanges();
                const assigneeOption = fixture.debugElement.query(By.css('[data-automation-id="ama-assignment-option-assignee"]'));
                assigneeOption.nativeElement.click();

                fixture.detectChanges();
                expect(JSON.parse(component.expressionContent)).toEqual(JSON.parse(AssignmentDialogComponent.ASSIGNEE_CONTENT));

                openSelect();
                fixture.detectChanges();
                const candidateOption = fixture.debugElement.query(By.css('[data-automation-id="ama-assignment-option-candidates"]'));
                candidateOption.nativeElement.click();
                fixture.detectChanges();
                expect(JSON.parse(component.expressionContent)).toEqual(mockCandidates);
            });

            it('Should reload static candidate values if the user change to original mode', async () => {
                mockStreams.assignments.next({
                    type: AssignmentType.static,
                    assignment: AssignmentMode.candidates,
                    mode: AssignmentStrategyMode.manual,
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
                await fixture.whenStable();

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
        });
    });

    describe('Assignment type', () => {

        it('Should not show assignment type selector field if is single assignment and static tab is selected', async () => {
            mockStreams.assignments.next({
                type: AssignmentType.static,
                assignment: AssignmentMode.assignee,
                id: 'mock-shape-id'
            });
            fixture.detectChanges();
            await fixture.whenStable();
            const assignmentStrategySelector = debugEl.query(By.css(cssSelector.assignmentStrategySelector));
            expect(assignmentStrategySelector).toBeNull();
        });

        it('Should not show assignment type selector field if is single assignment and identity tab is selected', async () => {
            mockStreams.assignments.next({
                type: AssignmentType.identity,
                assignment: AssignmentMode.assignee,
                id: 'mock-shape-id'
            });
            fixture.detectChanges();
            await fixture.whenStable();
            const assignmentStrategySelector = debugEl.query(By.css(cssSelector.assignmentStrategySelector));
            expect(assignmentStrategySelector).toBeNull();
        });

        it('Should not show assignment type selector field if is single assignment and expression tab is selected', async () => {
            mockStreams.assignments.next({
                type: AssignmentType.expression,
                assignment: AssignmentMode.assignee,
                id: 'mock-shape-id'
            });
            fixture.detectChanges();
            await fixture.whenStable();
            const assignmentStrategySelector = debugEl.query(By.css(cssSelector.assignmentStrategySelector));
            expect(assignmentStrategySelector).toBeNull();
        });

        it('Should show assignment type selector field if is candidate assignment and static tab is selected', async () => {
            mockStreams.assignments.next({
                type: AssignmentType.static,
                mode: AssignmentStrategyMode.manual,
                assignment: AssignmentMode.candidates,
                id: 'mock-shape-id'
            });
            fixture.detectChanges();
            await fixture.whenStable();
            const assignmentStrategySelector = debugEl.query(By.css(cssSelector.assignmentStrategySelector));
            expect(assignmentStrategySelector).not.toBeNull();
        });

        it('Should show assignment type selector field if is candidate assignment and identity tab is selected', async () => {
            mockStreams.assignments.next({
                type: AssignmentType.identity,
                mode: AssignmentStrategyMode.manual,
                assignment: AssignmentMode.candidates,
                id: 'mock-shape-id'
            });
            fixture.detectChanges();
            await fixture.whenStable();
            const assignmentStrategySelector = debugEl.query(By.css(cssSelector.assignmentStrategySelector));
            expect(assignmentStrategySelector).not.toBeNull();
        });

        it('Should show assignment type selector field if is candidate assignment and expression tab is selected', async () => {
            mockStreams.assignments.next({
                type: AssignmentType.expression,
                mode: AssignmentStrategyMode.manual,
                assignment: AssignmentMode.candidates,
                id: 'mock-shape-id'
            });
            fixture.detectChanges();
            await fixture.whenStable();
            const assignmentStrategySelector = debugEl.query(By.css(cssSelector.assignmentStrategySelector));
            expect(assignmentStrategySelector).not.toBeNull();
        });

        it('Should show assignment type manual when assignment is change from single to candidates mode', async () => {
            const expectedAssignmentStrategyValue = 'Manual';
            fixture.detectChanges();
            await fixture.whenStable();
            openSelect();
            const candidateOption = fixture.debugElement.query(By.css('[data-automation-id="ama-assignment-option-candidates"]'));
            candidateOption.nativeElement.click();
            fixture.detectChanges();
            const assignmentStrategySpanEl = debugEl.query(By.css(cssSelector.assignmentStrategySelectSpan));
            expect(assignmentStrategySpanEl.nativeElement.innerHTML).toEqual(expectedAssignmentStrategyValue);
        });

        it('Should send assignment mode clicking onAssign if is candidate', async () => {
            const expectedObject = {
                modelId: 'mock-shape-id',
                processId: 'mock process',
                serviceId: 'shapeId',
                taskAssignment: {
                    assignment: AssignmentMode.candidates,
                    id: 'shapeId',
                    mode: 'sequential',
                    type: AssignmentType.static,
                },
                type: '[ProcessEditor] Update Task Assignments',
            };
            spyOn(store, 'dispatch');
            mockStreams.assignments.next({
                type: AssignmentType.static,
                mode: AssignmentStrategyMode.manual,
                assignment: AssignmentMode.candidates,
                id: 'mock-shape-id'
            });
            component.settings = {
                assignee: [],
                candidateUsers: ['mock candidateUser'],
                candidateGroups: ['mock candidateGroup'],
                processId: 'mock process',
                assignmentUpdate$: new Subject<AssignmentModel>(),
                shapeId: 'shapeId'
            };
            fixture.detectChanges();
            await fixture.whenStable();

            openAssignmentStrategySelect();
            selectAssignmentSequentialOption();
            clickOnAssignmentButton();

            expect(store.dispatch).toHaveBeenCalledWith(expectedObject);
        });

        it('Should not send assignment mode clicking onAssign if is candidate', async () => {
            const expectedObject = {
                modelId: 'mock-shape-id',
                processId: 'mock process',
                serviceId: 'shapeId',
                taskAssignment: {
                    assignment: AssignmentMode.assignee,
                    id: 'shapeId',
                    type: AssignmentType.static
                },
                type: '[ProcessEditor] Update Task Assignments',
            };
            spyOn(store, 'dispatch');
            mockStreams.assignments.next({
                type: AssignmentType.static,
                assignment: AssignmentMode.assignee,
                id: 'mock-shape-id'
            });
            component.settings = {
                assignee: ['hr'],
                candidateUsers: [],
                candidateGroups: [],
                processId: 'mock process',
                assignmentUpdate$: new Subject<AssignmentModel>(),
                shapeId: 'shapeId'
            };
            fixture.detectChanges();
            await fixture.whenStable();

            component.updateAssignment();

            expect(store.dispatch).toHaveBeenCalledWith(expectedObject);
        });

        it('Should update payload when the assignment strategy is changed in the static tab and static form is valid', async () => {
            const expectedPayload = {
                assignments: [
                    { key: 'assignee', value: undefined },
                    { key: 'candidateUsers', value: 'mock candidateUser' },
                    { key: 'candidateGroups', value: 'mock candidateGroup' }
                ]
            };
            spyOn(store, 'dispatch');
            mockStreams.assignments.next({
                type: AssignmentType.static,
                mode: AssignmentStrategyMode.manual,
                assignment: AssignmentMode.candidates,
                id: 'mock-shape-id'
            });
            component.settings = {
                assignee: [],
                candidateUsers: ['mock candidateUser'],
                candidateGroups: ['mock candidateGroup'],
                processId: 'mock process',
                assignmentUpdate$: new Subject<AssignmentModel>(),
                shapeId: 'shapeId'
            };
            fixture.detectChanges();
            await fixture.whenStable();

            openAssignmentStrategySelect();
            selectAssignmentSequentialOption();

            expect(component.assignmentPayload).toEqual(expectedPayload);
        });

        it('Should not update payload when the assignment strategy is changed in the static tab and static form is not valid', async () => {
            spyOn(store, 'dispatch');
            mockStreams.assignments.next({
                type: AssignmentType.static,
                mode: AssignmentStrategyMode.manual,
                assignment: AssignmentMode.candidates,
                id: 'mock-shape-id'
            });
            component.settings = {
                assignee: [],
                candidateUsers: [],
                candidateGroups: [],
                processId: 'mock process',
                assignmentUpdate$: new Subject<AssignmentModel>(),
                shapeId: 'shapeId'
            };
            fixture.detectChanges();
            await fixture.whenStable();

            openAssignmentStrategySelect();
            selectAssignmentSequentialOption();

            expect(component.assignmentPayload).toBeUndefined();
        });

        it('Should update payload when the assignment strategy is changed in the identity tab and identity form is valid', async () => {
            const expectedPayload = {
                assignments: [
                    { key: 'assignee', value: undefined },
                    { key: 'candidateUsers', value: 'mock candidateUser' },
                    { key: 'candidateGroups', value: 'mock candidateGroup' }
                ]
            };
            spyOn(store, 'dispatch');
            mockStreams.assignments.next({
                type: AssignmentType.identity,
                mode: AssignmentStrategyMode.manual,
                assignment: AssignmentMode.candidates,
                id: 'mock-shape-id'
            });
            component.settings = {
                assignee: [],
                candidateUsers: ['mock candidateUser'],
                candidateGroups: ['mock candidateGroup'],
                processId: 'mock process',
                assignmentUpdate$: new Subject<AssignmentModel>(),
                shapeId: 'shapeId'
            };
            fixture.detectChanges();
            await fixture.whenStable();

            openAssignmentStrategySelect();
            selectAssignmentSequentialOption();

            expect(component.assignmentPayload).toEqual(expectedPayload);
        });

        it('Should not update payload when the assignment strategy is changed in the identity tab and identity form is not valid', async () => {
            spyOn(store, 'dispatch');
            mockStreams.assignments.next({
                type: AssignmentType.identity,
                mode: AssignmentStrategyMode.manual,
                assignment: AssignmentMode.candidates,
                id: 'mock-shape-id'
            });
            component.settings = {
                assignee: [],
                candidateUsers: [],
                candidateGroups: [],
                processId: 'mock process',
                assignmentUpdate$: new Subject<AssignmentModel>(),
                shapeId: 'shapeId'
            };
            fixture.detectChanges();
            await fixture.whenStable();

            openAssignmentStrategySelect();
            selectAssignmentSequentialOption();

            expect(component.assignmentPayload).toBeUndefined();
        });

        it('Should update payload when the assignment strategy is changed in the expression tab and expression form is valid', async () => {
            const expectedPayload = {
                assignments: [
                    { key: 'assignee', value: undefined },
                    { key: 'candidateUsers', value: '${mock candidateUser}' },
                    { key: 'candidateGroups', value: '${mock candidateGroup}' }
                ]
            };
            spyOn(store, 'dispatch');
            mockStreams.assignments.next({
                type: AssignmentType.expression,
                mode: AssignmentStrategyMode.manual,
                assignment: AssignmentMode.candidates,
                id: 'mock-shape-id'
            });
            component.settings = {
                assignee: [],
                candidateUsers: ['${mock candidateUser}'],
                candidateGroups: ['${mock candidateGroup}'],
                processId: 'mock process',
                assignmentUpdate$: new Subject<AssignmentModel>(),
                shapeId: 'shapeId'
            };
            fixture.detectChanges();
            await fixture.whenStable();

            openAssignmentStrategySelect();
            selectAssignmentSequentialOption();

            expect(component.assignmentPayload).toEqual(expectedPayload);
        });

        it('Should not update payload when the assignment strategy is changed in the expression tab and expression form is not valid', async () => {
            spyOn(store, 'dispatch');
            mockStreams.assignments.next({
                type: AssignmentType.expression,
                mode: AssignmentStrategyMode.manual,
                assignment: AssignmentMode.candidates,
                id: 'mock-shape-id'
            });
            component.settings = {
                assignee: [],
                candidateUsers: [],
                candidateGroups: [],
                processId: 'mock process',
                assignmentUpdate$: new Subject<AssignmentModel>(),
                shapeId: 'shapeId'
            };
            fixture.detectChanges();
            await fixture.whenStable();

            openAssignmentStrategySelect();
            selectAssignmentSequentialOption();

            expect(component.assignmentPayload).toBeUndefined();
        });

    });

});
