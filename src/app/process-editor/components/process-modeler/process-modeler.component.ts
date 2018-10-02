/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, ViewChild, ElementRef, Input, OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { getEmptyDiagram } from './empty-diagram';
import { ProcessModelerService } from '../../services/process-modeler.service';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil, switchMap, take } from 'rxjs/operators';
import { ProcessDiagramData } from 'ama-sdk';
import { filter } from 'rxjs/operators';
import { ProcessEditorState } from '../../store/process-editor.state';
import { Store } from '@ngrx/store';
import {
    SelectModelerElementAction,
    ChangedProcessAction,
    RemoveDiagramElementAction
} from '../../store/process-editor.actions';
import { SnackbarErrorAction } from '../../../store/actions';
import { selectProcess } from '../../store/process-editor.selectors';

@Component({
    selector: 'ama-process-modeler',
    templateUrl: './process-modeler.component.html'
})
export class ProcessModelerComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('canvas') canvas: ElementRef;

    diagramData$: BehaviorSubject<ProcessDiagramData> = new BehaviorSubject<ProcessDiagramData>(null);
    onDestroy$: Subject<void> = new Subject<void>();

    @Input()
    set source(diagramData: string) {
        this.store.select(selectProcess).pipe(take(1)).subscribe(process => {
            if (diagramData === '') {
                diagramData = getEmptyDiagram(process);
            }
            this.diagramData$.next(diagramData);
        });
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
