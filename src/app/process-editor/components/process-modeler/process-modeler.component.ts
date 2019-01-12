 /*!
 * @license
 * Copyright 2018 Alfresco, Inc. and/or its affiliates.
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

import { Component, ViewChild, ElementRef, Input, OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { ProcessModelerService } from '../../services/process-modeler.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil, switchMap, filter, map } from 'rxjs/operators';
import { ProcessContent, SnackbarErrorAction } from 'ama-sdk';
import { ProcessEditorState } from '../../store/process-editor.state';
import { Store } from '@ngrx/store';
import {
    SelectModelerElementAction,
    ChangedProcessAction,
    RemoveDiagramElementAction
} from '../../store/process-editor.actions';

@Component({
    selector: 'ama-process-modeler',
    templateUrl: './process-modeler.component.html'
})
export class ProcessModelerComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('canvas') canvas: ElementRef;

    diagramData$: BehaviorSubject<ProcessContent> = new BehaviorSubject<ProcessContent>(null);
    onDestroy$: Subject<void> = new Subject<void>();

    @Input()
    set source(diagramData: string) {
        this.diagramData$.next(diagramData);
    }

    constructor(private store: Store<ProcessEditorState>, private processModelerService: ProcessModelerService) {}

    ngOnInit() {
        this.processModelerService.init({
            clickHandler: event =>
                this.store.dispatch(new SelectModelerElementAction(this.createSelectedElement(event))),
            changeHandler: event => this.store.dispatch(new ChangedProcessAction(this.createSelectedElement(event))),
            removeHandler: event =>
                this.store.dispatch(new RemoveDiagramElementAction(this.createSelectedElement(event))),
            selectHandler: event => {
                if (event.newSelection[0]) {
                    this.store.dispatch(
                        new SelectModelerElementAction(
                            this.createSelectedElement({
                                element: event.newSelection[0]
                            })
                        )
                    );
                }
            }
        });
    }

    createSelectedElement(event) {
        return {
            id: event.element.id,
            type: event.element.type,
            name: event.element.businessObject.name || ''
        };
    }

    ngAfterViewInit() {
        this.processModelerService.render(this.canvas.nativeElement);

        this.diagramData$
            .pipe(
                filter(diagramData => diagramData !== null),
                switchMap(diagramData => this.processModelerService.loadXml(diagramData)),
                map(() => {
                    const element = this.createSelectedElement({ element: this.processModelerService.getRootProcessElement() });
                    this.store.dispatch(new SelectModelerElementAction(element));
                }),
                takeUntil(this.onDestroy$)
            )
            .subscribe(
                () => this.processModelerService.fitViewPort(),
                (e) => this.store.dispatch(new SnackbarErrorAction('APP.PROCESS_EDITOR.ERRORS.LOAD_DIAGRAM'))
            );
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
        this.processModelerService.destroy();
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
