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
import { filter, map, take, catchError } from 'rxjs/operators';
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
    CodeValidatorService,
    ProcessExtensions,
    extensionsSchema,
    SnackbarErrorAction,
    EDITOR_FOOTER_SERVICE_TOKEN,
    logError
} from 'ama-sdk';
import { UpdateProcessExtensionsAction } from '../../store/process-editor.actions';
import { ProcessEditorFooterService } from '../../services/process-editor-footer.service';
import { getProcessLogInitiator } from '../../services/process-editor.constants';

@Component({
    templateUrl: './process-editor.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        { provide: EDITOR_FOOTER_SERVICE_TOKEN, useClass: ProcessEditorFooterService }
    ]
})
export class ProcessEditorComponent implements OnInit {
    loading$: Observable<boolean>;
    breadcrumbs$: Observable<BreadcrumbItem[]>;
    content$: Observable<ProcessContent>;
    bpmnContent$: Observable<ProcessContent>;
    process$: Observable<Process>;
    extensions$: Observable<string>;
    vsTheme$: Observable<string>;
    disableSave: boolean;

    constructor(
        private store: Store<AmaState>,
        private codeValidatorService: CodeValidatorService,
        @Inject(ProcessModelerServiceToken) private processModeler: ProcessModelerService
    ) {
        this.vsTheme$ = this.getVsTheme();
    }

    ngOnInit() {
        this.loading$ = this.store.select(selectProcessLoading);
        this.process$ = this.store.select(selectSelectedProcess);
        this.content$ = this.store.select(selectSelectedProcessDiagram);
        this.bpmnContent$ = this.store.select(selectSelectedProcessDiagram);
        this.extensions$ = this.process$.pipe(
            filter(process => !!process && !!process.extensions),
            map(process => JSON.stringify(process.extensions, undefined, 4).trim())
        );

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
            .pipe(
                take(1),
                catchError(error => {
                    this.store.dispatch(logError(getProcessLogInitiator(), error.message));
                    this.store.dispatch(new SnackbarErrorAction('Could not parse xml document'));
                    return of();
                })
            )
            .subscribe(() => this.store.dispatch(new SetAppDirtyStateAction(true)));
    }

    onExtensionsChangeAttempt(extensionsString: string, processId: string): void {
        const validation = this.codeValidatorService.validateJson<ProcessExtensions>(extensionsString, extensionsSchema);

        this.disableSave = !validation.valid;

        if (validation.valid) {
            this.store.dispatch(new UpdateProcessExtensionsAction({ extensions: JSON.parse(extensionsString), processId }));
            this.store.dispatch(new SetAppDirtyStateAction(true));
        }
    }
}
