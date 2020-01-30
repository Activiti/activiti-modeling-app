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

import { Component, OnInit, Inject, OnDestroy, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSelectChange, MatTabChangeEvent } from '@angular/material';
import { Subject, Observable } from 'rxjs';
import {
    BpmnProperty,
    AmaState,
    selectProcessTaskAssignmentFor,
    selectSelectedProcess,
    selectSelectedTheme,
    UpdateServiceAssignmentAction,
    TaskAssignment,
    AssignmentType,
    AssignmentMode,
    getFileUri,
    ValidationResponse,
    Process,
    CodeValidatorService,
    selectProcessPropertiesArrayFor,
    CodeEditorComponent
} from 'ama-sdk';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { IdentityUserModel, IdentityGroupModel } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { filter, take, takeUntil, map } from 'rxjs/operators';
import { AbstractControl, FormGroup, FormBuilder } from '@angular/forms';

export interface AssignmentSettings {
    assignee: string[];
    candidateUsers: string[];
    candidateGroups: string[];
    assignmentUpdate$?: Subject<any>;
    shapeId?: string;
    processId?: string;
}

export interface AssignmentParams {
    label: string;
    key: any;
    value?: string;
}
export enum AssignmentTabs {
    STATIC = 0,
    IDENTITY = 1,
    EXPRESSION = 2
}
export interface AssignmentModel {
    assignments: AssignmentParams[];
}

export enum AssigneeExpressionErrorMessages {
    assigneePattern = 'PROCESS_EDITOR.ELEMENT_PROPERTIES.TASK_ASSIGNMENT.EXPRESSION.ASSIGNEE_INVALID_ERROR',
    assigneeEmpty = 'PROCESS_EDITOR.ELEMENT_PROPERTIES.TASK_ASSIGNMENT.EXPRESSION.ASSIGNEE_EMPTY',
    candidatePattern = 'PROCESS_EDITOR.ELEMENT_PROPERTIES.TASK_ASSIGNMENT.EXPRESSION.CANDIDATE_INVALID_ERROR',
    candidateEmpty = 'PROCESS_EDITOR.ELEMENT_PROPERTIES.TASK_ASSIGNMENT.EXPRESSION.CANDIDATE_EMPTY'
}

@Component({
    selector: 'ama-assignment-dialog',
    templateUrl: './assignment-dialog.component.html',
    styleUrls: ['./assignment-dialog.component.scss']
})
export class AssignmentDialogComponent implements OnInit, OnDestroy {
    static ASSIGNEE_CONTENT = JSON.stringify({ assignee: '${}' }, null, '\t');
    static CANDIDATES_CONTENT = JSON.stringify({
        candidateUsers: '${}',
        candidateGroups: '${}'
    }, null, '\t');
    static TABS = [
        AssignmentType.static,
        AssignmentType.identity,
        AssignmentType.expression
    ];
    assignmentTypes = [
        {
            key: AssignmentMode.assignee,
            label:
                'PROCESS_EDITOR.ELEMENT_PROPERTIES.TASK_ASSIGNMENT.SINGLE_USER'
        },
        {
            key: AssignmentMode.candidates,
            label:
                'PROCESS_EDITOR.ELEMENT_PROPERTIES.TASK_ASSIGNMENT.CANDIDATES'
        }
    ];

    @ViewChild('editor') editor: CodeEditorComponent;

    roles = ['ACTIVITI_USER'];
    languageType = 'json';
    selectedMode: string = AssignmentMode.assignee;
    selectedType: string = AssignmentType.static;
    currentActiveTab = AssignmentTabs.STATIC;
    separatorKeysCodes: number[] = [ENTER, COMMA];

    staticAssignee: string;
    staticCandidateUsers: string[] = [];
    staticCandidateGroups: string[] = [];

    identityAssignee: IdentityUserModel[] = [];
    identityCandidateUsers: IdentityUserModel[] = [];
    identityCandidateGroups: IdentityGroupModel[] = [];

    expressionAssignee: string;
    expressionCandidateUsers: string;
    expressionCandidateGroups: string;

