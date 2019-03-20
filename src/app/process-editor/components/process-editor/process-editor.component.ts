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

import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, take } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { selectProcessCrumb, selectProcessLoading, selectSelectedProcessDiagram } from '../../store/process-editor.selectors';
import {
    Process,
    BreadcrumbItem,
    AmaState,
    selectProjectCrumb,
    ProcessContent,
    selectSelectedProcess,
    selectSelectedTheme,
    SetAppDirtyStateAction,
    ProcessModelerService,
    ProcessModelerServiceToken,
} from 'ama-sdk';

@Component({
    templateUrl: './process-editor.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ProcessEditorComponent implements OnInit {
    loading$: Observable<boolean>;
    breadcrumbs$: Observable<BreadcrumbItem[]>;
    content$: Observable<ProcessContent>;
    bpmnContent$: Observable<ProcessContent>;
    process$: Observable<Process>;
    vsTheme$: Observable<string>;

    constructor(
        private store: Store<AmaState>,
        @Inject(ProcessModelerServiceToken) private processModeler: ProcessModelerService
    ) {
        this.vsTheme$ = this.getVsTheme();
    }

    ngOnInit() {
        this.loading$ = this.store.select(selectProcessLoading);
        this.process$ = this.store.select(selectSelectedProcess);
        this.content$ = this.store.select(selectSelectedProcessDiagram);
        this.bpmnContent$ = this.store.select(selectSelectedProcessDiagram);

        this.breadcrumbs$ = combineLatest(
            of({ url: '/home', name: 'Dashboard' }),
            this.store.select(selectProjectCrumb).pipe(filter(value => value !== null)),
            this.store.select(selectProcessCrumb).pipe(filter(value => value !== null))
        );
    }

    private getVsTheme(): Observable<string> {
        return this.store
            .select(selectSelectedTheme)
            .pipe(map(theme => (theme.className === 'dark-theme' ? 'vs-dark' : 'vs-light')));
    }

    onBpmnEditorChange(): void {
        this.processModeler.export().then(content => this.content$ = of(content));
    }

    onXmlChangeAttempt(processContent: ProcessContent): void {
        this.processModeler.loadXml(processContent)
            .pipe(take(1))
            .subscribe(() => this.store.dispatch(new SetAppDirtyStateAction(true)));
    }
}
