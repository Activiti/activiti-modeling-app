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

import { Component, Input, Inject, ViewEncapsulation, OnDestroy, Output, EventEmitter, OnInit } from '@angular/core';
import { MODEL_IMPORTERS, ModelImporter, Model, sanitizeString, AmaState } from '@alfresco-dbp/modeling-shared/sdk';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { LogService } from '@alfresco/adf-core';

export interface MenuItem {
    displayName: string;
    description: string;
    iconName: string;
    id: string;
}

@Component({
    selector: 'ama-project-import-select-list',
    templateUrl: './project-import-select-list.component.html',
    styleUrls: ['./project-import-select-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ProjectImportSelectListComponent implements OnInit, OnDestroy {
    @Input()
    projectId: string;

    @Output()
    importSelected = new EventEmitter();

    private loadingStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private currentImporter$: Subject<ModelImporter> = new Subject();

    isLoading = this.loadingStatus.asObservable();
    items: MenuItem[] = [];
    onDestroy$: Subject<void> = new Subject<void>();
    selectedTabIndex = 0;

    constructor(private store: Store<AmaState>,
                private logger: LogService,
                @Inject(MODEL_IMPORTERS) public importers: ModelImporter[]) {
        importers.flatMap((importer) => {
            const isImporterSelected$ = this.currentImporter$.pipe(
                filter((currentImporter) => importer.type === currentImporter.type),
                takeUntil(this.onDestroy$));
            combineLatest([importer.getGlobalModels(), isImporterSelected$]).pipe(takeUntil(this.onDestroy$)).subscribe(([models, currentImporter]) => {
                this.items = this.getMenuItemFromModels(models, currentImporter.icon);
                this.loadingStatus.next(false);
            });
        });
    }

    ngOnInit(): void {
        this.onModelTypeChange();
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    onModelTypeChange() {
        this.loadingStatus.next(true);
        this.currentImporter$.next(this.importers[this.selectedTabIndex]);
    }

    private getMenuItemFromModels(globalModels: Model[], iconName: string): MenuItem[] {
        const items: MenuItem[] = [];

        if (globalModels && globalModels.length > 0) {
            globalModels.forEach(model => {
                if (!model.projectIds || model.projectIds.indexOf(this.projectId) < 0) {
                    items.push({ displayName: model.name, description: model.description, iconName, id: model.id });
                }
            });
        }
        return items;
    }

    getDataAutomationFromDisplayName(displayName: string, currentImporter): string {
        const importerType = currentImporter?.type ? currentImporter.type : 'none';
        return 'app-navigation-import-' + importerType + '-' + sanitizeString(displayName.trim().toLowerCase().replace(/(\s)+/g, '-'));
    }

    onImport(modelId: string, currentImporter: ModelImporter): void {
        try {
            const ActionClass = currentImporter.action;

            this.store.dispatch(new ActionClass(this.projectId, modelId));
            this.importSelected.emit('success');
        } catch (error) {
            this.logger.error('Problem occurred while trying to import model.');
            this.logger.error(error);
            this.importSelected.emit('error');
        }
    }
}
