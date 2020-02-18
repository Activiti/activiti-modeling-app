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

import { Component, Inject } from '@angular/core';
import { EDITOR_FOOTER_SERVICE_TOKEN, EditorFooterService } from './editor-footer.service.interface';
import { Store } from '@ngrx/store';
import { AmaState, LogMessage,  LOG_FILTER_ITEM_TOKEN, LogMessageInitiator  } from '@alfresco-dbp/modeling-shared/sdk';
import { selectToolbarLogsVisibility, selectLogsByInitiator } from '../../../../app/store/selectors/app.selectors';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
    selector: 'ama-editor-footer',
    templateUrl: './editor-footer.component.html'
})
export class EditorFooterComponent {
    filters: LogMessageInitiator[];
    showConsole$: Observable<boolean>;
    filterType: LogMessageInitiator;
    logs$: Observable<LogMessage[]>;

    constructor(
            @Inject(EDITOR_FOOTER_SERVICE_TOKEN) public editorFooterService: EditorFooterService,
            @Inject( LOG_FILTER_ITEM_TOKEN ) public logFilters: LogMessageInitiator[],
            private store: Store<AmaState>
        ) {
         this.showConsole$ = this.store.select(selectToolbarLogsVisibility);
         this.logs$ = this.editorFooterService.logs$;
         this.filters = (<any>logFilters).flatten(1) || [];
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