    expressionContent = AssignmentDialogComponent.ASSIGNEE_CONTENT;

    assignmentPayload: any;
    assignmentXML: TaskAssignment;
    processVariables$: Observable<any>;
    process$: Observable<Process>;
    processFileUri$: Observable<string>;
    vsTheme$: Observable<string>;
    onDestroy$: Subject<void> = new Subject<void>();

    assignmentForm: FormGroup;
    expressionErrorMessage: string;

    constructor(
        private store: Store<AmaState>,
        private codeValidatorService: CodeValidatorService,
        public dialogRef: MatDialogRef<AssignmentDialogComponent>,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public settings: AssignmentSettings
    ) {
        this.vsTheme$ = this.getVsTheme();
    }

    ngOnInit() {
        this.store
            .select(selectProcessTaskAssignmentFor(this.settings.processId, this.settings.shapeId))
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(assignmentType => {
                this.assignmentXML = <any> assignmentType;
            });

        this.process$ = this.store.select(selectSelectedProcess);
        this.processVariables$ = this.store.select(selectProcessPropertiesArrayFor(this.settings.processId));
        this.deductConfigFromXML();
        this.createForm();
        this.processFileUri$ = this.process$.pipe(
            filter(process => !!process),
            map(process => getFileUri(this.selectedMode, this.languageType, process.id))
        );
    }

    private getVsTheme(): Observable<string> {
        return this.store
            .select(selectSelectedTheme)
            .pipe(map(theme => (theme.className === 'dark-theme' ? 'vs-dark' : 'vs-light')));
    }

    resetFormByMode() {
        this.assignmentForm.reset();
    }

    resetFormByType() {
        if (!this.isStaticType()) {
            this.staticForm.reset();
        } else if (!this.isIdentityType()) {
            this.identityForm.reset();
        }
    }

    createForm() {
        this.assignmentForm = this.formBuilder.group({
            staticForm: this.formBuilder.group({
                assignee: [''],
                candidateUsers: [''],
                candidateGroups: ['']
            }),
            identityForm: this.formBuilder.group({
                assignee: [''],
                candidateUsers: [''],
                candidateGroups: ['']
            }),
            expressionForm: this.formBuilder.group({
                assignee: [''],
                candidateUsers: [''],
                candidateGroups: ['']
            })
        });
    }

    private deductConfigFromXML() {
        this.selectedType = this.assignmentXML && this.assignmentXML.type ? this.assignmentXML.type : AssignmentType.static;
        this.selectedMode = this.assignmentXML && this.assignmentXML.assignment ? this.assignmentXML.assignment : AssignmentMode.assignee;
        this.selectActiveTab();
    }

    private selectActiveTab() {
        if (this.isXMLStaticType()) {
            this.currentActiveTab = AssignmentTabs.STATIC;
            this.setStaticAssignments();
        } else if (this.isXMLIdentityType()) {
            this.currentActiveTab = AssignmentTabs.IDENTITY;
            this.setIdentityAssignments();
        } else if (this.isXMLExpressionType()) {
            this.currentActiveTab = AssignmentTabs.EXPRESSION;
            this.setExpressionAssignments();
        } else {
            this.currentActiveTab = AssignmentTabs.STATIC;
        }
    }

    private setStaticAssignments() {
        if (this.isXMLSingleMode()) {
            if (this.settings.assignee) {
                this.staticAssignee = this.settings.assignee
                    ? this.settings.assignee[0]
                    : undefined;
            }
        } else {
            if (this.settings.candidateUsers) {
                this.staticCandidateUsers = this.settings.candidateUsers;
            }

            if (this.settings.candidateGroups) {
                this.staticCandidateGroups = this.settings.candidateGroups;
            }
        }
    }

