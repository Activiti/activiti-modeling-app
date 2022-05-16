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

import { Component, Inject, AfterContentInit, Optional, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
    AmaState, selectSelectedProjectId, ModelCreatorDialogParams,
    MODEL_CREATORS, ModelCreator, OpenEntityDialogAction, MODEL_IMPORTERS,
    ModelImporter, selectMenuOpened, OpenDialogAction
} from '@alfresco-dbp/modeling-shared/sdk';
import { ProjectElementCreateDialogComponent } from '../project-element-create-dialog/project-element-create-dialog.component';

const orderBy = require('lodash/orderBy');

@Component({
    templateUrl: './project-navigation.component.html',
    styleUrls: ['./project-navigation.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProjectNavigationComponent implements AfterContentInit {
    expanded$: Observable<boolean>;
    selectedProjectId$: Observable<string>;
    public creators: ModelCreator[];

    constructor(private store: Store<AmaState>,
        @Inject(MODEL_CREATORS) modelCreators: ModelCreator[],
                @Optional() @Inject(MODEL_IMPORTERS) private importers: ModelImporter[]) {
        this.creators = orderBy(modelCreators, ['order'], ['asc']);
    }

    isImportEnabled() {
        return this.importers !== null ? this.importers.length > 0 : false;
    }

    openModelCreationDialog(dialogParams: ModelCreatorDialogParams): void {
        this.store.dispatch(new OpenEntityDialogAction(dialogParams));
    }

    ngAfterContentInit() {
        this.expanded$ = this.store.select(selectMenuOpened);
        this.selectedProjectId$ = this.store.select(selectSelectedProjectId);
    }

    openDialog() {
        this.store.dispatch(new OpenDialogAction(ProjectElementCreateDialogComponent, {
            height: '400px',
            width: '680px',
            panelClass: 'ama-create-element-dialog',
            data: {}
        }));
    }
}
