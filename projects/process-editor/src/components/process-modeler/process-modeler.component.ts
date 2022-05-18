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

import { Component, ElementRef, Input, OnDestroy, OnInit, Output, EventEmitter, Inject, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil } from 'rxjs/operators';
import {
    ProcessContent,
    SnackbarErrorAction,
    ProcessModelerServiceToken,
    ProcessModelerService,
    SetAppDirtyStateAction,
    BpmnElement,
    BpmnProperty,
    StatusBarService
} from '@alfresco-dbp/modeling-shared/sdk';
import { Store } from '@ngrx/store';
import {
    SelectModelerElementAction,
    RemoveDiagramElementAction
} from '../../store/process-editor.actions';
import { ProcessEntitiesState } from '../../store/process-entities.state';
import { ProcessDiagramLoaderService } from '../../services/process-diagram-loader.service';
import { createSelectedElement, SelectedProcessElement } from '../../store/process-editor.state';
import { TaskAssignmentService } from '../../services/cardview-properties/task-assignment-item/task-assignment.service';
import { selectSelectedElement } from '../../store/process-editor.selectors';

@Component({
    selector: 'ama-process-modeler',
    templateUrl: './process-modeler.component.html',
    styleUrls: ['./process-modeler.component.scss', './process-modeler-bpmnjs.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'ama-process-modeler ama-canvas-editor' }
})
export class ProcessModelerComponent implements OnInit, OnDestroy {

    diagramData$ = new BehaviorSubject<ProcessContent>(null);
    onDestroy$ = new Subject<void>();
    currentProcessSelected = '';

    // eslint-disable-next-line
    @Output()
    onChange = new EventEmitter<any>();

    @Input()
    set source(diagramData: ProcessContent) {
        this.diagramData$.next(diagramData);
    }

    constructor(
        private store: Store<ProcessEntitiesState>,
        @Inject(ProcessModelerServiceToken) private processModelerService: ProcessModelerService,
        private processLoaderService: ProcessDiagramLoaderService,
        private canvas: ElementRef,
        private statusBarService: StatusBarService,
        private taskAssignmentService: TaskAssignmentService
    ) { }

    ngOnInit() {
        this.store
            .select(selectSelectedElement).pipe(
                filter(element => !!element),
                take(1))
            .subscribe((selectedElement: SelectedProcessElement) => {
                this.currentProcessSelected = selectedElement.id;
            });
        this.processModelerService.init({
            clickHandler: event => {
                this.store.dispatch(new SelectModelerElementAction(createSelectedElement(event.element)));
                this.statusBarService.setText(event.element.type);
            },
            changeHandler: event => {
                this.store.dispatch(new SetAppDirtyStateAction(true));
                this.onChange.emit(event);
            },
            removeHandler: event =>
                this.store.dispatch(new RemoveDiagramElementAction(createSelectedElement(event.element))),
            selectHandler: event => {
                if (event.newSelection[0]) {
                    this.store.dispatch(
                        new SelectModelerElementAction(
                            createSelectedElement(event.newSelection[0])
                        )
                    );
                }
            },
            createHandler: event => {
                const element = createSelectedElement(event.elements[0]);
                if (element.type === BpmnElement.CallActivity) {
                    this.processModelerService.updateElementProperty(element.id, BpmnProperty.inheritBusinessKey, true);
                }
            },
            copyActionHandler: event => {
                this.taskAssignmentService.copyActionHandler(this.currentProcessSelected);
            },
            pasteActionHandler: event => {
                this.taskAssignmentService.pasteActionHandler(event, this.currentProcessSelected);
            }
        });

        this.processModelerService.render(this.canvas.nativeElement);

        this.diagramData$
            .pipe(
                filter(diagramData => diagramData !== null),
                switchMap(diagramData => this.processLoaderService.load(diagramData)),
                takeUntil(this.onDestroy$)
            )
            .subscribe(
                () => { },
                () => this.store.dispatch(new SnackbarErrorAction('PROCESS_EDITOR.ERRORS.LOAD_DIAGRAM'))
            );
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
        this.processModelerService.destroy();
    }

    fitViewPort() {
        this.processModelerService.fitViewPort();
    }

    zoomIn() {
        this.processModelerService.zoomIn();
    }

    zoomOut() {
        this.processModelerService.zoomOut();
    }

    undo() {
        this.processModelerService.undo();
    }

    redo() {
        this.processModelerService.redo();
    }
}
