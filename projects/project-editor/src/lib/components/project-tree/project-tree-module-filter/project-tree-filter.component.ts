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

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, Inject, Optional, ViewEncapsulation } from '@angular/core';
import { MODEL_TYPE, ModelFilter, ModelCreator, AmaState, MODEL_CREATORS, OpenEntityDialogAction, ModelScope, Model, CONNECTOR } from '@alfresco-dbp/modeling-shared/sdk';
import { Store } from '@ngrx/store';
import { AppConfigService } from '@alfresco/adf-core';

@Component({
    selector: 'ama-project-tree-filter',
    templateUrl: './project-tree-filter.component.html',
    styleUrls: ['./project-tree-filter.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectTreeFilterComponent implements OnInit {
    @Input() projectId: string;
    @Input() filter: ModelFilter;
    @Input() contents: any[];
    @Input() loading: boolean;
    @Input() expanded: boolean;
    @Output() opened = new EventEmitter<{ projectId: string; type: string, loadData: boolean }>();
    @Output() closed = new EventEmitter<{ type: string }>();

    ignoreOpenEmit: boolean;

    constructor(
        private store: Store<AmaState>,
        @Optional()
        @Inject(MODEL_CREATORS)
        private creators: ModelCreator[],
        private appConfig: AppConfigService
    ) {}

    ngOnInit() {
        if (this.expanded) {
            this.ignoreOpenEmit = true;
        }
    }

    contentsAreEmpty(): boolean {
        return !(this.contents && this.contents.length);
    }

    filterClosed(type: MODEL_TYPE): void {
        this.closed.emit({ type });
    }

    filterOpened(type: MODEL_TYPE): void {
        this.opened.emit({ projectId: this.projectId, type, loadData: !this.ignoreOpenEmit });

        if (!this.ignoreOpenEmit) {
            this.ignoreOpenEmit = false;
        }
    }

    openModelCreationModal(event: Event): void {
        event.stopPropagation();

        if (this.creators && this.creators.length > 0) {
            const modelCreator = this.creators.find(creator => creator.type === this.filter.type);

            if (modelCreator) {
                this.store.dispatch(new OpenEntityDialogAction(modelCreator.dialog));
            }
        }
    }

    isScopeGlobal(content: Model): boolean {
        return content.scope === ModelScope.GLOBAL;
    }

    isAllowed(type: MODEL_TYPE): boolean {
        return type !== CONNECTOR || this.isCustomConnectorsEnabled();
    }

    private isCustomConnectorsEnabled(): boolean {
        return this.appConfig.get('enableCustomConnectors') === false ? false : true;
    }

}
