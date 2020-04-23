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

import { Injectable, Inject } from '@angular/core';
import {
    BaseEffects,
    DialogService,
    ProcessModelerServiceToken,
    ProcessModelerService,
    AmaState,
    SetAppDirtyStateAction
} from '@alfresco-dbp/modeling-shared/sdk';
import { LogService } from '@alfresco/adf-core';
import { Router } from '@angular/router';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { OpenTaskAssignmentDialogAction, OPEN_TASK_ASSIGNMENT_DIALOG, UpdateTaskAssignmentAction, UPDATE_TASK_ASSIGNMENT_VARIABLES } from './process-task-assignment.actions';
import { switchMap, take, map, tap, mergeMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AssignmentDialogComponent, AssignmentParams, AssignmentSettings, AssignmentModel } from '../components/assignment/assignment-dialog.component';
import { Subject, of } from 'rxjs';
import { selectSelectedElement } from './process-editor.selectors';
import { TaskAssignmentService } from '../services/cardview-properties/task-assignment-item/task-assignment.service';

@Injectable()
export class ProcessTaskAssignmentEffects extends BaseEffects {

    constructor(
        protected logService: LogService,
        protected router: Router,
        private actions$: Actions,
        private dialogService: DialogService,
        private taskAssignmentService: TaskAssignmentService,
        @Inject(ProcessModelerServiceToken) private processModelerService: ProcessModelerService,
        private store: Store<AmaState>
    ) {
        super(router, logService);
    }

    @Effect({ dispatch: false })
    openTaskAssignmentDialogEffect = this.actions$.pipe(
        ofType<OpenTaskAssignmentDialogAction>(OPEN_TASK_ASSIGNMENT_DIALOG),
        switchMap(() => this.store.select(selectSelectedElement).pipe(take(1))),
        tap((element) => this.openTaskAssignmentDialog(this.processModelerService.getElement(element.id))
    ));

    @Effect()
    updateTaskAssignmentEffect = this.actions$.pipe(
        ofType<UpdateTaskAssignmentAction>(UPDATE_TASK_ASSIGNMENT_VARIABLES),
        map((action: UpdateTaskAssignmentAction) => {
            const shapeId = action.payload.id;
            action.payload.data.assignments.forEach((assignment: AssignmentParams) => {
                this.processModelerService.updateElementProperty(shapeId, assignment.key, assignment.value);
            });
        }),
        mergeMap(() => of(new SetAppDirtyStateAction(true)))
    );

    private openTaskAssignmentDialog(element: Bpmn.DiagramElement) {
        const processId = element.businessObject.$parent.$type === 'bpmn:SubProcess' ? this.findParentProcess(element.businessObject.$parent).id :
            element.businessObject.$parent.id;
        const assignmentUpdate$ = new Subject<AssignmentModel> ();
        const shapeId = element.id;
        this.dialogService.openDialog(AssignmentDialogComponent, {
            disableClose: true,
            height: '500px',
            width: '900px',
            data: <AssignmentSettings> { shapeId: shapeId, ...this.taskAssignmentService.getAssignments(element), assignmentUpdate$, processId: processId },
        });

        assignmentUpdate$.subscribe((assignments: AssignmentModel) => {
            this.store.dispatch(new UpdateTaskAssignmentAction({ id: shapeId, data: assignments }));
            this.taskAssignmentService.assignmentSubject.next(assignments);
        });
    }

    private findParentProcess(element) {
        if (element.$type === 'bpmn:Process') { return element; }
        for (const i in element) {
            if (element.hasOwnProperty(i)) {
                const parentProcess = this.findParentProcess(element.$parent);
                if (parentProcess) { return parentProcess; }
            }
        }
        return null;
    }
}
