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
    CardViewArrayItemModel,
    CardViewUpdateService
} from '@alfresco/adf-core';
import { OpenTaskAssignmentDialogAction } from '../../../store/process-task-assignment.actions';
import { of, Subject } from 'rxjs';
import {
    AmaState,
    ProcessModelerServiceToken,
    ProcessModelerService
} from '@alfresco-dbp/modeling-shared/sdk';
import { selectSelectedElement } from '../../../store/process-editor.selectors';
import { take, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { TaskAssignmentService } from './task-assignment.service';
import { AssignmentModel } from '../../../components/assignment/assignment-dialog.component';

@Component({
    selector: 'ama-task-assignment-item',
    templateUrl: './task-assignment-item.component.html',
    providers: [CardItemTypeService]
})
export class CardViewTaskAssignmentItemComponent implements OnInit, OnDestroy {

    cardViewArrayItem: CardViewArrayItemModel;

    private onDestroy$: Subject<void> = new Subject<void>();

    constructor(
        private cardViewUpdateService: CardViewUpdateService,
        private taskAssignmentService: TaskAssignmentService,
        @Inject(ProcessModelerServiceToken)
        private processModelerService: ProcessModelerService,
        private store: Store<AmaState>
    ) {
        this.store
            .select(selectSelectedElement)
            .pipe(take(1))
            .subscribe(selectedElement => {
                const element = this.processModelerService.getElement(selectedElement.id);
                this.createCardViewArrayItem(this.taskAssignmentService.getDisplayValue(element));
            });

        this.taskAssignmentService.assignmentSubject
            .pipe(distinctUntilChanged(), takeUntil(this.onDestroy$))
            .subscribe((updatedAssignments: AssignmentModel) => {
                this.createCardViewArrayItem(this.taskAssignmentService.updateDisplayValue(updatedAssignments));
            });
    }

    ngOnInit(): void {
        this.cardViewUpdateService.itemClicked$
            .pipe(distinctUntilChanged(), takeUntil(this.onDestroy$))
            .subscribe(this.openTaskAssignmentDialog.bind(this));
    }

    openTaskAssignmentDialog(): void {
        this.store.dispatch(new OpenTaskAssignmentDialogAction());
    }

    createCardViewArrayItem(assignments: any) {
        this.cardViewArrayItem  = new CardViewArrayItemModel({
            label: 'PROCESS_EDITOR.ELEMENT_PROPERTIES.ASSIGNMENT',
            value: of(assignments),
            key: 'assignment',
            icon: 'edit',
            default: '',
            clickable: true,
            noOfItemsToDisplay: 2
        });
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