    private setIdentityAssignments() {
        if (this.isXMLSingleMode()) {
            if (
                this.settings.assignee &&
                !this.isExpressionValid(this.settings.assignee.join())
            ) {
                this.identityAssignee = this.settings.assignee.map(user => ({
                    username: user
                }));
            }
        } else {
            if (
                this.settings.candidateUsers &&
                !this.isExpressionValid(this.settings.candidateUsers.join())
            ) {
                this.identityCandidateUsers = this.settings.candidateUsers.map(
                    (username: string) => ({ username: username })
                );
            }

            if (
                this.settings.candidateGroups &&
                !this.isExpressionValid(this.settings.candidateGroups.join())
            ) {
                this.identityCandidateGroups = this.settings.candidateGroups.map(
                    groupName => ({ name: groupName })
                );
            }
        }
    }

    private setExpressionAssignments() {
        if (this.isXMLSingleMode()) {
            if (this.isExpressionValid(this.settings.assignee.join())) {
                this.expressionContent = JSON.stringify({
                    assignee: this.settings.assignee[0]
                }, null, '\t');
            } else {
                this.expressionContent =
                    AssignmentDialogComponent.ASSIGNEE_CONTENT;
            }
        } else {
            if (
                this.isExpressionValid(
                    this.settings.candidateGroups.join() ||
                        this.settings.candidateUsers.join()
                )
            ) {
                this.expressionContent = JSON.stringify({
                    candidateUsers:
                        this.settings.candidateUsers &&
                        this.settings.candidateUsers.length > 0
                            ? this.settings.candidateUsers[0]
                            : '${}',
                    candidateGroups:
                        this.settings.candidateGroups &&
                        this.settings.candidateGroups.length > 0
                            ? this.settings.candidateGroups[0]
                            : '${}'
                }, null, '\t');
            } else {
                this.expressionContent =
                    AssignmentDialogComponent.CANDIDATES_CONTENT;
            }
        }
    }

    onTabChange(currentTab: MatTabChangeEvent) {
        this.selectedType = AssignmentDialogComponent.TABS[currentTab.index];
        this.resetFormByType();
        this.assignmentForm.reset();
        this.resetProperties();
        this.assignmentPayload = undefined;
        if (this.isOriginalSelection()) {
            this.restoreFromXML();
        }
        this.currentActiveTab = currentTab.index;
    }

    onSelect(selectedType: MatSelectChange) {
        this.selectedMode = selectedType.value;
        this.processFileUri$ = this.process$.pipe(
            filter(process => !!process),
            map(process => getFileUri(this.selectedMode, this.languageType, process.id))
        );
        this.resetFormByMode();
        this.resetProperties();
        this.assignmentPayload = undefined;
        if (this.isOriginalSelection()) {
            this.restoreFromXML();
        }
    }

    isOriginalSelection() {
        return this.selectedMode === this.assignmentXML.assignment && this.selectedType === this.assignmentXML.type;
    }

    onStaticAssigneeRemove() {
        this.staticAssignee = undefined;
        this.updatePayloadWithStaticValues();
        this.markStaticControlAsDirty();
    }

    onStaticCandidateUsersRemove(username: string) {
        this.staticCandidateUsers = this.staticCandidateUsers.filter(
            user => user !== username
        );
        this.updatePayloadWithStaticValues();
        this.markStaticControlAsDirty();
    }

    onStaticCandidateGroupsRemove(groupName: string) {
        this.staticCandidateGroups = this.staticCandidateGroups.filter(
            group => group !== groupName
        );
        this.updatePayloadWithStaticValues();
        this.markStaticControlAsDirty();
    }

    onStaticAssigneeChange(event: any) {
        const input = event.input;
        if (input.value) {
            this.staticAssignee = input.value;
            input.value = '';
            this.updatePayloadWithStaticValues();
            this.markStaticControlAsDirty();
        }
    }

    onStaticCandidateUsersChange(event: any) {
        const input = event.input;
        if (input.value && !this.isStaticCandidateUserExists(input.value)) {
            this.staticCandidateUsers.push(input.value);
            input.value = '';
            this.updatePayloadWithStaticValues();
            this.markStaticControlAsDirty();
        } else {
            input.value = '';
        }
    }

    onStaticCandidateGroupsChange(event: any) {
        const input = event.input;
        if (input.value && !this.isStaticCandidateGroupExists(input.value)) {
            this.staticCandidateGroups.push(input.value);
            input.value = '';
            this.updatePayloadWithStaticValues();
            this.markStaticControlAsDirty();
        } else {
            input.value = '';
        }
    }

