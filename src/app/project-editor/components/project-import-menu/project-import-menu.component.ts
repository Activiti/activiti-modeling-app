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
import { Component, Input, Inject, OnChanges, Optional } from '@angular/core';
import { sanitizeString, AmaState, Model, MODEL_IMPORTERS, ModelImporter } from '@alfresco-dbp/modeling-shared/sdk';
import { Store } from '@ngrx/store';
import { LogService } from '@alfresco/adf-core';
import { Observable } from 'rxjs';

export interface MenuItem {
    displayName: string;
    description: string;
    iconName: string;
    id: string;
}

@Component({
    selector: 'ama-project-import-menu',
    templateUrl: './project-import-menu.component.html'
})
export class ProjectImportMenuComponent implements OnChanges {
    @Input() type: string;
    @Input() projectId: string;

    items: MenuItem[] = [];

    public get importer() {
        if (this.importers) {
            return this.importers.filter(importer => importer.type === this.type)[0];
        } else {
            return null;
        }
    }

    constructor(
        private store: Store<AmaState>,
        private logger: LogService,
        @Optional() @Inject(MODEL_IMPORTERS) private importers: ModelImporter[]) { }

    ngOnChanges() {
        if (this.importer) {
            const globalModels: Observable<Model[]> = this.importer.getGlobalModels();
            globalModels.subscribe(models => { this.items = this.getMenuItemFromModels(models); });
        }
    }

    private getMenuItemFromModels(globalModels: Model[]): MenuItem[] {
        const items: MenuItem[] = [];

        if (globalModels && globalModels.length > 0) {
            globalModels.forEach(model => {
                if (!model.projectIds || model.projectIds.indexOf(this.projectId) < 0) {
                    items.push({ displayName: model.name, description: model.description, iconName: this.importer.icon, id: model.id });
                }
            }
            );
        }

        return items;
    }

    getDataAutomationFromDisplayName(displayName: string): string {
        return 'app-navigation-import-' + this.importer.type + '-' + sanitizeString(displayName.trim().toLowerCase().replace(/(\s)+/g, '-'));
    }

    onImport(modelId: String): void {
        try {
            const ActionClass = this.importer.action;

            this.store.dispatch(new ActionClass(this.projectId, modelId));
        } catch (error) {
            this.logger.error('Problem occurred while trying to import model.');
            this.logger.error(error);
        }
    }
}
