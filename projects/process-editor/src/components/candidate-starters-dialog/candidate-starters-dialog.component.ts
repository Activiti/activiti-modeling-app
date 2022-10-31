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

import { BpmnProperty } from '@alfresco-dbp/modeling-shared/sdk';
import { IdentityGroupModel, IdentityUserModel } from '@alfresco/adf-process-services-cloud';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { AssignmentModel, AssignmentParams, identityCandidateValidator } from '../assignment/assignment-dialog.component';


export interface CandidateStartersSettings {
    candidateStarterUsers: string[];
    candidateStarterGroups: string[];
    candidateStartersUpdate$?: Subject<any>;
    shapeId?: string;
    processId?: string;
}

@Component({
    selector: 'ama-candidate-starters-dialog',
    templateUrl: './candidate-starters-dialog.component.html',
    styleUrls: ['./candidate-starters-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CandidateStartersDialogComponent implements OnInit {
    candidateStarterUsers: IdentityUserModel[] = [];
    candidateStarterGroups: IdentityGroupModel[] = [];
    candidateStartersPayload: any;
    candidateStartersForm: FormGroup;
    loadingForm = true;

    roles = ['ACTIVITI_USER'];
    constructor(
        public dialogRef: MatDialogRef<CandidateStartersDialogComponent>,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public settings: CandidateStartersSettings) {
    }

    get identityForm(): FormGroup {
        return <FormGroup> this.candidateStartersForm.get('identityForm');
    }

    get candidatesIdentityFormGroup(): FormGroup {
        return <FormGroup> this.identityForm.get('candidatesFormGroup');
    }

    get candidateUserIdentityFormGroup(): FormGroup {
        return <FormGroup> this.candidatesIdentityFormGroup.get('candidateUserFormGroup');
    }

    get candidateStarterUsersIdentityControl(): FormControl {
        return this.candidateUserIdentityFormGroup.get('candidateStarterUsers') as FormControl;
    }

    get candidateStarterUsersChipsIdentityControl(): FormControl {
        return this.candidateUserIdentityFormGroup.get('candidateStarterUsersChips') as FormControl;
    }

    get candidateGroupIdentityFormGroup(): FormGroup {
        return <FormGroup> this.candidatesIdentityFormGroup.get('candidateGroupFormGroup');
    }

    get candidateStarterGroupsChipsIdentityControl(): FormControl {
        return this.candidateGroupIdentityFormGroup.get('candidateStarterGroupsChips') as FormControl;
    }

    get candidateStarterGroupsIdentityControl(): FormControl {
        return this.candidateGroupIdentityFormGroup.get('candidateStarterGroups') as FormControl;
    }


    ngOnInit() {
        this.createCandidateStartersForm();
    }

    createCandidateStartersForm() {
        this.candidateStartersForm = this.formBuilder.group({
            identityForm: this.formBuilder.group({}),
        });
        this.createChildrenFormControls();
        this.setIdentityAssignments();
        this.loadingForm = false;
    }

    private createChildrenFormControls () {
        this.candidateStartersFormClean();
        this.createIdentityForm();
        this.candidateStartersForm.updateValueAndValidity();
    }

    private candidateStartersFormClean() {
        this.identityForm.controls = {};
        this.candidateStartersForm.reset();
    }

    private createIdentityForm() {
        this.createAssigneeCandidateForm(this.identityForm);
    }

    private createAssigneeCandidateForm(formGroup: FormGroup): void {
        const candidatesFormGroup = this.createCandidatesFormGroup();
        formGroup.addControl('candidatesFormGroup', candidatesFormGroup);
        formGroup.updateValueAndValidity();
    }

    private createCandidatesFormGroup(): FormGroup {
        const candidateUserFormGroup = this.createCandidateUserFormGroup();
        const candidateGroupFormGroup = this.createCandidateGroupFormGroup();
        return this.formBuilder.group(
            {
                'candidateUserFormGroup': candidateUserFormGroup,
                'candidateGroupFormGroup': candidateGroupFormGroup
            }, { validator: identityCandidateValidator });
    }

    private createCandidateUserFormGroup(): FormGroup {
        return this.formBuilder.group(
            {
                'candidateStarterUsers': '',
                'candidateStarterUsersChips': ''
            });
    }

    private createCandidateGroupFormGroup(): FormGroup {
        return this.formBuilder.group(
            {
                'candidateStarterGroups': '',
                'candidateStarterGroupsChips': ''
            });
    }

    private setIdentityAssignments() {
        if (
            this.settings.candidateStarterUsers &&
            !this.isExpressionValid(this.settings.candidateStarterUsers.join())
        ) {
            this.candidateStarterUsers = this.settings.candidateStarterUsers.map(
                (username: string) => ({ username: username })
            );
        }

        if (
            this.settings.candidateStarterGroups &&
            !this.isExpressionValid(this.settings.candidateStarterGroups.join())
        ) {
            this.candidateStarterGroups = this.settings.candidateStarterGroups.map(
                groupName => ({ name: groupName })
            );
        }
    }

    isExpressionValid(value: string) {
        return /\${([^}]+)}/.test(value);
    }

    onCandidateStarterUsersChange(candidateStarterUsers: IdentityUserModel[]) {
        this.candidateStarterUsers = [...candidateStarterUsers];
        this.updatePayloadWithIdentityValues();
    }

    onCandidateStarterGroupsChange(candidateStarterGroups: IdentityGroupModel[]) {
        this.candidateStarterGroups = [...candidateStarterGroups];
        this.updatePayloadWithIdentityValues();
    }


    private updatePayloadWithIdentityValues() {
        this.candidateStartersPayload = this.buildPayloadWithIdentityValues({
            candidateStarterUsers: this.candidateStarterUsers,
            candidateStarterGroups: this.candidateStarterGroups
        });
    }

    onClose() {
        this.settings.candidateStartersUpdate$.complete();
        this.dialogRef.close();
    }

    get candidateStartersFormEnabled() {
        return this.candidateStartersForm.valid && !this.candidateStartersForm.pristine;
    }

    private buildPayloadWithIdentityValues({
        candidateStarterUsers,
        candidateStarterGroups
    }: {
        candidateStarterUsers: IdentityUserModel[];
        candidateStarterGroups: IdentityGroupModel[];
    }): AssignmentModel {
        return <AssignmentModel>{
            assignments: <AssignmentParams[]>[
                {
                    key: BpmnProperty.candidateStarterUsers,
                    value:
                        candidateStarterUsers?.length > 0
                            ? candidateStarterUsers.map(user => user.username).join()
                            : undefined
                },
                {
                    key: BpmnProperty.candidateStarterGroups,
                    value:
                        candidateStarterGroups?.length > 0
                            ? candidateStarterGroups.map(group => group.name).join()
                            : undefined
                }
            ]
        };
    }

    onAssign() {
        if (this.candidateStartersPayload) {
            this.settings.candidateStartersUpdate$.next(this.candidateStartersPayload);
            this.settings.candidateStartersUpdate$.complete();
            this.dialogRef.close();
        }
    }
}