    private isStaticCandidateUserExists(value: string): string {
        return this.staticCandidateUsers.find((userName: string) => userName.trim() === value.trim());
    }

    private isStaticCandidateGroupExists(value: string): string {
        return this.staticCandidateGroups.find((groupName: string) => groupName.trim() === value.trim());
    }

    onIdentityAssigneeChange(assignee: IdentityUserModel[]) {
        this.identityAssignee = [...assignee];
        this.updatePayloadWithIdentityValues();
    }

    onIdentityCandidateUsersChange(candidateUsers: IdentityUserModel[]) {
        this.identityCandidateUsers = [...candidateUsers];
        this.updatePayloadWithIdentityValues();
    }

    onIdentityCandidateGroupsChange(candidateGroups: IdentityGroupModel[]) {
        this.identityCandidateGroups = [...candidateGroups];
        this.updatePayloadWithIdentityValues();
    }

    markStaticControlAsDirty() {
        this.staticForm.markAsDirty();
    }

    private validate(contentString: string): boolean {
        const validateResponse: ValidationResponse<any> = this.codeValidatorService.validateJson<any>(contentString);
        return validateResponse.valid;
    }

    onExpressionChange(contentString: string) {
        if (this.validate(contentString)) {
            if (this.isAssigneeMode()) {
                const assignee = JSON.parse(contentString);
                if (this.isAssigneeValid(assignee) && this.isExpressionValid(assignee.assignee)) {
                    this.expressionForm.reset();
                    this.expressionAssignee = this.isExpressionValid(assignee.assignee) ? assignee.assignee : undefined;
                    this.expressionForm.markAsDirty();
                } else {
                    if (assignee.assignee === '') {
                        this.expressionErrorMessage = AssigneeExpressionErrorMessages.assigneeEmpty;
                        this.expressionForm.setErrors({ pattern: 'true'});
                    } else {
                        this.expressionErrorMessage = AssigneeExpressionErrorMessages.assigneePattern;
                        this.expressionForm.setErrors({ pattern: 'true' });
                    }
                }
            } else {
                const candidates = JSON.parse(contentString);
                const isValid = this.isCandidatesPresentAndExpressionValid(candidates);
                if (isValid) {
                    this.expressionForm.reset();
                    this.expressionCandidateUsers = this.isExpressionValid(candidates.candidateUsers) ? candidates.candidateUsers : undefined;
                    this.expressionCandidateGroups = this.isExpressionValid(candidates.candidateGroups) ? candidates.candidateGroups : undefined;
                    this.expressionForm.markAsDirty();
                } else {
                    this.expressionForm.setErrors({ pattern: 'true' });
                }
            }

            if (this.expressionForm.valid) {
                this.updatePayloadWithExpressionValues();
            }
        } else {
            this.expressionForm.setErrors({ pattern: 'true' });
        }
    }

    onAssign() {
        if (this.assignmentPayload) {
            this.settings.assignmentUpdate$.next(this.assignmentPayload);
            this.settings.assignmentUpdate$.complete();
            this.updateAssignment();
            this.dialogRef.close();
        }
    }

    isCandidatesPresentAndExpressionValid(candidates) {
        let isValid = false;
        if (this.isCandidateValid(candidates)) {
            if (candidates.candidateUsers !== undefined && candidates.candidateGroups !== undefined) {
                if (this.isExpressionValid(candidates.candidateUsers) && this.isExpressionValid(candidates.candidateGroups)) {
                    isValid = true;
            } else {
                this.expressionForm.setErrors({ pattern: 'true' });
            }

            } else if ((candidates.candidateUsers && this.isExpressionValid(candidates.candidateUsers))
            || (candidates.candidateGroups && this.isExpressionValid(candidates.candidateGroups))) {
                isValid = true;
            }
        }
        return isValid;
    }

