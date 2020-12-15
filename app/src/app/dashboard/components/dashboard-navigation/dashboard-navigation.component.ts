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

import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';
import { AppConfigService } from '@alfresco/adf-core';
import { AmaState } from '@alfresco-dbp/modeling-shared/sdk';
import { selectMenuOpened } from '../../../store/selectors/app.selectors';

export interface CreateAction {
    title: string;
    icon: string;
    handler: string;
}

@Component({
    templateUrl: './dashboard-navigation.component.html'
})
export class DashboardNavigationComponent implements OnInit, AfterContentInit {
    expanded$: Observable<boolean>;
    navigation: any[];

    actions$ = new BehaviorSubject<CreateAction[]>([]);

    constructor(
        private store: Store<AmaState>,
        private appConfig: AppConfigService
    ) {}

    ngOnInit() {
        this.actions$.next(this.appConfig.get<CreateAction[]>('create', []));
        this.navigation = this.buildMenu();
    }

    ngAfterContentInit() {
        this.expanded$ = this.store.select(selectMenuOpened);
    }

    private buildMenu() {
        const schema = this.appConfig.get('navigation');
        const data = Array.isArray(schema) ? { main: schema } : schema;

        return Object.keys(data).map(key => data[key]);
    }

    runAction(type: string) {
        this.store.dispatch({ type });
    }
}
