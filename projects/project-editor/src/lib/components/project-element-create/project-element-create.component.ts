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

import { AmaState, CONNECTOR, ModelCreator, MODEL_CREATORS, OpenEntityDialogAction, selectSelectedProjectId } from '@alfresco-dbp/modeling-shared/sdk';
import { AppConfigService } from '@alfresco/adf-core';
import { Component, EventEmitter, Inject, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

const orderBy = require('lodash/orderBy');

export enum ActionTypes {
    CREATE_ACTION = 'create',
    UPLOAD_ACTION = 'upload',
    IMPORT_ACTION = 'import'
}
@Component({
    selector: 'ama-project-element-create',
    templateUrl: './project-element-create.component.html',
    styleUrls: ['./project-element-create.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ProjectElementCreateComponent implements OnInit {

    @Output()
    actionExecuted = new EventEmitter();

    creators: ModelCreator[];
    selectedProjectId$: Observable<string>;

    public get ActionTypes() {
        return ActionTypes;
    }

    constructor(private store: Store<AmaState>,
        @Inject(MODEL_CREATORS) modelCreators: ModelCreator[],
                private appConfig: AppConfigService) {
        this.creators = orderBy(modelCreators, ['order'], ['asc']);
    }

    ngOnInit(): void {
        this.selectedProjectId$ = this.store.select(selectSelectedProjectId);
    }

    onCreateElementClicked(creator: ModelCreator) {
        this.store.dispatch(new OpenEntityDialogAction(creator.dialog));
        this.actionExecuted.emit();
    }

    public getKey(creator: ModelCreator): string {
        return creator.key || creator.type;
    }

    onExecute() {
        this.actionExecuted.emit();
    }

    public isAllowed(creator: ModelCreator, action: ActionTypes): boolean {
        let allow = true;
        switch (action) {
        case ActionTypes.CREATE_ACTION:
            allow = !creator.disableCreate;
            break;
        case ActionTypes.UPLOAD_ACTION:
            allow = !creator.disableUpload;
            break;
        }

        return allow && (creator.type !== CONNECTOR || this.isCustomConnectorsEnabled());
    }

    private isCustomConnectorsEnabled(): boolean {
        return this.appConfig.get('enableCustomConnectors') === false ? false : true;
    }

}