    updateAssignment(): void {
        this.store
            .select(selectSelectedProcess)
            .pipe(
                filter(model => !!model),
                take(1)
            )
            .subscribe(model =>
                this.store.dispatch(
                    new UpdateServiceAssignmentAction(
                        model.id,
                        this.settings.processId,
                        this.settings.shapeId,
                        <TaskAssignment>{
                            type: this.selectedType,
                            assignment: this.selectedMode,
                            id: this.settings.shapeId
                        }
                    )
                )
            );
    }

    onClose() {
        this.settings.assignmentUpdate$.complete();
        this.dialogRef.close();
    }

    private updatePayloadWithStaticValues() {
        this.assignmentPayload = this.buildPayloadWithStaticValues({
            assignee: this.staticAssignee,
            candidateUsers: this.staticCandidateUsers,
            candidateGroups: this.staticCandidateGroups
        });
    }

    private updatePayloadWithIdentityValues() {
        this.assignmentPayload = this.buildPayloadWithIdentityValues({
            assignee: this.identityAssignee,
            candidateUsers: this.identityCandidateUsers,
            candidateGroups: this.identityCandidateGroups
        });
    }

    private updatePayloadWithExpressionValues() {
        this.assignmentPayload = this.buildExpressionPayload({
            assignee: this.expressionAssignee,
            candidateUsers: this.expressionCandidateUsers,
            candidateGroups: this.expressionCandidateGroups
        });
    }

    private buildPayloadWithStaticValues({
        assignee,
        candidateUsers,
        candidateGroups
    }: {
        assignee: string;
        candidateUsers: string[];
        candidateGroups: string[];
    }): AssignmentModel {
        return <AssignmentModel>{
            assignments: <AssignmentParams[]>[
                {
                    key: BpmnProperty.assignee,
                    value: assignee ? assignee : undefined
                },
                {
                    key: BpmnProperty.candidateUsers,
                    value:
                        candidateUsers && candidateUsers.length > 0
                            ? candidateUsers.join()
                            : undefined
                },
                {
                    key: BpmnProperty.candidateGroups,
                    value:
                        candidateGroups && candidateGroups.length > 0
                            ? candidateGroups.join()
                            : undefined
                }
            ]
        };
    }

    private buildPayloadWithIdentityValues({
        assignee,
        candidateUsers,
        candidateGroups
    }: {
        assignee: any[];
        candidateUsers: any[];
        candidateGroups: any[];
    }): AssignmentModel {
        return <AssignmentModel>{
            assignments: <AssignmentParams[]>[
                {
                    key: BpmnProperty.assignee,
                    value:
                        assignee && assignee.length > 0
                            ? assignee[0].username
                            : undefined
                },
                {
                    key: BpmnProperty.candidateUsers,
                    value:
                        candidateUsers && candidateUsers.length > 0
                            ? candidateUsers.map(user => user.username).join()
                            : undefined
                },
                {
                    key: BpmnProperty.candidateGroups,
                    value:
                        candidateGroups && candidateGroups.length > 0
                            ? candidateGroups.map(group => group.name).join()
                            : undefined
                }
            ]
        };
    }

    private buildExpressionPayload({
        assignee,
        candidateUsers,
        candidateGroups
    }: {
        assignee: string;
        candidateUsers: string;
        candidateGroups: string;
    }): AssignmentModel {
        return <AssignmentModel>{
            assignments: <AssignmentParams[]>[
                {
                    key: BpmnProperty.assignee,
                    value: assignee ? assignee : undefined
                },
                {
                    key: BpmnProperty.candidateUsers,
                    value: candidateUsers ? candidateUsers : undefined
                },
                {
                    key: BpmnProperty.candidateGroups,
                    value: candidateGroups ? candidateGroups : undefined
                }
            ]
        };
    }

