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
    ProcessModelerServiceToken,
    ProcessModelerService,
    AmaState,
    SetAppDirtyStateAction,
    BpmnProperty
} from '@alfresco-dbp/modeling-shared/sdk';
import { DialogService } from '@alfresco-dbp/adf-candidates/core/dialog';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { switchMap, take, map, tap, mergeMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AssignmentParams, AssignmentModel } from '../components/assignment/assignment-dialog.component';
import { Subject, of } from 'rxjs';
import { selectSelectedElement } from './process-editor.selectors';
import {
    OpenCandidateStartersDialogAction,
    OPEN_CANDIDATE_STARTERS_DIALOG,
    UpdateCandidateStartersAction,
    UPDATE_CANDIDATE_STARTERS_VARIABLES
} from './process-candidate-starters.action';
import { CandidateStartersDialogComponent, CandidateStartersSettings } from '../components/candidate-starters-dialog/candidate-starters-dialog.component';
import { CandidateStartersService } from '../services/cardview-properties/candidate-starters-item/candidate-starters-item.service';

@Injectable()
export class ProcessCandidateStartersEffects {

    constructor(
        private actions$: Actions,
        private dialogService: DialogService,
        private candidateStartersService: CandidateStartersService,
        @Inject(ProcessModelerServiceToken) private processModelerService: ProcessModelerService,
        private store: Store<AmaState>
    ) {}


    openCandidateStartersDialogEffect = createEffect(() => this.actions$.pipe(
        ofType<OpenCandidateStartersDialogAction>(OPEN_CANDIDATE_STARTERS_DIALOG),
        switchMap(() => this.store.select(selectSelectedElement).pipe(take(1))),
        tap((element) => this.openCandidateStartersDialog(this.processModelerService.getElement(element.id)))
    ), { dispatch: false });


    updateCandidateStartersEffect = createEffect(() => this.actions$.pipe(
        ofType<UpdateCandidateStartersAction>(UPDATE_CANDIDATE_STARTERS_VARIABLES),
        map((action: UpdateCandidateStartersAction) => {
            const shapeId = action.payload.id;
            this.updateCandidateStartersXmlProperty(action, shapeId);
        }),
        mergeMap(() => of(new SetAppDirtyStateAction(true)))
    ));

    private updateCandidateStartersXmlProperty(action: UpdateCandidateStartersAction, shapeId: string) {
        if (!action.payload.data) {
            this.removeCandidateStartersPropertyFromXml(shapeId);
        } else {
            this.updateCandidateStartersProperty(action, shapeId);
        }
    }

    private updateCandidateStartersProperty(action: UpdateCandidateStartersAction, shapeId: string) {
        action.payload.data.assignments.forEach((assignment: AssignmentParams) => {
            this.processModelerService.updateElementProperty(shapeId, assignment.key, assignment.value);
        });
    }

    private removeCandidateStartersPropertyFromXml(shapeId: string) {
        this.processModelerService.updateElementProperty(shapeId, BpmnProperty.candidateStarterUsers, undefined);
        this.processModelerService.updateElementProperty(shapeId, BpmnProperty.candidateStarterGroups, undefined);
    }

    private openCandidateStartersDialog(element: Bpmn.DiagramElement) {
        const processId = element.businessObject.$parent.id;
        const candidateStartersUpdate$ = new Subject<AssignmentModel> ();
        const shapeId = element.id;
        this.dialogService.openDialog(CandidateStartersDialogComponent, {
            disableClose: false,
            height: '400px',
            width: '800px',
            data: <CandidateStartersSettings> { shapeId: shapeId, ...this.candidateStartersService.getCandidateStarters(element), candidateStartersUpdate$, processId: processId },
        });

        candidateStartersUpdate$.subscribe((assignments: AssignmentModel) => {
            this.store.dispatch(new UpdateCandidateStartersAction({ id: shapeId, data: assignments }));
        });
    }
}
