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

import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectToolbarLogsVisibility, selectLogsByInitiator } from '../../store/app.selectors';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AmaState, LogMessage, LogMessageInitiator } from '../../store/app.state';
import { EditorFooterService, EDITOR_FOOTER_SERVICE_TOKEN } from '../../services/editor-footer.service.interface';
import { LOG_FILTER_ITEM_TOKEN } from '../../helpers/utils/log-filters';

@Component({
    selector: 'modelingsdk-editor-footer',
    styleUrls: ['./editor-footer.component.scss'],
    templateUrl: './editor-footer.component.html',
    encapsulation: ViewEncapsulation.None
})
export class EditorFooterComponent {
    filters: LogMessageInitiator[];
    showConsole$: Observable<boolean>;
    filterType: LogMessageInitiator;
    logs$: Observable<LogMessage[]>;

    constructor(
        @Inject(EDITOR_FOOTER_SERVICE_TOKEN) public editorFooterService: EditorFooterService,
        @Inject( LOG_FILTER_ITEM_TOKEN ) private logFilters: LogMessageInitiator[],
        private store: Store<AmaState>
    ) {
        this.showConsole$ = this.store.select(selectToolbarLogsVisibility);
        this.logs$ = this.editorFooterService.logs$;
        this.filters = [].concat(...this.logFilters) || [];
    }

    toggleConsole() {
        this.showConsole$.pipe(take(1)).subscribe(
            showConsole => this.editorFooterService.setHistoryVisibility(!showConsole)
        );
    }

    clearLogs() {
        this.editorFooterService.clearLogs();
    }

    changeFilter() {
        this.logs$ = this.store.select(selectLogsByInitiator(this.filterType));
    }
}