    isExpressionValid(value: string) {
        return /\${([^}]+)}/.test(value);
    }

    isCandidateValid(candidates): boolean {
        let result = true;
        if (Object.keys(candidates).length === 2) {
            Object.keys(candidates).forEach((key: string) => {
                if (key !== 'candidateUsers' && key !== 'candidateGroups') {
                    result = false;
                }
            });
        }
        return result;
    }

    isAssigneeValid(assignee): boolean {
        let result = true;
        if (Object.keys(assignee).length === 1) {
            Object.keys(assignee).forEach((key: string) => {
                if (key !== 'assignee') {
                    result = false;
                }
            });
        }
        return result;
    }

    isAssigneeMode(): boolean {
        return this.selectedMode === AssignmentMode.assignee;
    }

    isCandidatesMode(): boolean {
        return this.selectedMode === AssignmentMode.candidates;
    }

    isXMLSingleMode(): boolean {
        return (
            this.assignmentXML &&
            this.assignmentXML.assignment === AssignmentMode.assignee
        );
    }

    isXMLCandidatesMode(): boolean {
        return (
            this.assignmentXML &&
            this.assignmentXML.assignment === AssignmentMode.candidates
        );
    }

    isXMLStaticType() {
        return (
            this.assignmentXML &&
            this.assignmentXML.type === AssignmentType.static
        );
    }

    isXMLIdentityType() {
        return (
            this.assignmentXML &&
            this.assignmentXML.type === AssignmentType.identity
        );
    }

    isXMLExpressionType() {
        return (
            this.assignmentXML &&
            this.assignmentXML.type === AssignmentType.expression
        );
    }

    isStaticType() {
        return this.selectedType === AssignmentType.static;
    }

    isIdentityType() {
        return this.selectedType === AssignmentType.identity;
    }

    isExpressionType() {
        return this.selectedType === AssignmentType.expression;
    }

    resetProperties() {
        this.assignmentPayload = undefined;
        this.removeStaticValues();
        this.removeIdentityValues();
        this.removeExpressionValues();
    }

    restoreFromXML() {
        if (this.isXMLStaticType()) {
            this.setStaticAssignments();
        } else if (this.isXMLIdentityType()) {
            this.setIdentityAssignments();
        } else if (this.isXMLExpressionType()) {
            this.setExpressionAssignments();
        }
    }

    isTabActive(index: number) {
        return this.currentActiveTab === index;
    }

    private removeStaticValues() {
        this.staticAssignee = undefined;
        this.staticCandidateUsers = [];
        this.staticCandidateGroups = [];
    }

    private removeIdentityValues() {
        this.identityAssignee = [].concat([]);
        this.identityCandidateUsers = [].concat([]);
        this.identityCandidateGroups = [].concat([]);
    }

    private removeExpressionValues() {
        this.expressionAssignee = undefined;
        this.expressionCandidateUsers = undefined;
        this.expressionCandidateGroups = undefined;
        if (this.isAssigneeMode()) {
            this.expressionContent = AssignmentDialogComponent.ASSIGNEE_CONTENT;
        } else {
            this.expressionContent = AssignmentDialogComponent.CANDIDATES_CONTENT;
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    get staticForm(): any {
        return this.assignmentForm.get('staticForm');
    }

    get assigneeStaticControl(): AbstractControl {
        return this.staticForm.get('assignee');
    }

    get candidateUsersStaticControl(): AbstractControl {
        return this.staticForm.get('candidateUsers');
    }

    get candidateGroupsStaticControl(): AbstractControl {
        return this.staticForm.get('candidateGroups');
    }

    get identityForm(): any {
        return this.assignmentForm.get('identityForm');
    }

    get assigneeIdentityControl(): AbstractControl {
        return this.identityForm.get('assignee');
    }

    get candidateUsersIdentityControl(): AbstractControl {
        return this.identityForm.get('candidateUsers');
    }

    get candidateGroupsIdentityControl(): AbstractControl {
        return this.identityForm.get('candidateGroups');
    }

    get expressionForm(): any {
        return this.assignmentForm.get('expressionForm');
    }

    get assigneeExpressionControl(): AbstractControl {
        return this.expressionForm.get('assignee');
    }

    get candidateUsersExpressionControl(): AbstractControl {
        return this.expressionForm.get('candidateUsers');
    }

    get candidateGroupsExpressionControl(): AbstractControl {
        return this.expressionForm.get('candidateGroups');
    }

    get assignmentFormEnabled() {
        return (
            this.assignmentForm.valid &&
            (this.assignmentForm.dirty || this.assignmentForm.touched)
        );
    }
}
