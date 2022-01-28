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

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { LogMessage, MESSAGE, SetLogHistoryVisibilityAction, AmaState } from '@alfresco-dbp/modeling-shared/sdk';
import { map, tap } from 'rxjs/operators';
import {
    ClearLogHistoryAction,
    selectToolbarUserMessage,
    selectToolbarInProgress,
    selectToolbarLogs,
    selectToolbarLogsVisibility
} from '../../../store';
import { EditorFooterService } from '../components/editor-footer/editor-footer.service.interface';

@Injectable({ providedIn: 'root' })
export class AppFooterService implements EditorFooterService  {
    userMessage$: Observable<string>;
    inProgress$: Observable<boolean>;
    logs$: Observable<LogMessage[]>;
    newErrorNumber$: Observable<number>;
    isNewError$: Observable<boolean>;
    logHistoryVisibility$: Observable<boolean>;

    errorNumberKnown$ = new BehaviorSubject<number>(0);
    lastlyAccumulatedErrorNumber = 0;

    constructor(private store: Store<AmaState>) {
        this.userMessage$ = this.store.select(selectToolbarUserMessage);
        this.inProgress$ = this.store.select(selectToolbarInProgress);
        this.logs$ = this.store.select(selectToolbarLogs);
        this.logHistoryVisibility$ = this.store.select(selectToolbarLogsVisibility);
        this.setErrorIndicators();
    }

    setHistoryVisibility(visibility: boolean) {
        this.errorNumberKnown$.next(this.lastlyAccumulatedErrorNumber);
        this.store.dispatch(new SetLogHistoryVisibilityAction(visibility));
    }

    clearLogs() {
        this.store.dispatch(new ClearLogHistoryAction());
    }

    private setErrorIndicators() {
        const newErrorNumber$ = combineLatest(this.logs$, this.errorNumberKnown$).pipe(
            map(([logs, errorNumberKnown]) => [logs.filter(log => log.type === MESSAGE.ERROR).length, errorNumberKnown]),
            tap(([errorNumber]) => this.lastlyAccumulatedErrorNumber = errorNumber),
            map(([errorNumber, errorNumberKnown]) => errorNumber - errorNumberKnown)
        );

        this.newErrorNumber$ = combineLatest(newErrorNumber$, this.logHistoryVisibility$).pipe(
            map(([errorNumber, visible]) => visible ? 0 : errorNumber)
        );

        this.isNewError$ = this.newErrorNumber$.pipe(
            map(newErrorNumber => newErrorNumber > 0)
        );
    }
}
