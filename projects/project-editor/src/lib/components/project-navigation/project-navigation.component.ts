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
    ModelImporter, CONNECTOR, selectMenuOpened
} from '@alfresco-dbp/modeling-shared/sdk';
import { AppConfigService } from '@alfresco/adf-core';

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
    enableCustomConnectors: boolean;

    constructor(
        private store: Store<AmaState>,
        @Inject(MODEL_CREATORS) modelCreators: ModelCreator[],
        @Optional() @Inject(MODEL_IMPORTERS) private importers: ModelImporter[],
        private appConfig: AppConfigService
    ) {
        this.enableCustomConnectors = this.isCustomConnectorsEnabled();
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

    public isAllowed(creator: ModelCreator, action: 'create' | 'upload'): boolean {
        let allow = true;
        switch (action) {
            case 'create':
                allow = !creator.disableCreate;
                break;
            case 'upload':
                allow = !creator.disableUpload;
                break;
        }

        return allow && (creator.type !== CONNECTOR || this.isCustomConnectorsEnabled());
    }

    public getKey(creator: ModelCreator): string {
        return creator.key || creator.type;
    }

    private isCustomConnectorsEnabled(): boolean {
        return this.appConfig.get('enableCustomConnectors') === false ? false : true;
    }
}
