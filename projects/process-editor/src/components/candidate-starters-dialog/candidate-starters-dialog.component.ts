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
import { MatSelectChange } from '@angular/material/select';
import { Subject } from 'rxjs';
import { AssignmentModel, AssignmentParams, identityCandidateValidator } from '../assignment/assignment-dialog.component';

export interface CandidateStartersSettings {
    candidateStarterUsers: string | string[] | undefined;
    candidateStarterGroups: string | string[] | undefined;
    candidateStartersUpdate$?: Subject<any>;
    shapeId?: string;
    processId?: string;
}

export enum PermissionLevelTypes {
    EVERYONE = 'everyone',
    NOBODY = 'nobody',
    SPECIFIC = 'specific',
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
    permissionLevels = [
        {
            key: PermissionLevelTypes.EVERYONE,
            label:
                'PROCESS_EDITOR.PROCESS_PERMISSIONS.EVERYONE'
        },
        {
            key: PermissionLevelTypes.NOBODY,
            label:
                'PROCESS_EDITOR.PROCESS_PERMISSIONS.NOBODY'
        },
        {
            key: PermissionLevelTypes.SPECIFIC,
            label:
                'PROCESS_EDITOR.PROCESS_PERMISSIONS.SPECIFIC'
        }
    ];
    selectedPermissionLevel: string;

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
        return this.candidateUserIdentityFormGroup.get('candidateUsersChips') as FormControl;
    }

    get candidateGroupIdentityFormGroup(): FormGroup {
        return <FormGroup> this.candidatesIdentityFormGroup.get('candidateGroupFormGroup');
    }

    get candidateStarterGroupsChipsIdentityControl(): FormControl {
        return this.candidateGroupIdentityFormGroup.get('candidateGroupsChips') as FormControl;
    }

    get candidateStarterGroupsIdentityControl(): FormControl {
        return this.candidateGroupIdentityFormGroup.get('candidateStarterGroups') as FormControl;
    }

    get isCandidateStarterGroupAssigned(): boolean {
        return this.candidateStarterGroups && this.candidateStarterGroups.length > 0;
    }

    get isCandidateStarterUserAssigned(): boolean {
        return this.candidateStarterUsers && this.candidateStarterUsers.length > 0;
    }

    ngOnInit() {
        this.setCurrentCandidateStartersAssignmentStrategy();
        this.createCandidateStartersForm();
    }

    onSelect({value}: MatSelectChange): void {
        this.selectedPermissionLevel = value;
        this.candidateStartersPayload = undefined;
        if (this.selectedPermissionLevel === PermissionLevelTypes.NOBODY) {
            this.candidateStartersPayload = this.buildPayloadWithNoUsersGroups();
        }
    }

    onCandidateStarterUsersChange(candidateStarterUsers: IdentityUserModel[]): void {
        this.candidateStarterUsers = [...candidateStarterUsers];
        this.updatePayloadWithIdentityValues();
    }

    onCandidateStarterGroupsChange(candidateStarterGroups: IdentityGroupModel[]): void {
        this.candidateStarterGroups = [...candidateStarterGroups];
        this.updatePayloadWithIdentityValues();
    }

    onClose(): void {
        this.settings.candidateStartersUpdate$.complete();
        this.dialogRef.close();
    }

    onSave(): void {
        this.settings.candidateStartersUpdate$.next(this.candidateStartersPayload);
        this.settings.candidateStartersUpdate$.complete();
        this.dialogRef.close();
    }

    private createCandidateStartersForm(): void {
        this.candidateStartersForm = this.formBuilder.group({
            identityForm: this.formBuilder.group({}),
        });
        this.createChildrenFormControls();
        this.loadingForm = false;
    }

    private createChildrenFormControls (): void {
        this.candidateStartersFormClean();
        this.createIdentityForm();
        this.candidateStartersForm.updateValueAndValidity();
    }

    private candidateStartersFormClean(): void {
        this.identityForm.controls = {};
        this.candidateStartersForm.reset();
    }

    private createIdentityForm(): void {
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
                'candidateUsersChips': ''
            });
    }

    private createCandidateGroupFormGroup(): FormGroup {
        return this.formBuilder.group(
            {
                'candidateStarterGroups': '',
                'candidateGroupsChips': ''
            });
    }

    private updatePayloadWithIdentityValues(): void {
        this.candidateStartersPayload = this.buildPayloadWithIdentityValues({
            candidateStarterUsers: this.candidateStarterUsers,
            candidateStarterGroups: this.candidateStarterGroups
        });
    }

    get candidateStartersFormEnabled(): boolean {
        return (this.selectedPermissionLevel === PermissionLevelTypes.EVERYONE || this.selectedPermissionLevel === PermissionLevelTypes.NOBODY) ||
            this.candidateStartersForm.valid && !this.candidateStartersForm.pristine;
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

    private buildPayloadWithNoUsersGroups(): AssignmentModel {
        return <AssignmentModel>{
            assignments: <AssignmentParams[]>[
                {
                    key: BpmnProperty.candidateStarterUsers,
                    value: ''
                },
                {
                    key: BpmnProperty.candidateStarterGroups,
                    value: ''
                }
            ]
        };
    }

    private setCurrentCandidateStartersAssignmentStrategy(): void {
        if (this.canEveryoneStartProcess()) {
            this.selectedPermissionLevel = PermissionLevelTypes.EVERYONE;
        } else if (this.canNobodyStartProcess()) {
            this.selectedPermissionLevel = PermissionLevelTypes.NOBODY;
            this.candidateStartersPayload = this.buildPayloadWithNoUsersGroups();
        } else {
            this.selectedPermissionLevel = PermissionLevelTypes.SPECIFIC;
            this.candidateStarterUsers = Array.isArray(this.settings.candidateStarterUsers) && this.settings.candidateStarterUsers.map(username => ({ username }));
            this.candidateStarterGroups = Array.isArray(this.settings.candidateStarterGroups) && this.settings.candidateStarterGroups.map(name => ({ name }));
        }
    }

    private canNobodyStartProcess(): boolean {
        return (this.settings.candidateStarterUsers === '' && this.settings.candidateStarterGroups === '') ||
        (this.settings.candidateStarterUsers === undefined && this.settings.candidateStarterGroups === '') ||
        (this.settings.candidateStarterUsers === '' && this.settings.candidateStarterGroups === undefined);
    }

    private canEveryoneStartProcess(): boolean {
        return (this.settings.candidateStarterUsers === undefined && this.settings.candidateStarterGroups === undefined);
    }
}
