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

import { Injectable, OnDestroy } from '@angular/core';
import { TranslationService, CardViewArrayItem } from '@alfresco/adf-core';
import { ElementHelper } from '../../bpmn-js/element.helper';
import { AmaState, AssignmentMode, AssignmentType, BpmnProperty, selectSelectedProcess, TaskAssignment, UpdateServiceAssignmentAction } from '@alfresco-dbp/modeling-shared/sdk';
import { Subject } from 'rxjs';
import { AssignmentModel, AssignmentSettings } from '../../../components/assignment/assignment-dialog.component';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';

@Injectable()
export class TaskAssignmentService implements OnDestroy {

    assignmentSubject = new Subject<AssignmentModel>();
    currentProcessSelected = '';
    private onDestroy$: Subject<void> = new Subject<void>();
    copiedAssignments;

    constructor(private translationService: TranslationService, private store: Store<AmaState>) {
    }

    getDisplayValue(element: Bpmn.DiagramElement): CardViewArrayItem[] {
        const { assignee, candidateUsers, candidateGroups } = this.getAssignments(element);
        return this.prepareDisplayValue(assignee, candidateUsers, candidateGroups).filter((res) => res.value);
    }

    updateDisplayValue(data: AssignmentModel): CardViewArrayItem[] {
        const [ assignee, candidateUsers, candidateGroups ] = data.assignments.map((assignment) => assignment.value);
        return this.prepareDisplayValue(
            this.convertStringToArray(assignee),
            this.convertStringToArray(candidateUsers),
            this.convertStringToArray(candidateGroups)).filter((res) => res.value);
    }

    getAssignments(element: Bpmn.DiagramElement): AssignmentSettings {
        return {
            assignee: this.convertStringToArray(ElementHelper.getProperty(element, BpmnProperty.assignee)),
            candidateUsers: this.convertStringToArray(ElementHelper.getProperty(element, BpmnProperty.candidateUsers)),
            candidateGroups: this.convertStringToArray(ElementHelper.getProperty(element, BpmnProperty.candidateGroups))
        };
    }

    private prepareDisplayValue(assignee: string[], candidateUsers: string[],  candidateGroups: string[]): CardViewArrayItem[] {
        const values: CardViewArrayItem[] = [];

        values.push(this.isExpressionType(assignee.join()) ? this.addExpressionValue() : this.addAssigneeValue(assignee));
        if (this.isExpressionType(candidateUsers.join()) || this.isExpressionType(candidateGroups.join())) {
            values.push(this.addExpressionValue());
        } else {
            values.push(this.addCandidateUsersValue(candidateUsers));
            values.push(this.addCandidateGroupsValue(candidateGroups));
        }
        return values;
    }

    private addAssigneeValue(assignee: string[]): CardViewArrayItem {
        return {
            icon: 'person',
            value: assignee && assignee.length > 0 ? this.translationService.instant('PROCESS_EDITOR.ELEMENT_PROPERTIES.TASK_ASSIGNMENT.USER', { count: 1 }) : undefined
        };
    }

    private addCandidateUsersValue(candidateUsers: string[]): CardViewArrayItem {
        return {
            icon: 'person',
            value: candidateUsers && candidateUsers.length > 0 ? candidateUsers.length === 1 ?
                this.translationService.instant('PROCESS_EDITOR.ELEMENT_PROPERTIES.TASK_ASSIGNMENT.USER', { count: 1 }) :
                this.translationService.instant('PROCESS_EDITOR.ELEMENT_PROPERTIES.TASK_ASSIGNMENT.USERS', { count: candidateUsers.length }) : undefined
        };

    }

    private addCandidateGroupsValue(candidateGroups: string[]): CardViewArrayItem {
        return {
            icon: 'group',
            value: candidateGroups && candidateGroups.length > 0 ? candidateGroups.length === 1 ?
                this.translationService.instant('PROCESS_EDITOR.ELEMENT_PROPERTIES.TASK_ASSIGNMENT.GROUP', { count: 1 }) :
                this.translationService.instant('PROCESS_EDITOR.ELEMENT_PROPERTIES.TASK_ASSIGNMENT.GROUPS', { count: candidateGroups.length }) : undefined
        };
    }

    private addExpressionValue(): CardViewArrayItem {
        return { icon: 'code', value: 'Expression' };
    }

    private isExpressionType(value: string): boolean {
        return  /\${([^}]+)}/.test(value);
    }

    private convertStringToArray(value: string): string[] {
        return value ? value.split(',') : [];
    }

    getProcessIdForElement(element): string {
        return ElementHelper.getProperty(element, BpmnProperty.processId);
    }

    private updateUserExtension(processUUid: string, selectedElement: any, assignees: AssignmentSettings) {
        this.store.dispatch(
            new UpdateServiceAssignmentAction(
                processUUid,
                this.currentProcessSelected,
                selectedElement.businessObject.id,
                <TaskAssignment>{
                    type: this.getAssignmentType(assignees, selectedElement.id),
                    assignment: this.getAssignmentValues(assignees),
                    id: selectedElement.businessObject.id
                }
            )
        );
    }

    getCopiedAssignmentType(taskId: string): string {
        return this.copiedAssignments[taskId]?.type ?? AssignmentType.static;
    }

    private getAssignmentValues(assignees: AssignmentSettings) {
        let currentAssignment = '';
        if (assignees.assignee.length > 0) {
            currentAssignment = AssignmentMode.assignee;
        } else if (assignees.candidateUsers.length > 0 || assignees.candidateGroups.length > 0) {
            currentAssignment = AssignmentMode.candidates;
        }
        return currentAssignment;
    }

    private getAssignmentType(assignees: AssignmentSettings, taskId: string) {
        let currentAssignment = '';
        if (assignees.assignee.length > 0) {
            currentAssignment = assignees.assignee[0];
        } else if (assignees.candidateUsers.length > 0) {
            currentAssignment = assignees.candidateUsers[0];
        } else if (assignees.candidateGroups.length > 0) {
            currentAssignment = assignees.candidateGroups[0];
        }

        return currentAssignment.startsWith('${') && currentAssignment.endsWith('}') ?
            AssignmentType.expression : this.getCopiedAssignmentType(taskId);
    }

    pasteActionHandler(event, currentSelectedProcess) {
        this.currentProcessSelected = currentSelectedProcess;
        const assignees: AssignmentSettings = this.getAssignments(event.descriptor);
        if (this.isTaskAssigned(assignees)) {
            this.checkAndUpdateProcessExtension(event.descriptor, assignees);
        }
    }

    copyActionHandler(currentSelectedProcess) {
        this.store.select(selectSelectedProcess)
            .pipe(
                filter(model => !!model),
                take(1)
            )
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(model => {
                this.copiedAssignments = model.extensions[currentSelectedProcess].assignments;
            });
    }

    private isTaskAssigned(assignees: AssignmentSettings): boolean {
        return assignees.assignee.length > 0 || assignees.candidateUsers.length > 0 || assignees.candidateGroups.length > 0;
    }

    private checkAndUpdateProcessExtension(selectedElement: any, assignees: AssignmentSettings) {
        this.store.select(selectSelectedProcess)
            .pipe(
                filter(model => !!model),
                take(1)
            )
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(model => this.updateUserExtension(model.id, selectedElement, assignees));
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
