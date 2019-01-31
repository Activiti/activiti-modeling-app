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
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectMenuOpened } from '../../../store/selectors/app.selectors';
import { OpenEntityDialogAction } from '../../../store/actions/dialog';
import { AmaState, selectSelectedProjectId, ModelCreatorDialogParams, MODEL_CREATORS, ModelCreator } from 'ama-sdk';
const orderBy = require('lodash/orderBy');

@Component({
    templateUrl: './project-navigation.component.html'
})
export class ProjectNavigationComponent {
    expanded$: Observable<boolean>;
    selectedProjectId$: Observable<string>;
    public creators:  ModelCreator[];

    constructor(
        private store: Store<AmaState>,
        @Inject(MODEL_CREATORS) modelCreators: ModelCreator[]
    ) {
        this.expanded$ = this.store.select(selectMenuOpened);
        this.selectedProjectId$ = this.store.select(selectSelectedProjectId);
        this.creators = orderBy(modelCreators, ['order'], ['asc']);
    }

    openModelCreationDialog(dialogParams: ModelCreatorDialogParams): void {
        this.store.dispatch(new OpenEntityDialogAction(dialogParams));
    }
}
