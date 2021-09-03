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

import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import {
    CardItemTypeService,
    CardViewArrayItem,
    CardViewArrayItemModel,
    CardViewUpdateService
} from '@alfresco/adf-core';
import { OpenTaskAssignmentDialogAction } from '../../../store/process-task-assignment.actions';
import { BehaviorSubject, of, Subject } from 'rxjs';
import {
    AmaState,
    ProcessModelerServiceToken,
    ProcessModelerService,
    UpdateServiceAssignmentAction,
    TaskAssignment,
    AssignmentMode,
    AssignmentType,
    selectSelectedProcess
} from '@alfresco-dbp/modeling-shared/sdk';
import { selectSelectedElement } from '../../../store/process-editor.selectors';
import { take, distinctUntilChanged, takeUntil, filter } from 'rxjs/operators';
import { TaskAssignmentService } from './task-assignment.service';
import { AssignmentModel, AssignmentSettings } from '../../../components/assignment/assignment-dialog.component';
import { SelectedProcessElement } from '../../../store/process-editor.state';

@Component({
    selector: 'ama-task-assignment-item',
    templateUrl: './task-assignment-item.component.html',
    providers: [CardItemTypeService]
})
export class CardViewTaskAssignmentItemComponent implements OnInit, OnDestroy {
    static readonly DEFAULT_ITEM_MODEL = {
        label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.ASSIGNMENT',
        key: 'assignment',
        icon: 'edit',
        default: '',
        type: 'array',
        clickable: true,
        noOfItemsToDisplay: 2,
        value: of([])
    };

    currentProcessSelected = '';

    cardViewArrayItem$: BehaviorSubject<CardViewArrayItemModel> = new BehaviorSubject<CardViewArrayItemModel>(
        new CardViewArrayItemModel(CardViewTaskAssignmentItemComponent.DEFAULT_ITEM_MODEL)
    );

    private onDestroy$: Subject<void> = new Subject<void>();

    constructor(
        private cardViewUpdateService: CardViewUpdateService,
        private taskAssignmentService: TaskAssignmentService,
        @Inject(ProcessModelerServiceToken)
        private processModelerService: ProcessModelerService,
        private store: Store<AmaState>,
    ) { }

    ngOnInit(): void {
        this.store
            .select(selectSelectedElement)
            .pipe(take(1))
            .subscribe((selectedElement: SelectedProcessElement) => {
                const element = this.processModelerService.getElement(selectedElement.id);
                this.currentProcessSelected = selectedElement.processId;
                const cardViewArrayItem = this.createCardViewArrayItem(this.taskAssignmentService.getDisplayValue(element));
                this.cardViewArrayItem$.next(cardViewArrayItem);
            });

        this.taskAssignmentService.assignmentSubject
            .pipe(distinctUntilChanged(), takeUntil(this.onDestroy$))
            .subscribe((updatedAssignments: AssignmentModel) => {
                const cardViewArrayItem = this.createCardViewArrayItem(this.taskAssignmentService.updateDisplayValue(updatedAssignments));
                this.cardViewArrayItem$.next(cardViewArrayItem);
            });

        this.cardViewUpdateService.itemClicked$
            .pipe(distinctUntilChanged(), takeUntil(this.onDestroy$))
            .subscribe(this.openTaskAssignmentDialog.bind(this));

        this.processModelerService.createEventHandlerForAction('copyPaste.pasteElement', this.copyActionAHandler.bind(this));
    }

    private updateUserExtension(processUUid: string, selectedElement: any, assignees: AssignmentSettings) {
        this.store.dispatch(
            new UpdateServiceAssignmentAction(
                processUUid,
                this.currentProcessSelected,
                selectedElement.businessObject.id,
                <TaskAssignment>{
                    type: this.getAssignmentType(assignees),
                    assignment: this.getAssignmentValues(assignees),
                    id: selectedElement.id
                }
            )
        );
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

    private getAssignmentType(assignees: AssignmentSettings) {
        let currentAssignment = '';
        if (assignees.assignee.length > 0) {
            currentAssignment = assignees.assignee[0];
        } else if (assignees.candidateUsers.length > 0) {
            currentAssignment = assignees.candidateUsers[0];
        } else if (assignees.candidateGroups.length > 0) {
            currentAssignment = assignees.candidateGroups[0];
        }
        return currentAssignment.startsWith('${') && currentAssignment.endsWith('}') ? AssignmentType.expression : AssignmentType.static;
    }

    private copyActionAHandler(event) {
        const assignees: AssignmentSettings = this.taskAssignmentService.getAssignments(event.descriptor);
        if (this.isTaskAssigned(assignees)) {
            this.checkAndUpdateProcessExtension(event.descriptor, assignees);
        }
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

    private openTaskAssignmentDialog(): void {
        this.store.dispatch(new OpenTaskAssignmentDialogAction());
    }

    private createCardViewArrayItem(assignments: CardViewArrayItem[]): CardViewArrayItemModel {
        return new CardViewArrayItemModel({
            ...CardViewTaskAssignmentItemComponent.DEFAULT_ITEM_MODEL,
            value: of(assignments),
        });
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
